"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Patient, Appointment, Task, ClinicalEvolution, PatientFile, Lead, PatientFlow,
  PlannerChecklistItem, MessageTemplate, PlanWorkflow, PlanStep,
  EvolutionRevision, ClinicSettings, ContactEvent
} from "../types";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

// --- Mappers para Supabase (camelCase <-> snake_case) ---

interface PatientDbRow { 
  id: string; 
  clinic_id: string; 
  name: string; 
  birth_date: string; 
  cpf?: string | null; 
  sex?: string | null;
  phone: string; 
  email: string; 
  status: Patient["status"]; 
  next_action?: string | null; 
  next_action_date?: string | null; 
  notes?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  version?: number | null;
}
interface AppointmentDbRow { 
  id: string; 
  clinic_id: string; 
  patient_id: string; 
  patient_name: string; 
  date: string; 
  time: string; 
  type: Appointment["type"]; 
  status: Appointment["status"]; 
  professional: string; 
  notes?: string | null; 
  duration?: number | null;
  room_or_chair?: string | null;
  preparation_interval?: number | null;
  recurrence?: string | null;
  treatment_stage?: string | null;
  reminder?: string | null;
  cleanup_interval?: number | null;
  outcome?: string | null;
  version?: number | null;
}
interface TaskDbRow { id: string; clinic_id: string; patient_id: string; patient_name: string; title: string; description: string; due_date: string; status: Task["status"]; priority: Task["priority"]; due_time?: string | null; responsible?: string | null; task_type?: string | null; origin?: string | null; waiting_condition?: string | null; next_action?: string | null; completed_at?: string | null; outcome?: string | null; version?: number | null; }
interface EvolutionDbRow { id: string; clinic_id: string; patient_id: string; date: string; professional: string; procedure: string; description: string; next_step?: string | null; recommended_return_days?: number | null; appointment_id?: string | null; complication?: string | null; conduct?: string | null; guidance?: string | null; change_reason?: string | null; version?: number | null; }
interface FileDbRow { id: string; clinic_id: string; patient_id: string; name: string; upload_date: string; size: string; mime_type: string; download_url: string; title?: string | null; category?: string | null; notes?: string | null; external_url?: string | null; appointment_id?: string | null; planner_id?: string | null; evolution_id?: string | null; version?: number | null; }
interface LeadDbRow { id: string; clinic_id: string; name: string; phone: string; source: string; status: Lead["status"]; last_contact_date?: string | null; notes?: string | null; version?: number | null; }
interface FlowDbRow { id: string; clinic_id: string; title: string; stages?: PatientFlow["stages"] | null; }

interface TemplateDbRow {
  id: string;
  clinic_id: string;
  title: string;
  body_text: string;
  is_active: boolean;
  created_at: string;
}

const mapTemplateFromDb = (db: TemplateDbRow): MessageTemplate => ({
  id: db.id,
  clinicId: db.clinic_id,
  title: db.title,
  bodyText: db.body_text,
  isActive: db.is_active,
  createdAt: db.created_at
});

const mapPatientFromDb = (db: PatientDbRow): Patient => {
  let notes = db.notes || "";
  let legacyMeta: Partial<Patient> = {};

  const metaIndex = notes.indexOf("\n\n[META:");
  if (metaIndex !== -1) {
    try {
      const metaStr = notes.substring(metaIndex + 8, notes.length - 1);
      legacyMeta = JSON.parse(metaStr) as Partial<Patient>;
      notes = notes.substring(0, metaIndex);
    } catch (e) {
      console.warn("Falha ao ler metadados do paciente:", e);
    }
  }

  return {
    id: db.id,
    clinicId: db.clinic_id,
    name: db.name,
    birthDate: db.birth_date,
    cpf: db.cpf || undefined,
    sex: db.sex === "female" || db.sex === "male" || db.sex === "intersex" ? db.sex : "not_informed",
    phone: db.phone,
    email: db.email,
    status: db.status,
    nextAction: db.next_action || undefined,
    nextActionDate: db.next_action_date || undefined,
    notes: notes || undefined,
    
    // Mapeamento físico prioritário com fallback para legado
    address: db.street || legacyMeta.address || undefined,
    addressNumber: db.number || legacyMeta.addressNumber || undefined,
    addressComplement: db.complement || legacyMeta.addressComplement || undefined,
    neighborhood: db.neighborhood || legacyMeta.neighborhood || undefined,
    city: db.city || legacyMeta.city || undefined,
    state: db.state || legacyMeta.state || undefined,
    postalCode: db.cep || legacyMeta.postalCode || undefined
    ,version: db.version || undefined
  };
};

const mapPatientToDb = (p: Partial<Patient>) => {
  return {
    ...(p.id && { id: p.id }),
    ...(p.clinicId && { clinic_id: p.clinicId }),
    ...(p.name && { name: p.name }),
    ...(p.birthDate && { birth_date: p.birthDate }),
    ...(p.cpf !== undefined && { cpf: p.cpf }),
    ...(p.sex && { sex: p.sex }),
    ...(p.phone && { phone: p.phone }),
    ...(p.email && { email: p.email }),
    ...(p.status && { status: p.status }),
    ...(p.nextAction !== undefined && { next_action: p.nextAction }),
    ...(p.nextActionDate !== undefined && { next_action_date: p.nextActionDate }),
    notes: p.notes || "",
    
    // Persistência direta em colunas físicas do Supabase
    ...(p.postalCode !== undefined && { cep: p.postalCode }),
    ...(p.address !== undefined && { street: p.address }),
    ...(p.addressNumber !== undefined && { number: p.addressNumber }),
    ...(p.addressComplement !== undefined && { complement: p.addressComplement }),
    ...(p.neighborhood !== undefined && { neighborhood: p.neighborhood }),
    ...(p.city !== undefined && { city: p.city }),
    ...(p.state !== undefined && { state: p.state })
  };
};

