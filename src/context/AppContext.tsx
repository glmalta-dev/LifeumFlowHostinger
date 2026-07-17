"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Patient, Appointment, Task, ClinicalEvolution, PatientFile, Lead, PatientFlow } from "../types";
import { supabase } from "../lib/supabaseClient";
import {
  initialPatients,
  initialAppointments,
  initialTasks,
  initialEvolutions,
  initialFiles,
  initialLeads,
  initialFlows
} from "../mocks/initialData";

// --- Mappers para Supabase (camelCase <-> snake_case) ---

interface PatientDbRow { id: string; name: string; birth_date: string; cpf?: string | null; phone: string; email: string; status: Patient["status"]; next_action?: string | null; next_action_date?: string | null; notes?: string | null; }
interface AppointmentDbRow { id: string; patient_id: string; patient_name: string; date: string; time: string; type: Appointment["type"]; status: Appointment["status"]; professional: string; notes?: string | null; }
interface TaskDbRow { id: string; patient_id: string; patient_name: string; title: string; description: string; due_date: string; status: Task["status"]; priority: Task["priority"]; }
interface EvolutionDbRow { id: string; patient_id: string; date: string; professional: string; procedure: string; description: string; next_step?: string | null; recommended_return_days?: number | null; }
interface FileDbRow { id: string; patient_id: string; name: string; upload_date: string; size: string; mime_type: string; download_url: string; }
interface LeadDbRow { id: string; name: string; phone: string; source: string; status: Lead["status"]; last_contact_date?: string | null; notes?: string | null; }
interface FlowDbRow { id: string; title: string; stages?: PatientFlow["stages"] | null; }

const mapPatientFromDb = (db: PatientDbRow): Patient => ({
  id: db.id,
  name: db.name,
  birthDate: db.birth_date,
  cpf: db.cpf || undefined,
  phone: db.phone,
  email: db.email,
  status: db.status,
  nextAction: db.next_action || undefined,
  nextActionDate: db.next_action_date || undefined,
  notes: db.notes || undefined,
});

const mapPatientToDb = (p: Partial<Patient>) => ({
  ...(p.id && { id: p.id }),
  ...(p.name && { name: p.name }),
  ...(p.birthDate && { birth_date: p.birthDate }),
  ...(p.cpf !== undefined && { cpf: p.cpf }),
  ...(p.phone && { phone: p.phone }),
  ...(p.email && { email: p.email }),
  ...(p.status && { status: p.status }),
  ...(p.nextAction !== undefined && { next_action: p.nextAction }),
  ...(p.nextActionDate !== undefined && { next_action_date: p.nextActionDate }),
  ...(p.notes !== undefined && { notes: p.notes }),
});

const mapAppointmentFromDb = (db: AppointmentDbRow): Appointment => ({
  id: db.id,
  patientId: db.patient_id,
  patientName: db.patient_name,
  date: db.date,
  time: db.time,
  type: db.type,
  status: db.status,
  professional: db.professional,
  notes: db.notes || undefined,
});

const mapAppointmentToDb = (a: Partial<Appointment>) => ({
  ...(a.id && { id: a.id }),
  ...(a.patientId && { patient_id: a.patientId }),
  ...(a.patientName && { patient_name: a.patientName }),
  ...(a.date && { date: a.date }),
  ...(a.time && { time: a.time }),
  ...(a.type && { type: a.type }),
  ...(a.status && { status: a.status }),
  ...(a.professional && { professional: a.professional }),
  ...(a.notes !== undefined && { notes: a.notes }),
});

const mapTaskFromDb = (db: TaskDbRow): Task => ({
  id: db.id,
  patientId: db.patient_id,
  patientName: db.patient_name,
  title: db.title,
  description: db.description,
  dueDate: db.due_date,
  status: db.status,
  priority: db.priority,
});

const mapTaskToDb = (t: Partial<Task>) => ({
  ...(t.id && { id: t.id }),
  ...(t.patientId && { patient_id: t.patientId }),
  ...(t.patientName && { patient_name: t.patientName }),
  ...(t.title && { title: t.title }),
  ...(t.description && { description: t.description }),
  ...(t.dueDate && { due_date: t.dueDate }),
  ...(t.status && { status: t.status }),
  ...(t.priority && { priority: t.priority }),
});

const mapEvolutionFromDb = (db: EvolutionDbRow): ClinicalEvolution => ({
  id: db.id,
  patientId: db.patient_id,
  date: db.date,
  professional: db.professional,
  procedure: db.procedure,
  description: db.description,
  nextStep: db.next_step || undefined,
  recommendedReturnDays: db.recommended_return_days || undefined,
});

