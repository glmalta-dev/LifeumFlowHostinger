# Plano de Implementação — Lifeum Flow Prototype

Este documento detalha o planejamento técnico e arquitetural para a construção do protótipo funcional do **Lifeum Flow** usando Next.js, TypeScript e React Context API, seguindo a estilização Vanilla CSS.

---

## 1. Arquitetura de Diretórios Proposta

O projeto Next.js será estruturado da seguinte forma na pasta `/src`:

```text
src/
├── app/                        # Rotas e páginas do App Router
│   ├── layout.tsx              # Layout global com o Provider de estado e fontes
│   ├── page.tsx                # Redireciona para /hoje
│   ├── hoje/                   # Módulo Hoje (Tela Inicial)
│   │   ├── page.tsx
│   │   └── pendencias/         # Lista de Pendências
│   │       ├── page.tsx
│   │       └── [taskId]/       # Detalhe da Pendência
│   │           └── page.tsx
│   ├── pacientes/              # Módulo Pacientes
│   │   ├── page.tsx            # Lista geral de pacientes
│   │   ├── novo/               # Formulário Novo Paciente
│   │   │   └── page.tsx
│   │   └── [patientId]/        # Ficha do Paciente (Sub-rotas organizadas)
│   │       ├── layout.tsx      # Layout da ficha com cabeçalho e abas do paciente
│   │       ├── resumo/         # Sub-aba Resumo
│   │       │   └── page.tsx
│   │       ├── planejamento/   # Sub-aba Planejamento
│   │       │   ├── page.tsx
│   │       │   └── [areaId]/   # Detalhe de Área (ex: Prótese)
│   │       │       └── page.tsx
│   │       ├── agendamentos/   # Sub-aba Agendamentos
│   │       │   ├── page.tsx
│   │       │   └── editar/     # Novo ou Editar agendamento
│   │       │       └── page.tsx
│   │       ├── evolucoes/      # Sub-aba Evoluções
│   │       │   ├── page.tsx
│   │       │   └── nova/       # Nova evolução clínica
│   │       │       └── page.tsx
│   │       ├── arquivos/       # Sub-aba Arquivos
│   │       │   ├── page.tsx
│   │       │   └── [fileId]/   # Visualizador de arquivo
│   │       │       └── page.tsx
│   │       └── historico/      # Sub-aba Histórico Completo
│   │           └── page.tsx
│   ├── agenda/                 # Agenda Geral do sistema
│   │   └── page.tsx
│   ├── fluxos/                 # Kanban e fluxos de acompanhamento
│   │   ├── page.tsx
│   │   └── [flowId]/           # Detalhe do fluxo (pacientes por etapa)
│   │       └── page.tsx
│   ├── contatos/               # Contatos e Leads (CRM)
│   │   └── page.tsx
│   ├── mais/                   # Menu "Mais" e utilitários
│   │   ├── page.tsx
│   │   └── configuracoes/      # Configurações do sistema
│   │       └── page.tsx
├── components/                 # Componentes compartilhados
│   ├── layout/
│   │   ├── AppShell.tsx        # Container que define o grid da aplicação e BottomNavigation
│   │   ├── BackHeader.tsx      # Cabeçalho com botão de voltar
│   │   └── AppHeader.tsx       # Cabeçalho da tela principal
│   ├── navigation/
│   │   └── BottomNavigation.tsx# Menu inferior principal
│   ├── ui/                     # Componentes fundamentais de UI
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── BottomSheet.tsx     # Utilizado para o menu "+" e captura rápida
│   │   └── Toast.tsx           # Feedback não intrusivo de sucesso/erro
├── context/
│   └── AppContext.tsx          # React Context contendo o banco de dados simulado e mutadores
├── mocks/
│   └── initialData.ts          # Massa de dados inicial (pacientes, pendências, etc)
├── types/
│   └── index.ts                # Interfaces TypeScript estruturadas
└── styles/
    ├── variables.css           # Tokens do Design System
    └── globals.css             # Estilos compartilhados e reset
```

---

## 2. Modelos de Dados Simulados (Types)

Os principais tipos a serem definidos no `src/types/index.ts` serão:

- **Patient:** ID, nome, data de nascimento, CPF, telefone, e-mail, status geral, próxima ação.
- **Appointment:** ID, patientId, data, hora, tipo (consulta, retorno, cirurgia), status (agendado, confirmado, realizado, cancelado), profissional.
- **Task (Pendência):** ID, patientId, descrição, prazo, status (pendente, concluída), prioridade (alta, média, baixa).
- **Flow (Fluxo):** ID, nome do fluxo, etapas (ex: Novo Paciente, Tratamento Parado, Manutenção), associação de pacientes às etapas.
- **ClinicalEvolution:** ID, patientId, data, profissional, procedimento, descrição, próximaEtapa.
- **PatientFile:** ID, patientId, nome, dataUpload, tamanho, mimeType, downloadUrl.

---

## 3. Estado Global (React Context API)

Será criado o `AppContext` expondo:
1. `patients`, `appointments`, `tasks`, `evolutions`, `files`, `leads`.
2. Ações de mutação para demonstrar interatividade:
   - `addPatient(patient)`
   - `updatePatient(id, patient)`
   - `addTask(task)`
   - `completeTask(taskId)`
   - `addAppointment(appointment)`
   - `updateAppointment(id, appointment)`
   - `addEvolution(evolution)`
   - `addFile(file)`
   - `moveLead(leadId, targetStage)`

---

## 4. Estilos (Option A: Vanilla CSS)

Seguiremos as orientações estritas do projeto:
- Mapeamento completo dos tokens do `design.md` em variáveis CSS (como `--primary: #1463e6`, `--text-primary: #102044`).
- Utilização de classes CSS estruturadas no arquivo `globals.css` (como `.btn-primary`, `.patient-card`, `.nav-bar`, `.layout-mobile`).
- Suporte a efeito Glassmorphism para o `BottomNavigation` e cabeçalhos com blur de 24px: `backdrop-filter: blur(24px); background: rgba(255, 255, 255, 0.72)`.

---

## 5. Sequência Técnica de Trabalho

1. **Setup do Next.js:** Executar `create-next-app` sem Tailwind, estruturando TypeScript, ESLint e pasta `src`.
2. **Design Tokens:** Criar `src/styles/variables.css` com as cores do Design System, tipografia e bordas.
3. **Mocks e Context:** Criar `initialData.ts`, `types/index.ts` e `AppContext.tsx` para suporte a persistência simulada em `localStorage`.
4. **AppShell & Navegação:** Desenvolver `AppShell`, `AppHeader`, `BackHeader` e a barra inferior `BottomNavigation` (contendo o botão "+" de Captura Rápida).
5. **Componentes Canônicos:** Desenvolver cards de paciente, badges de status, inputs e botões.
6. **Mapeamento de Rotas:** Desenvolver cada página de `/hoje` até `/mais`, transportando a estrutura das telas do Stitch.
7. **Interatividade Completa:** Ligar o modal de Captura Rápida a todos os formulários funcionais do sistema.
8. **Build & Verificação:** Rodar build local, corrigir lints, subir servidor e testar no navegador (viewport 390x844px).