const mapAppointmentFromDb = (db: AppointmentDbRow): Appointment => {
  let notes = db.notes || "";
  let legacyMeta: Partial<Appointment> = {};

  const metaIndex = notes.indexOf("\n\n[META:");
  if (metaIndex !== -1) {
    try {
      const metaStr = notes.substring(metaIndex + 8, notes.length - 1);
      legacyMeta = JSON.parse(metaStr) as Partial<Appointment>;
      notes = notes.substring(0, metaIndex);
    } catch (e) {
      console.warn("Falha ao ler metadados do agendamento:", e);
    }
  }

  return {
    id: db.id,
    clinicId: db.clinic_id,
    patientId: db.patient_id,
    patientName: db.patient_name,
    date: db.date,
    time: db.time,
    type: db.type,
    status: db.status,
    professional: db.professional,
    notes: notes || undefined,
    
    // Mapeamento das novas colunas físicas com fallback para metadados legados
    duration: db.duration !== null && db.duration !== undefined ? db.duration : (legacyMeta.duration || undefined),
    roomOrChair: db.room_or_chair || legacyMeta.roomOrChair || undefined,
    preparationInterval: db.preparation_interval !== null && db.preparation_interval !== undefined ? db.preparation_interval : (legacyMeta.preparationInterval || undefined),
    recurrence: db.recurrence || legacyMeta.recurrence || undefined,
    treatmentStage: db.treatment_stage || legacyMeta.treatmentStage || undefined,
    reminder: db.reminder || legacyMeta.reminder || undefined
    ,cleanupInterval: db.cleanup_interval ?? undefined,
    outcome: db.outcome || undefined,
    version: db.version || undefined
  };
};

const mapAppointmentToDb = (a: Partial<Appointment>) => {
  return {
    ...(a.id && { id: a.id }),
    ...(a.clinicId && { clinic_id: a.clinicId }),
    ...(a.patientId && { patient_id: a.patientId }),
    ...(a.patientName && { patient_name: a.patientName }),
    ...(a.date && { date: a.date }),
    ...(a.time && { time: a.time }),
    ...(a.type && { type: a.type }),
    ...(a.status && { status: a.status }),
    ...(a.professional && { professional: a.professional }),
    notes: a.notes || "",
    
    // Persistência nas colunas físicas
    ...(a.duration !== undefined && { duration: a.duration }),
    ...(a.roomOrChair !== undefined && { room_or_chair: a.roomOrChair }),
    ...(a.preparationInterval !== undefined && { preparation_interval: a.preparationInterval }),
    ...(a.recurrence !== undefined && { recurrence: a.recurrence }),
    ...(a.treatmentStage !== undefined && { treatment_stage: a.treatmentStage }),
    ...(a.reminder !== undefined && { reminder: a.reminder })
    ,...(a.cleanupInterval !== undefined && { cleanup_interval: a.cleanupInterval }),
    ...(a.outcome !== undefined && { outcome: a.outcome || null })
  };
};

const mapTaskFromDb = (db: TaskDbRow): Task => {
  let description = db.description || "";
  let metaData: Partial<Task> = {};
  
  const metaIndex = description.indexOf("\n\n[META:");
  if (metaIndex !== -1) {
    try {
      const metaStr = description.substring(metaIndex + 8, description.length - 1);
      metaData = JSON.parse(metaStr) as Partial<Task>;
      description = description.substring(0, metaIndex);
    } catch (e) {
      console.warn("Falha ao ler metadados da tarefa:", e);
    }
  }

  return {
    id: db.id,
    clinicId: db.clinic_id,
    patientId: db.patient_id,
    patientName: db.patient_name,
    title: db.title,
    description: description,
    dueDate: db.due_date,
    status: db.status,
    priority: db.priority,
    ...metaData,
    dueTime: db.due_time || metaData.dueTime,
    responsible: db.responsible || metaData.responsible,
    category: db.task_type || metaData.category,
    nextAction: db.next_action || metaData.nextAction,
    waitingCondition: db.waiting_condition || metaData.waitingCondition,
    origin: db.origin || metaData.origin
    ,completedAt: db.completed_at || undefined,
    outcome: db.outcome || undefined,
    version: db.version || undefined
  };
};

const mapTaskToDb = (t: Partial<Task>) => {
  return {
    ...(t.id && { id: t.id }),
    ...(t.clinicId && { clinic_id: t.clinicId }),
    ...(t.patientId && { patient_id: t.patientId }),
    ...(t.patientName && { patient_name: t.patientName }),
    ...(t.title && { title: t.title }),
    description: t.description || "",
    ...(t.dueDate && { due_date: t.dueDate }),
    ...(t.status && { status: t.status }),
    ...(t.priority && { priority: t.priority }),
    ...(t.dueTime !== undefined && { due_time: t.dueTime || null }),
    ...(t.responsible !== undefined && { responsible: t.responsible || null }),
    ...(t.category !== undefined && { task_type: t.category || "contact" }),
    ...(t.origin !== undefined && { origin: t.origin || null }),
    ...(t.waitingCondition !== undefined && { waiting_condition: t.waitingCondition || null }),
    ...(t.nextAction !== undefined && { next_action: t.nextAction || null }),
    ...(t.outcome !== undefined && { outcome: t.outcome || null }),
  };
};

const mapEvolutionFromDb = (db: EvolutionDbRow): ClinicalEvolution => ({
  id: db.id,
  clinicId: db.clinic_id,
  patientId: db.patient_id,
  date: db.date,
  professional: db.professional,
  procedure: db.procedure,
  description: db.description,
  nextStep: db.next_step || undefined,
  recommendedReturnDays: db.recommended_return_days || undefined,
  appointmentId: db.appointment_id || undefined,
  complication: db.complication || undefined,
  conduct: db.conduct || undefined,
  guidance: db.guidance || undefined,
  changeReason: db.change_reason || undefined,
  version: db.version || undefined,
});

const mapEvolutionToDb = (e: Partial<ClinicalEvolution>) => ({
  ...(e.id && { id: e.id }),
  ...(e.clinicId && { clinic_id: e.clinicId }),
  ...(e.patientId && { patient_id: e.patientId }),
  ...(e.date && { date: e.date }),
  ...(e.professional && { professional: e.professional }),
  ...(e.procedure && { procedure: e.procedure }),
  ...(e.description && { description: e.description }),
  ...(e.nextStep !== undefined && { next_step: e.nextStep }),
  ...(e.recommendedReturnDays !== undefined && { recommended_return_days: e.recommendedReturnDays }),
  ...(e.appointmentId !== undefined && { appointment_id: e.appointmentId }),
  ...(e.complication !== undefined && { complication: e.complication }),
  ...(e.conduct !== undefined && { conduct: e.conduct }),
  ...(e.guidance !== undefined && { guidance: e.guidance }),
  ...(e.changeReason !== undefined && { change_reason: e.changeReason }),
});