const mapEvolutionToDb = (e: Partial<ClinicalEvolution>) => ({
  ...(e.id && { id: e.id }),
  ...(e.patientId && { patient_id: e.patientId }),
  ...(e.date && { date: e.date }),
  ...(e.professional && { professional: e.professional }),
  ...(e.procedure && { procedure: e.procedure }),
  ...(e.description && { description: e.description }),
  ...(e.nextStep !== undefined && { next_step: e.nextStep }),
  ...(e.recommendedReturnDays !== undefined && { recommended_return_days: e.recommendedReturnDays }),
});

const mapFileFromDb = (db: FileDbRow): PatientFile => ({
  id: db.id,
  patientId: db.patient_id,
  name: db.name,
  uploadDate: db.upload_date,
  size: db.size,
  mimeType: db.mime_type,
  downloadUrl: db.download_url,
});

const mapFileToDb = (f: Partial<PatientFile>) => ({
  ...(f.id && { id: f.id }),
  ...(f.patientId && { patient_id: f.patientId }),
  ...(f.name && { name: f.name }),
  ...(f.uploadDate && { upload_date: f.uploadDate }),
  ...(f.size && { size: f.size }),
  ...(f.mimeType && { mime_type: f.mimeType }),
  ...(f.downloadUrl && { download_url: f.downloadUrl }),
});

const mapLeadFromDb = (db: LeadDbRow): Lead => ({
  id: db.id,
  name: db.name,
  phone: db.phone,
  source: db.source,
  status: db.status,
  lastContactDate: db.last_contact_date || undefined,
  notes: db.notes || undefined,
});

