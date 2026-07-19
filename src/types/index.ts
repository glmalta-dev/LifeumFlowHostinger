export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  cpf?: string;
  phone: string;
  email: string;
  status: "active" | "alert" | "inactive";
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: "consulta" | "retorno" | "cirurgia" | "planejamento" | "manutencao";
  status: "agendado" | "confirmado" | "realizado" | "cancelado";
  professional: string;
  notes?: string;
}

export interface Task {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  priority: "high" | "medium" | "low";
}

export interface ClinicalEvolution {
  id: string;
  patientId: string;
  date: string;
  professional: string;
  procedure: string;
  description: string;
  nextStep?: string;
  recommendedReturnDays?: number;
}

export interface PatientFile {
  id: string;
  patientId: string;
  name: string;
  uploadDate: string;
  size: string;
  mimeType: string;
  downloadUrl: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: "novo" | "contatado" | "agendado" | "arquivado";
  lastContactDate?: string;
  notes?: string;
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
  title: string;
  stages: FlowStage[];
}