const mapFileFromDb = (db: FileDbRow): PatientFile => ({
  id: db.id,
  clinicId: db.clinic_id,
  patientId: db.patient_id,
  name: db.name,
  uploadDate: db.upload_date,
  size: db.size,
  mimeType: db.mime_type,
  downloadUrl: db.download_url,
  title: db.title || undefined,
  category: db.category || undefined,
  notes: db.notes || undefined,
  externalUrl: db.external_url || undefined,
  appointmentId: db.appointment_id || undefined,
  plannerId: db.planner_id || undefined,
  evolutionId: db.evolution_id || undefined,
  version: db.version || undefined,
});

const mapFileToDb = (f: Partial<PatientFile>) => ({
  ...(f.id && { id: f.id }),
  ...(f.clinicId && { clinic_id: f.clinicId }),
  ...(f.patientId && { patient_id: f.patientId }),
  ...(f.name && { name: f.name }),
  ...(f.uploadDate && { upload_date: f.uploadDate }),
  ...(f.size && { size: f.size }),
  ...(f.mimeType && { mime_type: f.mimeType }),
  ...(f.downloadUrl && { download_url: f.downloadUrl }),
  ...(f.title !== undefined && { title: f.title || null }),
  ...(f.category !== undefined && { category: f.category || "outros" }),
  ...(f.notes !== undefined && { notes: f.notes || null }),
  ...(f.externalUrl !== undefined && { external_url: f.externalUrl || null }),
  ...(f.appointmentId !== undefined && { appointment_id: f.appointmentId || null }),
  ...(f.plannerId !== undefined && { planner_id: f.plannerId || null }),
  ...(f.evolutionId !== undefined && { evolution_id: f.evolutionId || null }),
});

const mapLeadFromDb = (db: LeadDbRow): Lead => ({
  id: db.id,
  clinicId: db.clinic_id,
  name: db.name,
  phone: db.phone,
  source: db.source,
  status: db.status,
  lastContactDate: db.last_contact_date || undefined,
  notes: db.notes || undefined,
  version: db.version || undefined,
});

const mapFlowFromDb = (db: FlowDbRow): PatientFlow => ({
  id: db.id,
  clinicId: db.clinic_id,
  title: db.title,
  stages: db.stages || [],
});

interface WorkflowDbRow { id: string; clinic_id: string; patient_id: string; area_id: string; name: string; status: PlanWorkflow["status"]; responsible?: string | null; description?: string | null; start_date?: string | null; next_action?: string | null; version?: number | null; }
interface StepDbRow { id: string; clinic_id: string; workflow_id: string; title: string; status: PlanStep["status"]; due_date?: string | null; notes?: string | null; responsible?: string | null; sort_order: number; task_id?: string | null; depends_on?: string | null; version?: number | null; }
interface RevisionDbRow { id: string; clinic_id: string; evolution_id: string; previous_data: Record<string, unknown>; current_data: Record<string, unknown>; change_reason: string; changed_by: string; changed_at: string; }
interface SettingsDbRow { clinic_id: string; administrative_phone?: string | null; business_hours: Record<string, unknown>; resources: unknown; preferences: Record<string, unknown>; inactivity_days: number; version?: number | null; }
interface ContactDbRow { id: string; clinic_id: string; patient_id?: string | null; lead_id?: string | null; channel: ContactEvent["channel"]; outcome: string; notes?: string | null; contacted_at: string; }

const mapWorkflowFromDb = (db: WorkflowDbRow): PlanWorkflow => ({
  id: db.id, clinicId: db.clinic_id, patientId: db.patient_id, areaId: db.area_id,
  name: db.name, status: db.status, responsible: db.responsible || undefined,
  description: db.description || undefined, startDate: db.start_date || undefined,
  nextAction: db.next_action || undefined, version: db.version || undefined
});
const mapStepFromDb = (db: StepDbRow): PlanStep => ({
  id: db.id, clinicId: db.clinic_id, workflowId: db.workflow_id, title: db.title,
  status: db.status, dueDate: db.due_date || undefined, notes: db.notes || undefined,
  responsible: db.responsible || undefined, sortOrder: db.sort_order,
  taskId: db.task_id || undefined, dependsOn: db.depends_on || undefined,
  version: db.version || undefined
});
const mapRevisionFromDb = (db: RevisionDbRow): EvolutionRevision => ({
  id: db.id, clinicId: db.clinic_id, evolutionId: db.evolution_id,
  previousData: db.previous_data, currentData: db.current_data,
  changeReason: db.change_reason, changedBy: db.changed_by, changedAt: db.changed_at
});
const mapSettingsFromDb = (db: SettingsDbRow): ClinicSettings => ({
  clinicId: db.clinic_id, administrativePhone: db.administrative_phone || undefined,
  businessHours: db.business_hours || {},
  resources: Array.isArray(db.resources) ? db.resources.filter((item): item is string => typeof item === "string") : [],
  preferences: db.preferences || {}, inactivityDays: db.inactivity_days,
  version: db.version || undefined
});
const mapContactFromDb = (db: ContactDbRow): ContactEvent => ({
  id: db.id, clinicId: db.clinic_id, patientId: db.patient_id || undefined,
  leadId: db.lead_id || undefined, channel: db.channel, outcome: db.outcome,
  notes: db.notes || undefined, contactedAt: db.contacted_at
});

// --- Context Definition ---

