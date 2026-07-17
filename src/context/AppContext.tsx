"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Patient, Appointment, Task, ClinicalEvolution, PatientFile, Lead, PatientFlow } from "../types";
import {
  initialPatients,
  initialAppointments,
  initialTasks,
  initialEvolutions,
  initialFiles,
  initialLeads,
  initialFlows
} from "../mocks/initialData";

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
  moveLead: (leadId: string, targetStage: string) => void;
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

  // Initialize data on mount
  useEffect(() => {
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
  }, []);

  // Save data to localStorage when state changes
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

  // Actions implementation
  const addPatient = (patientInput: Omit<Patient, "id">): string => {
    const newId = `pat-${Date.now()}`;
    const newPatient: Patient = { ...patientInput, id: newId };
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Paciente "${patientInput.name}" cadastrado com sucesso!`, "success");
    return newId;
  };

  const updatePatient = (id: string, patientInput: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patientInput } : p))
    );
    showToast("Dados cadastrais do paciente atualizados!", "success");
  };

  const addAppointment = (appInput: Omit<Appointment, "id">) => {
    const newApp: Appointment = {
      ...appInput,
      id: `app-${Date.now()}`
    };
    setAppointments((prev) => [newApp, ...prev]);
    showToast("Agendamento clínico criado!", "success");
  };

  const updateAppointment = (id: string, appInput: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...appInput } : a))
    );
    showToast("Agendamento clínico atualizado!", "success");
  };

  const addTask = (taskInput: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}`
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast("Nova pendência registrada!", "success");
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t))
    );
    showToast("Pendência concluída!", "success");
  };

  const addEvolution = (evoInput: Omit<ClinicalEvolution, "id">) => {
    const newEvo: ClinicalEvolution = {
      ...evoInput,
      id: `evo-${Date.now()}`
    };
    setEvolutions((prev) => [newEvo, ...prev]);
    showToast("Nova evolução clínica salva!", "success");
  };

  const addFile = (fileInput: Omit<PatientFile, "id">) => {
    const newFile: PatientFile = {
      ...fileInput,
      id: `file-${Date.now()}`
    };
    setFiles((prev) => [newFile, ...prev]);
    showToast("Arquivo/Exame anexado!", "success");
  };

  const moveLead = (leadId: string, targetStage: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStage as any } : l))
    );
    showToast("Lead movido de etapa!", "success");
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
