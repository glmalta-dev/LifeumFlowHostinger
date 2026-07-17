# Auditoria de UI/UX — Lifeum Flow

Esta auditoria analisa as 25 telas originais clonadas do Google Stitch, identificando padrões visuais, inconsistências, fluxos implícitos e as decisões tomadas para a unificação da interface no protótipo funcional.

---

## 1. Mapeamento de Telas Encontradas

| ID | Nome Canônico | Módulo / Roteamento | Origem Esperada | Destino Esperado |
| :--- | :--- | :--- | :--- | :--- |
| `9984243789780924668` | Design System (`design.md`) | N/A (Guia de Estilo) | N/A | N/A |
| `e86b32c47f504031b17b574178e480e9` | 01. Tela Inicial — Hoje | `/hoje` | Inicial | Ficha do Paciente / Ação Rápida |
| `0fbf594ee67d4158963249340fb449c2` | 02. Ficha do Paciente — Resumo | `/pacientes/[id]/resumo` | Lista de Pacientes / Hoje | Sub-abas da Ficha / Agenda |
| `29cb94677fee44379bc6dbfdf6424ac3` | 03. Ficha do Paciente — Planejamento | `/pacientes/[id]/planejamento` | Ficha (Resumo) | Detalhe de Área |
| `43d380a0df214efcb4349061321d9953` | 04. Detalhe de uma área do planejamento | `/pacientes/[id]/planejamento/[areaId]` | Ficha (Planejamento) | Retorno para Planejamento |
| `0b14703d66fd444b8bee22b169dd08e1` | 05. Ficha do Paciente — Agendamentos | `/pacientes/[id]/agendamentos` | Ficha (Resumo) | Novo / Editar Agendamento |
| `599389c3308f4835b4b33ccee2981312` | 06. Novo ou editar agendamento | `/pacientes/[id]/agendamentos/editar` | Agendamentos / Hoje | Salvar -> Retorna para Agendamentos |
| `4c4c773c83fe4fe0b4fb6c9d74336d33` | 07. Ficha do Paciente (Evoluções) | `/pacientes/[id]/evolucoes` | Ficha (Resumo) | Nova Evolução |
| `f207739ce511402783f9b6ed2e8271f6` | 08. Nova evolução clínica | `/pacientes/[id]/evolucoes/nova` | Evoluções / Hoje | Salvar -> Retorna para Evoluções |
| `8421c41018814a56b022afc77204141b` | 09. Ficha do Paciente — Arquivos | `/pacientes/[id]/arquivos` | Ficha (Resumo) | Visualizar Arquivo |
| `77a209050e5144b0bb037a872bc19a67` | 10. Visualização de arquivo ou exame | `/pacientes/[id]/arquivos/[fileId]` | Arquivos | Retorno para Arquivos |
| `82f4061cbf74463aac2dc531c0f934b6` | 11. Ficha do Paciente — Histórico | `/pacientes/[id]/historico` | Ficha (Resumo) | Acompanhamento da timeline |
| `c469a409f4434e3a8face887a4baa9d4` | 12. Ficha do Paciente — Dados cadastrais | `/pacientes/[id]/dados-cadastrais` | Ficha (Resumo) | Salvar dados cadastrais |
| `8161de04fe084386bb8a4900dacd9e6a` | 13. Pacientes — Lista geral | `/pacientes` | Barra Inferior | Ficha do Paciente / Novo Paciente |
| `37806364c8e64c1aa37ef7b5b27834b1` | 14. Novo paciente | `/pacientes/novo` | Lista de Pacientes / Captura Rápida | Salvar -> Retorna para a Ficha |
| `602d2d8169c445b08561c5d01ff00594` | 15. Pendências e Próximas Ações | `/hoje/pendencias` | Hoje | Detalhe da Pendência |
| `8805ef63570e4876a68d80ec1aa85727` | 16. Detalhe de uma Pendência | `/hoje/pendencias/[taskId]` | Pendências | Concluir -> Retorna para Pendências |
| `0655466bb05445488d50ce83695a5f8a` | 17. Agenda Geral | `/agenda` | Barra Inferior | Novo Agendamento |
| `2cb38daa068f4f178f1c0bd770e360f7` | 18. Ações Rápidas do botão “+” | Overlay / Menu Flutuante | Botão "+" da Barra Inferior | Abrir formulários respectivos |
| `d18b68a78d7c4475bf6c5f943858b25e` | 19. Contatos e Leads | `/contatos` | Barra Inferior (Mais) | Iniciar contato / Mover Lead |
| `b692fe65dd1e4a0a96881ed39318c3d6` | 20. Fluxos | `/fluxos` | Barra Inferior | Detalhe de um Fluxo |
| `2211dc2c4b784b0eaa3a3060812fec9a` | 21. Detalhe de um Fluxo | `/fluxos/[flowId]` | Fluxos | Ficha do Paciente |
| `48cc792d761b435ba90a2eee82b024b0` | 22. Notificações e Alertas | `/alertas` | Cabeçalho (ícone de sino) | Ficha do Paciente / Ação Relacionada |
| `9977b392c11747088bb2b55666b91178` | 23. Menu “Mais” | `/mais` | Barra Inferior | Navegar para submenus (Configurações, etc) |
| `d4464be212074309afdab665a838986b` | 24. Configurações | `/mais/configuracoes` | Menu "Mais" | Salvar preferências |