interface AppContextType {
  patients: Patient[];
  appointments: Appointment[];
  tasks: Task[];
  evolutions: ClinicalEvolution[];
  files: PatientFile[];
  leads: Lead[];
  flows: PatientFlow[];
  templates: MessageTemplate[];
  planWorkflows: PlanWorkflow[];
  planSteps: PlanStep[];
  evolutionRevisions: EvolutionRevision[];
  clinicSettings: ClinicSettings | null;
  contactEvents: ContactEvent[];
  isLoading: boolean;
  dataError: string | null;
  toast: { message: string; type: "success" | "error" | null } | null;
  showToast: (message: string, type: "success" | "error") => void;
  hideToast: () => void;
  activeClinicId: string | null;
  currentUser: User | null;
  reloadData: () => Promise<void>;
  
  // Actions
  addPatient: (patient: Omit<Patient, "id">) => Promise<string>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, "id">) => Promise<string | null>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<string | null>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  addEvolution: (evolution: Omit<ClinicalEvolution, "id">) => Promise<void>;
  reviseEvolution: (id: string, evolution: Partial<ClinicalEvolution>, reason: string) => Promise<void>;
  addFile: (file: Omit<PatientFile, "id">) => Promise<void>;
  updateFile: (id: string, file: Partial<PatientFile>) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  addLead: (lead: Omit<Lead, "id">) => Promise<void>;
  moveLead: (leadId: string, targetStage: Lead["status"]) => Promise<void>;
  registerContact: (event: Omit<ContactEvent, "id" | "clinicId" | "contactedAt"> & { contactedAt?: string }) => Promise<void>;
  convertLeadToPatient: (leadId: string, patient: Omit<Patient, "id">) => Promise<string>;
  createPlanWorkflow: (workflow: Omit<PlanWorkflow, "id" | "clinicId">, initialSteps?: string[]) => Promise<string>;
  updatePlanWorkflow: (id: string, workflow: Partial<PlanWorkflow>) => Promise<void>;
  addPlanStep: (step: Omit<PlanStep, "id" | "clinicId">) => Promise<void>;
  updatePlanStep: (id: string, step: Partial<PlanStep>) => Promise<void>;
  saveClinicSettings: (settings: Omit<ClinicSettings, "clinicId">) => Promise<void>;
  getPatientPlanner: (patientId: string, areaId: string) => Promise<PlannerChecklistItem[]>;
  savePatientPlanner: (patientId: string, areaId: string, checklist: PlannerChecklistItem[]) => Promise<void>;
  addTemplate: (template: Omit<MessageTemplate, "id" | "clinicId" | "createdAt">) => Promise<void>;
  updateTemplate: (id: string, template: Partial<MessageTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [evolutions, setEvolutions] = useState<ClinicalEvolution[]>([]);
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [flows, setFlows] = useState<PatientFlow[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [planWorkflows, setPlanWorkflows] = useState<PlanWorkflow[]>([]);
  const [planSteps, setPlanSteps] = useState<PlanStep[]>([]);
  const [evolutionRevisions, setEvolutionRevisions] = useState<EvolutionRevision[]>([]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings | null>(null);
  const [contactEvents, setContactEvents] = useState<ContactEvent[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [dataError, setDataError] = useState<string | null>(supabase ? null : "Conexao com o Supabase nao configurada.");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null } | null>(null);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [activeClinicId, setActiveClinicId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loadSupabaseData = async (clinicId: string) => {
    setIsLoading(true);
    setDataError(null);
    try {
      const [
        { data: dbPatients, error: ep },
        { data: dbAppointments, error: ea },
        { data: dbTasks, error: et },
        { data: dbEvolutions, error: ee },
        { data: dbFiles, error: ef },
        { data: dbLeads, error: el },
        { data: dbFlows, error: efl },
        { data: dbTemplates, error: etem },
        { data: dbWorkflows, error: ew },
        { data: dbSteps, error: es },
        { data: dbRevisions, error: er },
        { data: dbSettings, error: eset },
        { data: dbContacts, error: ec }
      ] = await Promise.all([
        supabase!.from("patients").select("*").eq("clinic_id", clinicId),
        supabase!.from("appointments").select("*").eq("clinic_id", clinicId),
        supabase!.from("tasks").select("*").eq("clinic_id", clinicId),
        supabase!.from("evolutions").select("*").eq("clinic_id", clinicId),
        supabase!.from("files").select("*").eq("clinic_id", clinicId),
        supabase!.from("leads").select("*").eq("clinic_id", clinicId),
        supabase!.from("flows").select("*").eq("clinic_id", clinicId),
        supabase!.from("message_templates").select("*").eq("clinic_id", clinicId),
        supabase!.from("plan_workflows").select("*").eq("clinic_id", clinicId),
        supabase!.from("plan_steps").select("*").eq("clinic_id", clinicId),
        supabase!.from("evolution_revisions").select("*").eq("clinic_id", clinicId),
        supabase!.from("clinic_settings").select("*").eq("clinic_id", clinicId).maybeSingle(),
        supabase!.from("contact_events").select("*").eq("clinic_id", clinicId).order("contacted_at", { ascending: false })
      ]);

      const errors = [ep, ea, et, ee, ef, el, efl, etem, ew, es, er, eset, ec].filter(Boolean);
      if (errors.length > 0) throw errors[0];
      setPatients((dbPatients ?? []).map(mapPatientFromDb));
      setAppointments((dbAppointments ?? []).map(mapAppointmentFromDb));
      setTasks((dbTasks ?? []).map(mapTaskFromDb));
      setEvolutions((dbEvolutions ?? []).map(mapEvolutionFromDb));
      setFiles((dbFiles ?? []).map(mapFileFromDb));
      setLeads((dbLeads ?? []).map(mapLeadFromDb));
      setFlows((dbFlows ?? []).map(mapFlowFromDb));
      setTemplates((dbTemplates ?? []).map(mapTemplateFromDb));
      setPlanWorkflows((dbWorkflows ?? []).map(mapWorkflowFromDb));
      setPlanSteps((dbSteps ?? []).map(mapStepFromDb));
      setEvolutionRevisions((dbRevisions ?? []).map(mapRevisionFromDb));
      setClinicSettings(dbSettings ? mapSettingsFromDb(dbSettings) : null);
      setContactEvents((dbContacts ?? []).map(mapContactFromDb));
    } catch (err) {
      console.error("Erro ao carregar dados do Supabase:", err);
      setDataError(err instanceof Error ? err.message : "Nao foi possivel carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const reloadData = async () => {
    if (activeClinicId) await loadSupabaseData(activeClinicId);
  };

  // Load data on mount: Supabase prioritário se logado, LocalStorage como fallback
  useEffect(() => {
    const client = supabase;
    if (!client) {
      return;
    }

    let mounted = true;
    const clearData = () => {
      setCurrentUser(null);
      setActiveClinicId(null);
      setPatients([]);
      setAppointments([]);
      setTasks([]);
      setEvolutions([]);
      setFiles([]);
      setLeads([]);
      setFlows([]);
      setTemplates([]);
      setPlanWorkflows([]);
      setPlanSteps([]);
      setEvolutionRevisions([]);
      setClinicSettings(null);
      setContactEvents([]);
      setIsLoading(false);
    };
    const resolveUser = async (user: User | null) => {
      if (!mounted) return;
      if (!user) {
        clearData();
        return;
      }
      setCurrentUser(user);
      const { data: memberships, error } = await client
        .from("clinic_members")
        .select("clinic_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1);
      if (!mounted) return;
      if (error || !memberships?.length) {
        setActiveClinicId(null);
        setDataError(error?.message || "Usuario sem clinica ativa.");
        setIsLoading(false);
        return;
      }
      const clinicId = memberships[0].clinic_id;
      setActiveClinicId(clinicId);
      await loadSupabaseData(clinicId);
    };

    void client.auth.getUser().then(({ data, error }) => {
      if (error) {
        setDataError(error.message);
        setIsLoading(false);
        return;
      }
      void resolveUser(data.user);
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      void resolveUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sincronizar localmente no LocalStorage para redundância
  // Toast Helpers
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const hideToast = () => {
    setToast(null);
  };

  const requireDataContext = () => {
    if (!supabase || !activeClinicId) {
      const error = new Error("Supabase indisponivel ou usuario sem clinica ativa.");
      showToast(error.message, "error");
      throw error;
    }
    return { client: supabase, clinicId: activeClinicId };
  };

  // --- Funções Auxiliares de Validação de Conflito ---
  const timeToMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number): string => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const checkConflict = (
    newApp: Omit<Appointment, "id"> & { id?: string }
  ): string | null => {
    if (!newApp.date || !newApp.time) return null;
    
    const startNew = timeToMinutes(newApp.time);
    const durationNew = Number(newApp.duration) || 30;
    const prepNew = Number(newApp.preparationInterval) || 0;
    const endNew = startNew + durationNew + prepNew;

    const dayApps = appointments.filter(a => 
      a.date === newApp.date && 
      a.id !== newApp.id && 
      (a.status === "agendado" || a.status === "confirmado")
    );

    for (const app of dayApps) {
      const startApp = timeToMinutes(app.time);
      const durationApp = Number(app.duration) || 30;
      const prepApp = Number(app.preparationInterval) || 0;
      const endApp = startApp + durationApp + prepApp;

      const hasOverlap = startNew < endApp && startApp < endNew;

      if (hasOverlap) {
        if (app.professional === newApp.professional) {
          return `Choque de agenda para o profissional ${app.professional}. O horário já está ocupado pelo atendimento de "${app.patientName}" de ${app.time} às ${minutesToTime(startApp + durationApp)}.`;
        }
        if (app.roomOrChair && newApp.roomOrChair && app.roomOrChair === newApp.roomOrChair) {
          return `Choque de uso da cadeira/sala "${app.roomOrChair}". O espaço já está ocupado pelo atendimento de "${app.patientName}" de ${app.time} às ${minutesToTime(startApp + durationApp)}.`;
        }
      }
    }

    return null;
  };

  // --- Funções de Escrita com clinicId ---

  const addPatient = async (patientInput: Omit<Patient, "id">): Promise<string> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client
      .from("patients")
      .insert(mapPatientToDb({ ...patientInput, clinicId }))
      .select()
      .single();
      if (error) {
        console.error("Supabase insert patient error:", error);
        showToast(`Erro ao salvar paciente: ${error.message}`, "error");
        throw error;
      }
    const newPatient = mapPatientFromDb(data);
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Paciente "${patientInput.name}" cadastrado!`, "success");
    return newPatient.id;
  };

  const updatePatient = async (id: string, patientInput: Partial<Patient>): Promise<void> => {
    const { client, clinicId } = requireDataContext();
      const { data, error } = await client.from("patients").update(mapPatientToDb(patientInput)).eq("id", id).eq("clinic_id", clinicId).select().single();
      if (error) {
        console.error("Supabase update patient error:", error);
        showToast(`Erro ao atualizar paciente: ${error.message}`, "error");
        throw error;
      }

    setPatients((prev) => prev.map((p) => (p.id === id ? mapPatientFromDb(data) : p)));
    showToast("Dados cadastrais do paciente atualizados!", "success");
  };

  const addAppointment = async (appInput: Omit<Appointment, "id">): Promise<string | null> => {
    const { client, clinicId } = requireDataContext();
    const conflictError = checkConflict(appInput);
    if (conflictError) {
      showToast(conflictError, "error");
      return conflictError;
    }

      const { data, error } = await client.from("appointments")
        .insert(mapAppointmentToDb({ ...appInput, clinicId })).select().single();
      if (error) {
        console.error("Supabase insert appointment error:", error);
        showToast(`Erro ao agendar: ${error.message}`, "error");
        return `Erro de banco de dados: ${error.message}`;
      }

    setAppointments((prev) => [mapAppointmentFromDb(data), ...prev]);
    showToast("Agendamento clínico criado!", "success");
    return null;
  };

  const updateAppointment = async (id: string, appInput: Partial<Appointment>): Promise<string | null> => {
    const { client, clinicId } = requireDataContext();
    const currentApp = appointments.find(a => a.id === id);
    if (!currentApp) return "Agendamento não encontrado.";

    const mergedApp = { ...currentApp, ...appInput };

    const conflictError = checkConflict(mergedApp);
    if (conflictError) {
      showToast(conflictError, "error");
      return conflictError;
    }

      const { data, error } = await client.from("appointments").update(mapAppointmentToDb(appInput)).eq("id", id).eq("clinic_id", clinicId).select().single();
      if (error) {
        console.error("Supabase update appointment error:", error);
        showToast(`Erro ao atualizar agendamento: ${error.message}`, "error");
        return `Erro de banco de dados: ${error.message}`;
      }

    setAppointments((prev) => prev.map((a) => (a.id === id ? mapAppointmentFromDb(data) : a)));
    showToast("Agendamento clínico atualizado!", "success");
    return null;
  };

  const addTask = async (taskInput: Omit<Task, "id">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
      const { data, error } = await client.from("tasks").insert(mapTaskToDb({ ...taskInput, clinicId })).select().single();
      if (error) {
        console.error("Supabase insert task error:", error);
        showToast(`Erro ao registrar pendência: ${error.message}`, "error");
        throw error;
      }

    setTasks((prev) => [mapTaskFromDb(data), ...prev]);
    showToast("Nova pendência registrada!", "success");
  };

  const completeTask = async (id: string): Promise<void> => {
    const { client, clinicId } = requireDataContext();
      const { data, error } = await client.from("tasks").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id).eq("clinic_id", clinicId).select().single();
      if (error) {
        console.error("Supabase update task error:", error);
        showToast(`Erro ao concluir pendência: ${error.message}`, "error");
        throw error;
      }

    setTasks((prev) => prev.map((t) => (t.id === id ? mapTaskFromDb(data) : t)));
    showToast("Pendência concluída!", "success");
  };

  const updateTask = async (id: string, taskInput: Partial<Task>): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("tasks").update(mapTaskToDb(taskInput)).eq("id", id).eq("clinic_id", clinicId).select().single();
    if (error) {
      showToast(`Erro ao atualizar pendencia: ${error.message}`, "error");
      throw error;
    }
    setTasks((current) => current.map((task) => task.id === id ? mapTaskFromDb(data) : task));
    showToast("Pendencia atualizada.", "success");
  };

  const addEvolution = async (evoInput: Omit<ClinicalEvolution, "id">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
      const { data, error } = await client.from("evolutions").insert(mapEvolutionToDb({ ...evoInput, clinicId })).select().single();
      if (error) {
        console.error("Supabase insert evolution error:", error);
        showToast(`Erro ao salvar evolução: ${error.message}`, "error");
        throw error;
      }

    setEvolutions((prev) => [mapEvolutionFromDb(data), ...prev]);
    showToast("Nova evolução clínica salva!", "success");
  };

  const reviseEvolution = async (id: string, changes: Partial<ClinicalEvolution>, reason: string): Promise<void> => {
    const { client } = requireDataContext();
    const current = evolutions.find((item) => item.id === id);
    if (!current) throw new Error("Evolucao nao encontrada.");
    const revised = { ...current, ...changes };
    const { data, error } = await client.rpc("revise_evolution", {
      target_evolution_id: id,
      revision_reason: reason,
      revised_procedure: revised.procedure,
      revised_description: revised.description,
      revised_complication: revised.complication || null,
      revised_conduct: revised.conduct || null,
      revised_guidance: revised.guidance || null,
      revised_next_step: revised.nextStep || null,
      revised_return_days: revised.recommendedReturnDays ?? null
    });
    if (error) {
      showToast(`Erro ao revisar evolucao: ${error.message}`, "error");
      throw error;
    }
    setEvolutions((items) => items.map((item) => item.id === id ? mapEvolutionFromDb(data) : item));
    if (activeClinicId) {
      const { data: revisions } = await client.from("evolution_revisions").select("*")
        .eq("clinic_id", activeClinicId).eq("evolution_id", id).order("changed_at", { ascending: false });
      setEvolutionRevisions((revisions ?? []).map(mapRevisionFromDb));
    }
    showToast("Evolucao revisada com historico preservado.", "success");
  };

  const addFile = async (fileInput: Omit<PatientFile, "id">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
      const { data, error } = await client.from("files").insert(mapFileToDb({ ...fileInput, clinicId })).select().single();
      if (error) {
        console.error("Supabase insert file error:", error);
        showToast(`Erro ao salvar arquivo: ${error.message}`, "error");
        throw error;
      }

    setFiles((prev) => [mapFileFromDb(data), ...prev]);
    showToast("Arquivo/Exame anexado!", "success");
  };

  const updateFile = async (id: string, fileInput: Partial<PatientFile>): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("files").update(mapFileToDb(fileInput))
      .eq("id", id).eq("clinic_id", clinicId).select().single();
    if (error) {
      showToast(`Erro ao atualizar arquivo: ${error.message}`, "error");
      throw error;
    }
    setFiles((items) => items.map((item) => item.id === id ? mapFileFromDb(data) : item));
    showToast("Metadados do arquivo atualizados.", "success");
  };

  const deleteFile = async (id: string): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const target = files.find((item) => item.id === id);
    if (!target) throw new Error("Arquivo nao encontrado.");
    if (target.downloadUrl && !target.externalUrl) {
      const { error: storageError } = await client.storage.from("patient-exams").remove([target.downloadUrl]);
      if (storageError) {
        showToast(`Erro ao remover arquivo fisico: ${storageError.message}`, "error");
        throw storageError;
      }
    }
    const { error } = await client.from("files").delete().eq("id", id).eq("clinic_id", clinicId);
    if (error) {
      showToast(`Arquivo fisico removido, mas o registro requer revisao: ${error.message}`, "error");
      throw error;
    }
    setFiles((items) => items.filter((item) => item.id !== id));
    showToast("Arquivo removido.", "success");
  };

  const addLead = async (leadInput: Omit<Lead, "id">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("leads").insert({
      clinic_id: clinicId, name: leadInput.name, phone: leadInput.phone,
      source: leadInput.source, status: leadInput.status,
      last_contact_date: leadInput.lastContactDate || null, notes: leadInput.notes || null
    }).select().single();
    if (error) {
      showToast(`Erro ao cadastrar lead: ${error.message}`, "error");
      throw error;
    }
    setLeads((items) => [mapLeadFromDb(data), ...items]);
    showToast("Lead cadastrado.", "success");
  };

  const moveLead = async (leadId: string, targetStage: Lead["status"]): Promise<void> => {
    const { client, clinicId } = requireDataContext();
      const { data, error } = await client.from("leads").update({ status: targetStage }).eq("id", leadId).eq("clinic_id", clinicId).select().single();
      if (error) {
        console.error("Supabase update lead error:", error);
        showToast(`Erro ao mover lead: ${error.message}`, "error");
        throw error;
      }

    setLeads((prev) => prev.map((l) => (l.id === leadId ? mapLeadFromDb(data) : l)));
    showToast("Lead movido de etapa!", "success");
  };

  const registerContact = async (eventInput: Omit<ContactEvent, "id" | "clinicId" | "contactedAt"> & { contactedAt?: string }): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("contact_events").insert({
      clinic_id: clinicId, patient_id: eventInput.patientId || null,
      lead_id: eventInput.leadId || null, channel: eventInput.channel,
      outcome: eventInput.outcome, notes: eventInput.notes || null,
      contacted_at: eventInput.contactedAt || new Date().toISOString()
    }).select().single();
    if (error) {
      showToast(`Erro ao registrar contato: ${error.message}`, "error");
      throw error;
    }
    setContactEvents((items) => [mapContactFromDb(data), ...items]);
    if (eventInput.leadId) {
      await client.from("leads").update({ last_contact_date: new Date().toISOString().slice(0, 10) })
        .eq("id", eventInput.leadId).eq("clinic_id", clinicId);
      setLeads((items) => items.map((lead) => lead.id === eventInput.leadId
        ? { ...lead, lastContactDate: new Date().toISOString().slice(0, 10) } : lead));
    }
    showToast("Contato registrado no historico.", "success");
  };

  const convertLeadToPatient = async (leadId: string, patientInput: Omit<Patient, "id">): Promise<string> => {
    const { client, clinicId } = requireDataContext();
    const { data: patientId, error } = await client.rpc("convert_lead_to_patient", {
      target_lead_id: leadId,
      patient_payload: {
        name: patientInput.name, birth_date: patientInput.birthDate, cpf: patientInput.cpf || null,
        sex: patientInput.sex || "not_informed", phone: patientInput.phone, email: patientInput.email,
        next_action: patientInput.nextAction || null, next_action_date: patientInput.nextActionDate || null,
        notes: patientInput.notes || null, cep: patientInput.postalCode || null,
        street: patientInput.address || null, number: patientInput.addressNumber || null,
        complement: patientInput.addressComplement || null, neighborhood: patientInput.neighborhood || null,
        city: patientInput.city || null, state: patientInput.state || null
      }
    });
    if (error || !patientId) {
      showToast(`Erro ao converter lead: ${error?.message || "resposta invalida"}`, "error");
      throw error || new Error("Conversao sem identificador de paciente.");
    }
    await loadSupabaseData(clinicId);
    showToast("Lead convertido em paciente.", "success");
    return patientId;
  };

  const createPlanWorkflow = async (
    workflowInput: Omit<PlanWorkflow, "id" | "clinicId">,
    initialSteps: string[] = []
  ): Promise<string> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("plan_workflows").insert({
      clinic_id: clinicId, patient_id: workflowInput.patientId, area_id: workflowInput.areaId,
      name: workflowInput.name, status: workflowInput.status,
      responsible: workflowInput.responsible || null, description: workflowInput.description || null,
      start_date: workflowInput.startDate || null, next_action: workflowInput.nextAction || null
    }).select().single();
    if (error) {
      showToast(`Erro ao criar planejamento: ${error.message}`, "error");
      throw error;
    }
    const workflow = mapWorkflowFromDb(data);
    setPlanWorkflows((items) => [workflow, ...items]);
    if (initialSteps.length) {
      const { data: createdSteps, error: stepError } = await client.from("plan_steps").insert(
        initialSteps.map((title, index) => ({
          clinic_id: clinicId, workflow_id: workflow.id, title,
          status: "pending", sort_order: index
        }))
      ).select();
      if (stepError) {
        showToast(`Planejamento criado, mas as etapas falharam: ${stepError.message}`, "error");
        throw stepError;
      }
      setPlanSteps((items) => [...items, ...(createdSteps ?? []).map(mapStepFromDb)]);
    }
    showToast("Planejamento iniciado.", "success");
    return workflow.id;
  };

  const updatePlanWorkflow = async (id: string, workflowInput: Partial<PlanWorkflow>): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("plan_workflows").update({
      ...(workflowInput.name !== undefined && { name: workflowInput.name }),
      ...(workflowInput.status !== undefined && { status: workflowInput.status }),
      ...(workflowInput.responsible !== undefined && { responsible: workflowInput.responsible || null }),
      ...(workflowInput.description !== undefined && { description: workflowInput.description || null }),
      ...(workflowInput.startDate !== undefined && { start_date: workflowInput.startDate || null }),
      ...(workflowInput.nextAction !== undefined && { next_action: workflowInput.nextAction || null })
    }).eq("id", id).eq("clinic_id", clinicId).select().single();
    if (error) throw error;
    setPlanWorkflows((items) => items.map((item) => item.id === id ? mapWorkflowFromDb(data) : item));
    showToast("Planejamento atualizado.", "success");
  };

  const addPlanStep = async (stepInput: Omit<PlanStep, "id" | "clinicId">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("plan_steps").insert({
      clinic_id: clinicId, workflow_id: stepInput.workflowId, title: stepInput.title,
      status: stepInput.status, due_date: stepInput.dueDate || null, notes: stepInput.notes || null,
      responsible: stepInput.responsible || null, sort_order: stepInput.sortOrder,
      task_id: stepInput.taskId || null, depends_on: stepInput.dependsOn || null
    }).select().single();
    if (error) throw error;
    setPlanSteps((items) => [...items, mapStepFromDb(data)]);
    showToast("Etapa adicionada.", "success");
  };

  const updatePlanStep = async (id: string, stepInput: Partial<PlanStep>): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("plan_steps").update({
      ...(stepInput.title !== undefined && { title: stepInput.title }),
      ...(stepInput.status !== undefined && { status: stepInput.status }),
      ...(stepInput.dueDate !== undefined && { due_date: stepInput.dueDate || null }),
      ...(stepInput.notes !== undefined && { notes: stepInput.notes || null }),
      ...(stepInput.responsible !== undefined && { responsible: stepInput.responsible || null }),
      ...(stepInput.sortOrder !== undefined && { sort_order: stepInput.sortOrder }),
      ...(stepInput.taskId !== undefined && { task_id: stepInput.taskId || null }),
      ...(stepInput.dependsOn !== undefined && { depends_on: stepInput.dependsOn || null })
    }).eq("id", id).eq("clinic_id", clinicId).select().single();
    if (error) throw error;
    setPlanSteps((items) => items.map((item) => item.id === id ? mapStepFromDb(data) : item));
    showToast("Etapa atualizada.", "success");
  };

  const saveClinicSettings = async (settingsInput: Omit<ClinicSettings, "clinicId">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const { data, error } = await client.from("clinic_settings").upsert({
      clinic_id: clinicId, administrative_phone: settingsInput.administrativePhone || null,
      business_hours: settingsInput.businessHours, resources: settingsInput.resources,
      preferences: settingsInput.preferences, inactivity_days: settingsInput.inactivityDays
    }, { onConflict: "clinic_id" }).select().single();
    if (error) {
      showToast(`Erro ao salvar configuracoes: ${error.message}`, "error");
      throw error;
    }
    setClinicSettings(mapSettingsFromDb(data));
    showToast("Configuracoes da clinica salvas.", "success");
  };

  const getPatientPlanner = async (patientId: string, areaId: string): Promise<PlannerChecklistItem[]> => {
    if (!supabase || !activeClinicId) return [];
    
    try {
      const { data, error } = await supabase
        .from("patient_planners")
        .select("*")
        .eq("clinic_id", activeClinicId)
        .eq("patient_id", patientId)
        .eq("area_id", areaId)
        .maybeSingle();
        
      if (error) {
        console.error("Erro ao buscar planejamento:", error);
        return [];
      }
      
      if (data) {
        return Array.isArray(data.checklist) ? data.checklist : [];
      }
    } catch (err) {
      console.error("Falha na chamada getPatientPlanner:", err);
    }
    return [];
  };

  const savePatientPlanner = async (patientId: string, areaId: string, checklist: PlannerChecklistItem[]): Promise<void> => {
    if (!supabase || !activeClinicId) {
      showToast("Supabase ou clínica não ativa.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { error } = await supabase
        .from("patient_planners")
        .upsert({
          clinic_id: activeClinicId,
          patient_id: patientId,
          area_id: areaId,
          checklist: checklist,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "clinic_id,patient_id,area_id"
        });
        
      if (error) {
        console.error("Erro ao salvar planejamento:", error);
        showToast(`Erro ao salvar planejamento: ${error.message}`, "error");
        throw error;
      }
      
      showToast("Planejamento atualizado com sucesso!", "success");
    } catch (err: unknown) {
      console.error("Erro na chamada savePatientPlanner:", err);
      throw err;
    }
  };

  const addTemplate = async (templateInput: Omit<MessageTemplate, "id" | "clinicId" | "createdAt">): Promise<void> => {
    if (!supabase || !activeClinicId) {
      showToast("Supabase ou clínica não ativa.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { data, error } = await supabase
        .from("message_templates")
        .insert({
          clinic_id: activeClinicId,
          title: templateInput.title,
          body_text: templateInput.bodyText,
          is_active: templateInput.isActive
        })
        .select()
        .single();
        
      if (error) {
        console.error("Erro ao adicionar modelo:", error);
        showToast(`Erro ao criar modelo: ${error.message}`, "error");
        throw error;
      }
      
      if (data) {
        setTemplates(prev => [mapTemplateFromDb(data), ...prev]);
        showToast("Modelo de mensagem criado!", "success");
      }
    } catch (err: unknown) {
      console.error("Erro no addTemplate:", err);
      throw err;
    }
  };

  const updateTemplate = async (id: string, templateInput: Partial<MessageTemplate>): Promise<void> => {
    if (!supabase) {
      showToast("Supabase indisponível.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { error } = await supabase
        .from("message_templates")
        .update({
          ...(templateInput.title && { title: templateInput.title }),
          ...(templateInput.bodyText && { body_text: templateInput.bodyText }),
          ...(templateInput.isActive !== undefined && { is_active: templateInput.isActive })
        })
        .eq("id", id);
        
      if (error) {
        console.error("Erro ao atualizar modelo:", error);
        showToast(`Erro ao atualizar modelo: ${error.message}`, "error");
        throw error;
      }
      
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...templateInput } : t));
      showToast("Modelo atualizado!", "success");
    } catch (err: unknown) {
      console.error("Erro no updateTemplate:", err);
      throw err;
    }
  };

  const deleteTemplate = async (id: string): Promise<void> => {
    if (!supabase) {
      showToast("Supabase indisponível.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { error } = await supabase
        .from("message_templates")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Erro ao excluir modelo:", error);
        showToast(`Erro ao excluir modelo: ${error.message}`, "error");
        throw error;
      }
      
      setTemplates(prev => prev.filter(t => t.id !== id));
      showToast("Modelo removido!", "success");
    } catch (err: unknown) {
      console.error("Erro no deleteTemplate:", err);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        patients,
        appointments,
        tasks,
        evolutions,
        files,
        leads,
        flows,
        templates,
        planWorkflows,
        planSteps,
        evolutionRevisions,
        clinicSettings,
        contactEvents,
        isLoading,
        dataError,
        toast,
        showToast,
        hideToast,
        activeClinicId,
        currentUser,
        reloadData,
        addPatient,
        updatePatient,
        addAppointment,
        updateAppointment,
        addTask,
        updateTask,
        completeTask,
        addEvolution,
        reviseEvolution,
        addFile,
        updateFile,
        deleteFile,
        addLead,
        moveLead,
        registerContact,
        convertLeadToPatient,
        createPlanWorkflow,
        updatePlanWorkflow,
        addPlanStep,
        updatePlanStep,
        saveClinicSettings,
        getPatientPlanner,
        savePatientPlanner,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        quickCaptureOpen,
        setQuickCaptureOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
