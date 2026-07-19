export interface Patient {
  id: string;
  clinicId?: string;
  name: string;
  birthDate: string;
  cpf?: string;
  sex?: "female" | "male" | "intersex" | "not_informed";
  phone: string;
  email: string;
  status: "active" | "alert" | "inactive";
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  version?: number;
}

export interface Appointment {
  id: string;
  clinicId?: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: "consulta" | "retorno" | "cirurgia" | "planejamento" | "manutencao";
  status: "agendado" | "confirmado" | "realizado" | "faltou" | "cancelado" | "reagendado";
  professional: string;
  notes?: string;
  duration?: number; // em minutos
  roomOrChair?: string;
  preparationInterval?: number; // em minutos
  recurrence?: string;
  treatmentStage?: string;
  reminder?: string;
  cleanupInterval?: number;
  outcome?: string;
  version?: number;
}

export interface Task {
  id: string;
  clinicId?: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "waiting_patient" | "waiting_third_party" | "postponed" | "completed" | "cancelled";
  priority: "high" | "medium" | "low";
  dueTime?: string;
  responsible?: string;
  contactChannel?: string;
  category?: string;
  recurrence?: string;
  treatmentStage?: string;
  origin?: string;
  waitingCondition?: string;
  nextAction?: string;
  completedAt?: string;
  outcome?: string;
  version?: number;
}

export interface ClinicalEvolution {
  id: string;
  clinicId?: string;
  patientId: string;
  date: string;
  professional: string;
  procedure: string;
  description: string;
  nextStep?: string;
  recommendedReturnDays?: number;
  appointmentId?: string;
  complication?: string;
  conduct?: string;
  guidance?: string;
  changeReason?: string;
  version?: number;
}

export interface PatientFile {
  id: string;
  clinicId?: string;
  patientId: string;
  name: string;
  uploadDate: string;
  size: string;
  mimeType: string;
  downloadUrl: string;
  title?: string;
  category?: string;
  notes?: string;
  externalUrl?: string;
  appointmentId?: string;
  plannerId?: string;
  evolutionId?: string;
  version?: number;
}

export interface Lead {
  id: string;
  clinicId?: string;
  name: string;
  phone: string;
  source: string;
  status: "novo" | "contatado" | "agendado" | "arquivado";
  lastContactDate?: string;
  notes?: string;
  version?: number;
}

export interface FlowStage {
  id: string;
  title: string;
  patients: {
    id: string;
    name: string;
    details: string;
  }[];
}

export interface PatientFlow {
  id: string;
  clinicId?: string;
  title: string;
  stages: FlowStage[];
}

export interface PlannerChecklistItem {
  id: number;
  text: string;
  done: boolean;
  updatedAt?: string;
}

export interface PatientPlanner {
  id: string;
  clinicId: string;
  patientId: string;
  areaId: string;
  checklist: PlannerChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageTemplate {
  id: string;
  clinicId: string;
  title: string;
  bodyText: string;
  isActive: boolean;
  createdAt: string;
}

export type PlanStepStatus = "pending" | "ready" | "in_progress" | "waiting" | "completed" | "skipped" | "cancelled";

export interface PlanWorkflow {
  id: string;
  clinicId: string;
  patientId: string;
  areaId: string;
  name: string;
  status: "active" | "paused" | "completed" | "cancelled";
  responsible?: string;
  description?: string;
  startDate?: string;
  nextAction?: string;
  version?: number;
}

export interface PlanStep {
  id: string;
  clinicId: string;
  workflowId: string;
  title: string;
  status: PlanStepStatus;
  dueDate?: string;
  notes?: string;
  responsible?: string;
  sortOrder: number;
  taskId?: string;
  dependsOn?: string;
  version?: number;
}

export interface EvolutionRevision {
  id: string;
  clinicId: string;
  evolutionId: string;
  previousData: Record<string, unknown>;
  currentData: Record<string, unknown>;
  changeReason: string;
  changedBy: string;
  changedAt: string;
}

export interface ClinicSettings {
  clinicId: string;
  administrativePhone?: string;
  businessHours: Record<string, unknown>;
  resources: string[];
  preferences: Record<string, unknown>;
  inactivityDays: number;
  version?: number;
}

export interface ContactEvent {
  id: string;
  clinicId: string;
  patientId?: string;
  leadId?: string;
  channel: "whatsapp" | "phone" | "email" | "other";
  outcome: string;
  notes?: string;
  contactedAt: string;
}
