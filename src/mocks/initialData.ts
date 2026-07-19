import { Patient, Appointment, Task, ClinicalEvolution, PatientFile, Lead, PatientFlow } from "../types";

export const initialPatients: Patient[] = [
  {
    id: "pat-1",
    name: "Carlos Eduardo Silva",
    birthDate: "1988-05-12",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "carlos.silva@email.com",
    status: "alert",
    nextAction: "Remarcar cirurgia cancelada",
    nextActionDate: "2026-07-17",
    notes: "Paciente com sensibilidade no dente 36."
  },
  {
    id: "pat-2",
    name: "Ana Souza Rodrigues",
    birthDate: "1995-10-22",
    cpf: "987.654.321-11",
    phone: "(11) 97654-3210",
    email: "ana.souza@email.com",
    status: "active",
    nextAction: "Confirmar consulta de retorno",
    nextActionDate: "2026-07-18",
    notes: "Tratamento ortodôntico em andamento."
  },
  {
    id: "pat-3",
    name: "Roberto de Almeida Jr.",
    birthDate: "1975-03-05",
    cpf: "456.789.123-22",
    phone: "(11) 96543-2109",
    email: "roberto.almeida@email.com",
    status: "alert",
    nextAction: "Solicitar exame de imagem (panorâmica)",
    nextActionDate: "2026-07-16",
    notes: "Precisa de avaliação de implante no dente 14."
  },
  {
    id: "pat-4",
    name: "Mariana Ramos Lima",
    birthDate: "2001-08-14",
    cpf: "321.654.987-33",
    phone: "(11) 95432-1098",
    email: "mariana.ramos@email.com",
    status: "active",
    nextAction: "Iniciar nova etapa de clareamento",
    nextActionDate: "2026-07-20"
  },
  {
    id: "pat-5",
    name: "Beatriz Costa Fonseca",
    birthDate: "1990-12-01",
    cpf: "159.753.852-44",
    phone: "(11) 94321-0987",
    email: "beatriz.costa@email.com",
    status: "inactive",
    notes: "Tratamento concluído em 2025. Entrar em contato para retorno preventivo."
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: "app-1",
    patientId: "pat-2",
    patientName: "Ana Souza Rodrigues",
    date: "2026-07-18",
    time: "14:00",
    type: "manutencao",
    status: "agendado",
    professional: "Dra. Patricia Lima",
    notes: "Manutenção do aparelho ortodôntico."
  },
  {
    id: "app-2",
    patientId: "pat-3",
    patientName: "Roberto de Almeida Jr.",
    date: "2026-07-16",
    time: "09:30",
    type: "planejamento",
    status: "cancelado",
    professional: "Dr. Gabriel Mendes",
    notes: "Paciente desmarcou devido a compromisso pessoal."
  },
  {
    id: "app-3",
    patientId: "pat-4",
    patientName: "Mariana Ramos Lima",
    date: "2026-07-20",
    time: "16:30",
    type: "consulta",
    status: "agendado",
    professional: "Dr. Gabriel Mendes",
    notes: "Avaliação estética de clareamento."
  }
];

export const initialTasks: Task[] = [
  {
    id: "task-1",
    patientId: "pat-1",
    patientName: "Carlos Eduardo Silva",
    title: "Entrar em contato",
    description: "Ligar para remarcar a cirurgia que foi cancelada semana passada.",
    dueDate: "2026-07-16",
    status: "pending",
    priority: "high"
  },
  {
    id: "task-2",
    patientId: "pat-3",
    patientName: "Roberto de Almeida Jr.",
    title: "Pedir panorâmica",
    description: "Cobrar o envio do exame de imagem panorâmica para planejamento de implante.",
    dueDate: "2026-07-15",
    status: "pending",
    priority: "high"
  },
  {
    id: "task-3",
    patientId: "pat-2",
    patientName: "Ana Souza Rodrigues",
    title: "Confirmação de agenda",
    description: "Confirmar a presença na consulta de manutenção no sábado dia 18.",
    dueDate: "2026-07-17",
    status: "pending",
    priority: "medium"
  }
];

export const initialEvolutions: ClinicalEvolution[] = [
  {
    id: "evo-1",
    patientId: "pat-2",
    date: "2026-06-18",
    professional: "Dra. Patricia Lima",
    procedure: "Manutenção Ortodôntica",
    description: "Realizada ativação do arco ortodôntico superior. Troca das ligaduras elásticas por cor cinza. Paciente relata boa adaptação.",
    nextStep: "Troca do arco inferior no próximo mês.",
    recommendedReturnDays: 30
  },
  {
    id: "evo-2",
    patientId: "pat-1",
    date: "2026-07-02",
    professional: "Dr. Gabriel Mendes",
    procedure: "Profilaxia e Restauração",
    description: "Remoção de tártaro e biofilme em ambas arcadas. Realizada restauração classe I com resina composta fotopolimerizável no dente 36.",
    nextStep: "Remover ponto da cirurgia de siso.",
    recommendedReturnDays: 15
  }
];

export const initialFiles: PatientFile[] = [
  {
    id: "file-1",
    patientId: "pat-3",
    name: "panoramica_roberto.png",
    uploadDate: "2026-05-10",
    size: "4.2 MB",
    mimeType: "image/png",
    downloadUrl: "https://lh3.googleusercontent.com/aida/AP1WRLt-IO-nPQBiDRFeJrbmbyL3kMwj0cKLqoST4BEv1p"
  },
  {
    id: "file-2",
    patientId: "pat-1",
    name: "planejamento_implante.pdf",
    uploadDate: "2026-06-25",
    size: "1.8 MB",
    mimeType: "application/pdf",
    downloadUrl: "https://lh3.googleusercontent.com/aida/AP1WRLt46Wdd5Nshj-deAh5NsWWQykhoiZlU"
  }
];

export const initialLeads: Lead[] = [
  {
    id: "lead-1",
    name: "Fernanda Silveira",
    phone: "(11) 91234-5678",
    source: "Instagram Ads",
    status: "novo",
    notes: "Interessada em lentes de contato dental."
  },
  {
    id: "lead-2",
    name: "Marcos Paulo Cunha",
    phone: "(11) 92345-6789",
    source: "Google Search",
    status: "contatado",
    lastContactDate: "2026-07-14",
    notes: "Aguardando definição de horário para avaliação."
  }
];

export const initialFlows: PatientFlow[] = [
  {
    id: "flow-geral",
    title: "Fluxo Geral de Acompanhamento",
    stages: [
      {
        id: "stage-novo",
        title: "Novos Contatos",
        patients: [
          { id: "pat-lead-1", name: "Fernanda Silveira", details: "Instagram Ads - Lentes" }
        ]
      },
      {
        id: "stage-agenda",
        title: "Aguardando Agendamento",
        patients: [
          { id: "pat-1", name: "Carlos Eduardo Silva", details: "Cirurgia cancelada" }
        ]
      },
      {
        id: "stage-planejamento",
        title: "Em Planejamento",
        patients: [
          { id: "pat-3", name: "Roberto de Almeida Jr.", details: "Aguardando panorâmica" }
        ]
      },
      {
        id: "stage-tratamento",
        title: "Em Tratamento",
        patients: [
          { id: "pat-2", name: "Ana Souza Rodrigues", details: "Manutenção ortodôntica" },
          { id: "pat-4", name: "Mariana Ramos Lima", details: "Clareamento" }
        ]
      }
    ]
  }
];
