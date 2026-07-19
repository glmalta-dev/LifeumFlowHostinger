-- Schema SQL para o Supabase (Editor SQL do Supabase)

-- Habilitar extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Pacientes
CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    birth_date TEXT NOT NULL,
    cpf TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'alert', 'inactive')),
    next_action TEXT,
    next_action_date TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('consulta', 'retorno', 'cirurgia', 'planejamento', 'manutencao')),
    status TEXT NOT NULL CHECK (status IN ('agendado', 'confirmado', 'realizado', 'cancelado')),
    professional TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Pendências (Tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed')),
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Evoluções Clínicas
CREATE TABLE IF NOT EXISTS evolutions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    professional TEXT NOT NULL,
    procedure TEXT NOT NULL,
    description TEXT NOT NULL,
    next_step TEXT,
    recommended_return_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Arquivos
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    upload_date TEXT NOT NULL,
    size TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    download_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabela de CRM Leads
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('novo', 'contatado', 'agendado', 'arquivado')),
    last_contact_date TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela de Fluxos (Kanban)
CREATE TABLE IF NOT EXISTS flows (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    stages JSONB NOT NULL, -- Estrutura contendo o array de estágios e pacientes do funil
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados mockados para o setup inicial (Opcional)
INSERT INTO patients (id, name, birth_date, cpf, phone, email, status, next_action, next_action_date, notes) VALUES
('pat-1', 'Carlos Eduardo Silva', '1985-04-12', '123.456.789-00', '(11) 98765-4321', 'carlos.silva@email.com', 'active', 'Cobrar laudo radiográfico', '2026-07-20', 'Paciente hipertenso controlado. Alérgico a penicilina.'),
('pat-2', 'Ana Beatriz Souza', '1992-08-25', '987.654.321-11', '(11) 99876-5432', 'ana.souza@email.com', 'alert', 'Ligar para reagendar retorno de 30 dias', '2026-07-18', 'Tratamento de prótese provisória.'),
('pat-3', 'Mariana Oliveira Reis', '1978-11-03', '111.222.333-44', '(11) 97654-3210', 'mariana.reis@email.com', 'inactive', NULL, NULL, 'Concluiu a fase cirúrgica em abril.');

INSERT INTO appointments (id, patient_id, patient_name, date, time, type, status, professional, notes) VALUES
('app-1', 'pat-1', 'Carlos Eduardo Silva', '2026-07-17', '14:00', 'cirurgia', 'confirmado', 'Dr. Gustavo Malta', 'Instalação de implante região 36'),
('app-2', 'pat-2', 'Ana Beatriz Souza', '2026-07-18', '10:30', 'retorno', 'agendado', 'Dr. Gustavo Malta', 'Ajuste oclusal da prótese');

INSERT INTO tasks (id, patient_id, patient_name, title, description, due_date, status, priority) VALUES
('task-1', 'pat-1', 'Carlos Eduardo Silva', 'Ligar para confirmar pós-operatório', 'Falar com o paciente no dia seguinte à cirurgia do implante 36.', '2026-07-18', 'pending', 'high'),
('task-2', 'pat-2', 'Ana Beatriz Souza', 'Solicitar liberação do convênio', 'Checar status da guia de autorização de prótese.', '2026-07-21', 'pending', 'medium');

INSERT INTO flows (id, title, stages) VALUES
('flow-1', 'Gestão de Pacientes & Tratamento', '[
  {
    "id": "stage-1",
    "title": "Novos Contatos (CRM)",
    "patients": [
      {"id": "lead-1", "name": "Juliana Santos", "details": "WhatsApp - Orçamento Ortodontia"},
      {"id": "lead-2", "name": "Marcos Vieira", "details": "Instagram - Implante Unitário"}
    ]
  },
  {
    "id": "stage-2",
    "title": "Aguardando Agendamento",
    "patients": [
      {"id": "pat-3", "name": "Mariana Oliveira Reis", "details": "Retorno Cirurgia Pendente"}
    ]
  },
  {
    "id": "stage-3",
    "title": "Em Planejamento",
    "patients": [
      {"id": "pat-2", "name": "Ana Beatriz Souza", "details": "Moldagem Realizada"}
    ]
  },
  {
    "id": "stage-4",
    "title": "Em Tratamento",
    "patients": [
      {"id": "pat-1", "name": "Carlos Eduardo Silva", "details": "Agendado para Implante"}
    ]
  }
]'::jsonb);