const mapFlowFromDb = (db: FlowDbRow): PatientFlow => ({
  id: db.id,
  title: db.title,
  stages: db.stages || [],
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
  toast: { message: string; type: "success" | "error" | null } | null;
  showToast: (message: string, type: "success" | "error") => void;
  hideToast: () => void;
  
  // Actions
  addPatient: (patient: Omit<Patient, "id">) => string;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  addTask: (task: Omit<Task, "id">) => void;
  completeTask: (id: string) => void;
  addEvolution: (evolution: Omit<ClinicalEvolution, "id">) => void;
  addFile: (file: Omit<PatientFile, "id">) => void;
  moveLead: (leadId: string, targetStage: Lead["status"]) => void;
  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [evolutions, setEvolutions] = useState<ClinicalEvolution[]>(initialEvolutions);
  const [files, setFiles] = useState<PatientFile[]>(initialFiles);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [flows, setFlows] = useState<PatientFlow[]>(initialFlows);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null } | null>(null);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data on mount: Supabase prioritário, LocalStorage como fallback
  useEffect(() => {
    const initData = async () => {
      if (supabase) {
        try {
          const [
            { data: dbPatients, error: ep },
            { data: dbAppointments, error: ea },
            { data: dbTasks, error: et },
            { data: dbEvolutions, error: ee },
            { data: dbFiles, error: ef },
            { data: dbLeads, error: el },
            { data: dbFlows, error: efl }
          ] = await Promise.all([
            supabase.from("patients").select("*"),
            supabase.from("appointments").select("*"),
            supabase.from("tasks").select("*"),
            supabase.from("evolutions").select("*"),
            supabase.from("files").select("*"),
            supabase.from("leads").select("*"),
            supabase.from("flows").select("*")
          ]);

          let hasFetchedSupabase = false;

          // Se conseguiu buscar dados sem erro e as tabelas retornaram algo, atualiza os estados correspondentes
          if (dbPatients && !ep && dbPatients.length > 0) {
            setPatients(dbPatients.map(mapPatientFromDb));
            hasFetchedSupabase = true;
          }
          if (dbAppointments && !ea && dbAppointments.length > 0) setAppointments(dbAppointments.map(mapAppointmentFromDb));
          if (dbTasks && !et && dbTasks.length > 0) setTasks(dbTasks.map(mapTaskFromDb));
          if (dbEvolutions && !ee && dbEvolutions.length > 0) setEvolutions(dbEvolutions.map(mapEvolutionFromDb));
          if (dbFiles && !ef && dbFiles.length > 0) setFiles(dbFiles.map(mapFileFromDb));
          if (dbLeads && !el && dbLeads.length > 0) setLeads(dbLeads.map(mapLeadFromDb));
          if (dbFlows && !efl && dbFlows.length > 0) setFlows(dbFlows.map(mapFlowFromDb));

          if (hasFetchedSupabase) {
            setIsHydrated(true);
            return;
          }
        } catch (err) {
          console.warn("Supabase fetch fallback local:", err);
        }
      }

      // Fallback para LocalStorage / Mock
      const getLocal = <T,>(key: string, initial: T): T => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : initial;
      };

      setPatients(getLocal("patients", initialPatients));
      setAppointments(getLocal("appointments", initialAppointments));
      setTasks(getLocal("tasks", initialTasks));
      setEvolutions(getLocal("evolutions", initialEvolutions));
      setFiles(getLocal("files", initialFiles));
      setLeads(getLocal("leads", initialLeads));
      setFlows(getLocal("flows", initialFlows));
      setIsHydrated(true);
    };

    initData();
  }, []);

  // Sincronizar localmente no LocalStorage para redundância
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("evolutions", JSON.stringify(evolutions));
  }, [evolutions, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("files", JSON.stringify(files));
  }, [files, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("flows", JSON.stringify(flows));
  }, [flows, isHydrated]);

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

  // --- Implementação das Ações Sincronizadas (Supabase + Estado Local) ---

  const addPatient = (patientInput: Omit<Patient, "id">): string => {
    const newId = `pat-${Date.now()}`;
    const newPatient: Patient = { ...patientInput, id: newId };
    
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Paciente "${patientInput.name}" cadastrado!`, "success");

    if (supabase) {
      supabase.from("patients").insert(mapPatientToDb(newPatient)).then(({ error }) => {
        if (error) console.error("Supabase insert patient error:", error);
      });
    }

    return newId;
  };

  const updatePatient = (id: string, patientInput: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patientInput } : p))
    );
    showToast("Dados cadastrais do paciente atualizados!", "success");

    if (supabase) {
      supabase.from("patients").update(mapPatientToDb(patientInput)).eq("id", id).then(({ error }) => {
        if (error) console.error("Supabase update patient error:", error);
      });
    }
  };

  const addAppointment = (appInput: Omit<Appointment, "id">) => {
    const newApp: Appointment = {
      ...appInput,
      id: `app-${Date.now()}`
    };
    
    setAppointments((prev) => [newApp, ...prev]);
    showToast("Agendamento clínico criado!", "success");

    if (supabase) {
      supabase.from("appointments").insert(mapAppointmentToDb(newApp)).then(({ error }) => {
        if (error) console.error("Supabase insert appointment error:", error);
      });
    }
  };

  const updateAppointment = (id: string, appInput: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...appInput } : a))
    );
    showToast("Agendamento clínico atualizado!", "success");

    if (supabase) {
      supabase.from("appointments").update(mapAppointmentToDb(appInput)).eq("id", id).then(({ error }) => {
        if (error) console.error("Supabase update appointment error:", error);
      });
    }
  };

  const addTask = (taskInput: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}`
    };
    
    setTasks((prev) => [newTask, ...prev]);
    showToast("Nova pendência registrada!", "success");

    if (supabase) {
      supabase.from("tasks").insert(mapTaskToDb(newTask)).then(({ error }) => {
        if (error) console.error("Supabase insert task error:", error);
      });
    }
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t))
    );
    showToast("Pendência concluída!", "success");

    if (supabase) {
      supabase.from("tasks").update({ status: "completed" }).eq("id", id).then(({ error }) => {
        if (error) console.error("Supabase update task error:", error);
      });
    }
  };

  const addEvolution = (evoInput: Omit<ClinicalEvolution, "id">) => {
    const newEvo: ClinicalEvolution = {
      ...evoInput,
      id: `evo-${Date.now()}`
    };
    
    setEvolutions((prev) => [newEvo, ...prev]);
    showToast("Nova evolução clínica salva!", "success");

    if (supabase) {
      supabase.from("evolutions").insert(mapEvolutionToDb(newEvo)).then(({ error }) => {
        if (error) console.error("Supabase insert evolution error:", error);
      });
    }
  };

  const addFile = (fileInput: Omit<PatientFile, "id">) => {
    const newFile: PatientFile = {
      ...fileInput,
      id: `file-${Date.now()}`
    };
    
    setFiles((prev) => [newFile, ...prev]);
    showToast("Arquivo/Exame anexado!", "success");

    if (supabase) {
      supabase.from("files").insert(mapFileToDb(newFile)).then(({ error }) => {
        if (error) console.error("Supabase insert file error:", error);
      });
    }
  };

  const moveLead = (leadId: string, targetStage: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStage } : l))
    );
    showToast("Lead movido de etapa!", "success");

    // Encontrar o lead correspondente para atualizar no Supabase
    const updatedLead = leads.find(l => l.id === leadId);
    if (updatedLead && supabase) {
      supabase.from("leads").update({ status: targetStage }).eq("id", leadId).then(({ error }) => {
        if (error) console.error("Supabase update lead error:", error);
      });
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
        toast,
        showToast,
        hideToast,
        addPatient,
        updatePatient,
        addAppointment,
        updateAppointment,
        addTask,
        completeTask,
        addEvolution,
        addFile,
        moveLead,
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