---

## 2. Padrões Visuais Identificados (Design Tokens Canônicos)

Analisando o `design.md` e o `screen-data.json`, definimos a seguinte ficha técnica de design:

### 2.1 Paleta de Cores (CSS Variables)
- **Fundo Principal (Light Mode):** `#F6F8FC` (`--bg-app`)
- **Superfície (Cards/Modais):** `rgba(255, 255, 255, 0.88)` com blur (`--surface`)
- **Cor Primária (Ações/Destaque):** `#1463E6` (`--primary`)
- **Cor Secundária:** `#00629E` (`--secondary`)
- **Texto Principal:** `#102044` (`--text-primary`)
- **Texto Secundário:** `#5E6C86` (`--text-secondary`)
- **Status Positivo (Sucesso):** `#26B978` (`--success`)
- **Status Alerta (Atenção):** `#D99214` (`--warning`)
- **Status Negativo (Atraso Crítico):** `#E5484D` (`--error`)

### 2.2 Tipografia (Família 'Inter' e 'Manrope')
- **Títulos e Cabeçalhos:** `Manrope`, semibold ou bold (pesos `600`/`700`).
- **Textos de Corpo e Legendas:** `Inter`, regular ou medium (pesos `400`/`500`).
- **Estilos:**
  - `display-lg`: `fontSize: "34px"`, `fontWeight: "700"`, `lineHeight: "42px"`.
  - `headline-md`: `fontSize: "24px"`, `fontWeight: "600"`, `lineHeight: "32px"`.
  - `body-md`: `fontSize: "14px"`, `fontWeight: "400"`, `lineHeight: "20px"`.

### 2.3 Raio de Borda e Efeitos
- **Bordas gerais:** `8px` (`--radius-md`) para botões e cards, `12px` (`--radius-lg`) para modais de fundo.
- **Transparências:** Fundo de barra de navegação com `backdrop-filter: blur(24px)`.

---

## 3. Análise de Inconsistências e Decisões de Padronização

Ao inspecionar o código e imagens exportados, foram encontradas as seguintes divergências:

1. **Barras Inferiores (Bottom Navigation):**
   - *Divergência:* Algumas telas apresentam ícones ou ordens diferentes (ex: "Mais" e "Agenda" alternando posições).
   - *Decisão:* Padronizar a barra inferior compartilhada (`BottomNavigation`) com os 5 botões canônicos na seguinte ordem:
     1. **Hoje** (Ícone: Home/Today)
     2. **Pacientes** (Ícone: Users)
     3. **Captura Rápida** (Ícone: "+" destacado)
     4. **Fluxos** (Ícone: GitBranch/Stages)
     5. **Mais** (Ícone: Menu/More)
   - *Exceção:* Telas de formulários cheios (Ex: Novo Agendamento, Nova Evolução) ou visualizadores de arquivo ocultam a barra inferior para dar foco total ao conteúdo, substituindo-a por um cabeçalho de retorno (`BackHeader`).

2. **Cabeçalhos de Ficha do Paciente:**
   - *Divergência:* Em algumas telas, o nome do paciente no cabeçalho tem pesos diferentes, e o botão de "Voltar" às vezes aparece ao lado do nome, às vezes acima.
   - *Decisão:* Unificar em um componente `BackHeader` que exibe a ação de voltar à esquerda, o título no centro (ou alinhado à esquerda) e ações secundárias à direita.

3. **Cores de Alertas e Status:**
   - *Divergência:* Algumas telas usam fundos muito coloridos nos badges, enquanto outras usam apenas a borda colorida.
   - *Decisão:* Padronizar badges com fundo sutil (10% de opacidade da cor de status) e texto com cor cheia de alta legibilidade.

---

## 4. Estado de Fluxos e Interfaces Faltantes

As seguintes lacunas foram identificadas e serão criadas para garantir a fidelidade do protótipo:

- **Modal de Captura Rápida ("+"):** A tela `18. Ações Rápidas` é um bottom sheet. Implementaremos isso como um overlay global ativado a partir do `BottomNavigation`.
- **Feedbacks de Ações (Toasts):** Mensagem de "Paciente cadastrado com sucesso", "Agendamento salvo" e "Evolução clínica registrada" não possuem telas de design, mas serão implementadas como Toasts não-intrusivos no topo da tela.
- **Validação Visual de Formulários:** Impedir salvamento sem preenchimento dos campos obrigatórios com feedback sutil de erro.
