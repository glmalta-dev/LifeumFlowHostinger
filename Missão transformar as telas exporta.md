# Missão: transformar as telas exportadas no protótipo funcional do Lifeum Flow

Quero que você analise integralmente este workspace e transforme as telas de design já exportadas em uma aplicação web funcional, navegável e executável localmente.

O projeto se chama **Lifeum Flow**.

Nesta primeira etapa, o objetivo não é conectar banco de dados, GitHub, serviços externos ou infraestrutura definitiva.

O objetivo é:

1. compreender o produto;
2. analisar as telas existentes;
3. identificar a arquitetura visual e funcional;
4. planejar a implementação;
5. criar a aplicação localmente;
6. reaproveitar o máximo possível do design existente;
7. conectar as telas e os principais fluxos;
8. completar as interfaces indispensáveis que estiverem faltando;
9. executar a aplicação;
10. verificar visualmente o resultado no navegador;
11. produzir um plano claro para as próximas etapas.

---

# 1. Regras iniciais obrigatórias

Antes de criar, apagar, mover ou modificar arquivos:

1. inspecione integralmente o workspace;
2. identifique todos os arquivos e diretórios;
3. localize as telas exportadas;
4. identifique imagens, HTML, CSS, componentes, assets, ícones e fontes;
5. determine a tecnologia utilizada no material exportado;
6. liste todas as telas encontradas;
7. identifique telas duplicadas ou variantes;
8. identifique os componentes recorrentes;
9. identifique inconsistências visuais;
10. identifique ações e fluxos aparentes.

Não comece reconstruindo o projeto do zero antes de compreender o material existente.

Não descarte arquivos exportados apenas porque a estrutura não está organizada.

Utilize as telas existentes como principal referência visual.

---

# 2. Segurança e limites desta missão

Trabalhe exclusivamente dentro da pasta deste projeto.

Não execute comandos destrutivos fora do workspace.

Não apague diretórios externos.

Não altere arquivos do sistema operacional.

Não altere outros projetos.

Não inicialize nem conecte repositório Git.

Não publique código.

Não realize deploy.

Não conecte GitHub.

Não conecte banco de dados.

Não configure Firebase, Supabase, PostgreSQL ou qualquer serviço de produção.

Não solicite nem utilize credenciais, tokens ou chaves privadas.

Não implemente integrações reais com WhatsApp, Google Maps, serviços de pagamento ou armazenamento externo nesta fase.

Quando alguma funcionalidade depender de integração externa, crie apenas uma abstração local ou simulação segura.

---

# 3. O que é o Lifeum Flow

O Lifeum Flow é uma aplicação de gestão ativa e acompanhamento clínico-operacional de pacientes odontológicos.

Não é apenas uma agenda.

Não é apenas um cadastro de pacientes.

Não é apenas um prontuário eletrônico.

Seu objetivo central é impedir que pacientes, contatos, tratamentos, retornos, solicitações e próximas etapas clínicas sejam esquecidos.

O sistema deve permitir que a clínica acompanhe continuamente cada paciente, desde o primeiro contato até a conclusão do tratamento e os retornos de manutenção.

O Lifeum Flow deve tornar evidente:

* quem precisa de atenção agora;
* quais ações estão atrasadas;
* quais pacientes aguardam resposta;
* quais consultas precisam ser agendadas;
* quais consultas precisam ser remarcadas;
* quais retornos estão pendentes;
* quais planejamentos estão incompletos;
* quais tratamentos estão parados;
* quais procedimentos possuem próxima etapa;
* quais pacientes estão sem próxima ação;
* quais exames ou documentos estão pendentes;
* quais contatos precisam ser retomados;
* quais pacientes possuem pendências financeiras;
* quais casos necessitam de acompanhamento clínico ou administrativo.

O princípio central do sistema é:

> Todo paciente ativo deve possuir um estado atual compreensível e, quando necessário, uma próxima ação definida.

---

# 4. Usuários e contexto de utilização

A aplicação será utilizada principalmente por profissionais e equipes de clínicas odontológicas.

O uso prioritário será em smartphones, especialmente na orientação vertical, mas a aplicação também deve funcionar corretamente em tablets e computadores.

A experiência deve favorecer:

* acesso rápido;
* poucos toques;
* uso com uma mão;
* clareza de prioridades;
* redução de esquecimentos;
* rápida localização de pacientes;
* acompanhamento de tratamentos;
* registro de próximas ações;
* leitura confortável;
* operação clínica e administrativa cotidiana.

---

# 5. Tecnologia obrigatória

Implemente a aplicação utilizando:

* Next.js;
* TypeScript;
* App Router;
* React;
* arquitetura mobile-first;
* componentes reutilizáveis;
* CSS organizado de acordo com o material exportado;
* aplicação preparada para futura configuração como PWA;
* estrutura compatível com execução Node.js e futuro deploy na Hostinger.

Não utilize:

* Angular;
* Android nativo;
* Create React App;
* React Router;
* Vite como arquitetura principal;
* páginas HTML independentes sem estrutura compartilhada.

Caso o material exportado use outra estrutura, aproveite seus elementos visuais e converta progressivamente para Next.js, sem descaracterizar as telas.

Use versões estáveis e mutuamente compatíveis das dependências.

Evite dependências desnecessárias.

---

# 6. Escopo desta primeira versão

Nesta missão, crie um **protótipo funcional de alta fidelidade**.

A aplicação deve:

* abrir localmente;
* possuir navegação funcional;
* apresentar as telas existentes;
* permitir testar os principais fluxos;
* utilizar dados simulados;
* possuir componentes reutilizáveis;
* preservar o design;
* funcionar sem banco de dados;
* funcionar sem autenticação real;
* funcionar sem serviços externos.

Não implemente ainda:

* backend definitivo;
* banco de dados definitivo;
* controle de acesso definitivo;
* regras de segurança de produção;
* sincronização em tempo real;
* armazenamento de prontuários reais;
* integração real com serviços externos;
* faturamento real;
* processamento real de dados clínicos.

Esta versão é um protótipo funcional local, não um sistema pronto para utilização com pacientes reais.

---

# 7. Fonte visual de verdade

As telas existentes no workspace constituem a principal fonte visual do projeto.

Preserve:

* composição;
* identidade visual;
* paleta;
* tipografia;
* hierarquia;
* espaçamentos;
* bordas;
* raios;
* sombras;
* iconografia;
* cards;
* botões;
* menus;
* cabeçalhos;
* densidade visual;
* organização;
* aparência premium;
* comportamento mobile.

Não transforme o projeto em um dashboard administrativo genérico.

Não substitua a identidade existente por um template pronto.

Não mude arbitrariamente cores, fontes ou estruturas.

Não crie uma nova linguagem visual.

Quando houver divergências entre telas, identifique:

1. o padrão mais recorrente;
2. a versão visualmente mais coerente;
3. a variante mais compatível com o restante do projeto.

Consolide essa versão como padrão canônico.

Registre divergências relevantes no relatório final.

---

# 8. Auditoria obrigatória das telas

Analise todas as telas e identifique:

* telas existentes;
* objetivo provável de cada tela;
* módulo ao qual pertencem;
* possíveis rotas;
* ações visíveis;
* origem e destino das ações;
* componentes recorrentes;
* variações legítimas;
* inconsistências;
* lacunas funcionais.

Verifique especificamente:

* barras inferiores diferentes;
* menus em ordens diferentes;
* ícones diferentes para a mesma função;
* cabeçalhos inconsistentes;
* botões equivalentes com estilos diferentes;
* cards duplicados;
* diferenças de tipografia;
* espaçamentos divergentes;
* cores de status inconsistentes;
* nomes diferentes para o mesmo conceito;
* ações sem destino;
* telas sem retorno;
* fluxos interrompidos;
* formulários sem confirmação;
* ações destrutivas sem diálogo;
* ausência de loading;
* ausência de estado vazio;
* ausência de erro;
* ausência de sucesso;
* ausência de feedback após ações.

Crie um arquivo:

```text
docs/UI_AUDIT.md
```

Registre nele:

* telas encontradas;
* padrões identificados;
* inconsistências;
* decisões de padronização;
* telas ou estados faltantes;
* riscos;
* itens que exigirão validação humana posterior.

---

# 9. Planejamento antes da implementação

Antes de implementar alterações amplas, crie:

```text
docs/IMPLEMENTATION_PLAN.md
```

O plano deve conter:

* diagnóstico do material recebido;
* arquitetura proposta;
* estrutura de diretórios;
* mapa de rotas;
* inventário inicial de componentes;
* modelos de dados simulados;
* sequência de implementação;
* critérios de conclusão;
* riscos;
* lacunas;
* itens fora do escopo.

Depois de registrar o plano, prossiga diretamente com a implementação desta primeira versão.

Não interrompa a missão apenas para apresentar o planejamento.

Use o planejamento como referência operacional e atualize-o conforme necessário.

---

# 10. Padronização e reaproveitamento

Elementos repetidos devem ser transformados em componentes compartilhados.

Considere pelo menos:

* `AppShell`;
* `AppHeader`;
* `BackHeader`;
* `BottomNavigation`;
* `QuickCaptureButton`;
* `PatientCard`;
* `AppointmentCard`;
* `PriorityCard`;
* `PlanningCard`;
* `StatusBadge`;
* `PrimaryButton`;
* `SecondaryButton`;
* `DestructiveButton`;
* `IconButton`;
* `SearchField`;
* `FilterButton`;
* `Tabs`;
* `SectionHeader`;
* `FormField`;
* `SelectField`;
* `DateField`;
* `ConfirmationDialog`;
* `BottomSheet`;
* `Toast`;
* `EmptyState`;
* `LoadingState`;
* `ErrorState`.

Não replique manualmente o mesmo cabeçalho, menu ou card em cada página.

Não crie múltiplos componentes independentes para a mesma finalidade.

Quando existirem variações reais, use propriedades ou variantes tipadas.

Exemplo conceitual:

```ts
type PatientCardVariant =
  | "default"
  | "compact"
  | "priority"
  | "appointment";
```

Uma alteração no componente canônico deve refletir em todas as telas que o utilizam.

---

# 11. Iconografia

Identifique a família de ícones predominante nas telas.

Centralize o uso dos ícones em um único mapa ou módulo.

Exemplo:

```ts
export const appIcons = {
  today: TodayIcon,
  patients: PatientsIcon,
  quickCapture: AddIcon,
  flows: FlowsIcon,
  more: MoreIcon,
  appointments: CalendarIcon,
  planning: PlanningIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  search: SearchIcon,
  filter: FilterIcon,
  whatsapp: WhatsAppIcon,
  back: BackIcon,
  notifications: NotificationIcon,
};
```

Regras:

* a mesma ação deve utilizar sempre o mesmo ícone;
* não misture famílias de ícones sem justificativa;
* não altere arbitrariamente peso, tamanho ou estilo;
* preserve estados ativo e inativo;
* mantenha área de toque adequada;
* evite ícones decorativos sem função.

---

# 12. Navegação principal

Analise as telas e consolide a barra inferior principal.

Salvo evidência clara em contrário, utilize:

1. Hoje;
2. Pacientes;
3. Captura rápida;
4. Fluxos;
5. Mais.

Padronize:

* ordem;
* rótulos;
* ícones;
* altura;
* padding;
* distribuição;
* estado ativo;
* estado inativo;
* botão central;
* borda;
* fundo;
* sombra;
* área de toque.

Implemente uma única barra inferior compartilhada.

Não permita que cada tela possua uma implementação independente.

A barra deve aparecer apenas nas telas em que sua presença fizer sentido.

Telas secundárias, detalhes, formulários e modais podem usar cabeçalho com retorno, conforme o padrão visual identificado.

---

# 13. Módulos principais

## 13.1 Hoje

A tela Hoje é a central operacional.

Deve apresentar, conforme as telas disponíveis:

* pendências;
* itens atrasados;
* ações de hoje;
* prioridades;
* pacientes aguardando contato;
* pacientes aguardando agendamento;
* pacientes que precisam ser remarcados;
* retornos;
* planejamentos pendentes;
* tratamentos sem próxima etapa;
* próximos compromissos.

Os cards devem permitir acesso à ficha do paciente ou à ação correspondente.

## 13.2 Pacientes

Deve permitir:

* visualizar a lista geral;
* pesquisar;
* filtrar;
* ordenar;
* abrir ficha;
* visualizar status;
* identificar próxima ação;
* identificar pendências;
* iniciar cadastro simulado.

## 13.3 Ficha do paciente

A ficha deve centralizar:

* resumo;
* dados cadastrais;
* agendamentos;
* próximas ações;
* planejamento;
* evoluções clínicas;
* histórico;
* arquivos;
* financeiro;
* comunicação;
* exportação.

Use a arquitetura visual encontrada nas telas.

## 13.4 Planejamento

O planejamento deve organizar tratamentos por áreas.

Considere:

* Dentística;
* Prótese;
* Implantodontia;
* Ortodontia;
* Periodontia;
* Cirurgia;
* Endodontia;
* Preventivo;
* Pré-natal odontológico;
* áreas personalizáveis.

Cada área pode conter:

* procedimentos;
* subcategorias;
* etapas;
* checklist;
* responsável;
* status;
* prazo;
* observações;
* documentos;
* próxima ação.

## 13.5 Agenda

Deve representar:

* agendamento;
* confirmação;
* cancelamento;
* desmarcação;
* remarcação;
* retorno;
* falta;
* paciente a contatar.

## 13.6 Evoluções clínicas

Devem permitir visualizar ou simular:

* data;
* profissional;
* procedimento;
* descrição;
* intercorrências;
* orientação;
* anexos;
* próxima etapa;
* retorno recomendado.

## 13.7 Fluxos

Fluxos representam conjuntos de acompanhamento.

Exemplos:

* novo paciente;
* aguardando agendamento;
* paciente que desmarcou;
* retorno pós-operatório;
* planejamento incompleto;
* tratamento parado;
* manutenção;
* cobrança pendente;
* exame pendente.

## 13.8 Comunicação

Simule ações de comunicação.

Considere:

* selecionar mensagem;
* inserir primeiro nome;
* inserir nome completo;
* confirmação;
* reagendamento;
* retorno;
* orientação;
* localização da clínica.

Não implemente integração externa real nesta fase.

## 13.9 Exportação

Crie ou preserve a interface de seleção de dados para exportação.

Considere:

* dados cadastrais;
* planejamento;
* procedimentos;
* evoluções;
* agendamentos;
* arquivos;
* anamnese;
* financeiro;
* pagamentos;
* pendências;
* comunicação.

A exportação pode ser simulada.

---

# 14. Captura rápida

O botão central deve abrir uma interface de captura rápida.

Inclua ações coerentes com o produto:

* cadastrar paciente;
* criar pendência;
* registrar contato;
* criar agendamento;
* criar retorno;
* registrar nota;
* adicionar evolução;
* iniciar planejamento;
* anexar arquivo.

Use o padrão visual predominante para modal ou bottom sheet.

---

# 15. Dados simulados

Crie dados locais realistas e centralizados.

Inclua cenários como:

* paciente com tratamento ativo;
* paciente com ação atrasada;
* paciente aguardando agendamento;
* paciente que desmarcou;
* paciente aguardando resposta;
* paciente com planejamento incompleto;
* paciente sem próxima ação;
* paciente com retorno;
* paciente com pendência financeira;
* paciente com tratamento concluído.

Não espalhe arrays estáticos pelas páginas.

Crie uma estrutura semelhante a:

```text
src/
  mocks/
  repositories/
  services/
  types/
```

Defina interfaces TypeScript para:

* paciente;
* contato;
* agendamento;
* pendência;
* próxima ação;
* planejamento;
* área de tratamento;
* procedimento;
* evolução;
* pagamento;
* arquivo;
* mensagem.

Crie repositórios locais assíncronos simulados, para que a interface não dependa diretamente dos mocks.

Exemplo conceitual:

```ts
export interface PatientRepository {
  list(): Promise<Patient[]>;
  findById(id: string): Promise<Patient | null>;
  create(input: CreatePatientInput): Promise<Patient>;
  update(id: string, input: UpdatePatientInput): Promise<Patient>;
}
```

Nesta fase, implemente:

```text
MockPatientRepository
```

A arquitetura deve permitir substituir futuramente essa implementação por um backend real.

---

# 16. Persistência local provisória

Quando for útil para demonstrar o funcionamento, utilize armazenamento local do navegador apenas como persistência provisória.

Pode ser utilizado para:

* concluir uma pendência;
* alterar status;
* adicionar uma próxima ação;
* cadastrar um paciente de demonstração;
* manter filtros ou preferências;
* simular alterações durante testes.

Centralize o acesso ao armazenamento local.

Não acesse `localStorage` diretamente em vários componentes.

Não trate essa persistência como solução definitiva.

Não armazene dados clínicos reais.

---

# 17. Telas e estados faltantes

O material exportado pode não conter todos os elementos necessários.

Você pode criar interfaces complementares quando forem indispensáveis para completar um fluxo.

Exemplos:

* modal de confirmação;
* bottom sheet;
* confirmação destrutiva;
* estado vazio;
* loading;
* skeleton;
* erro;
* sucesso;
* sem resultados;
* formulário complementar;
* menu contextual;
* toast;
* seleção de data;
* seleção de filtros;
* confirmação de saída;
* validação de formulário;
* tela não encontrada.

Regras para novas interfaces:

* utilizar componentes existentes;
* seguir a mesma identidade visual;
* reutilizar ícones;
* respeitar a mesma tipografia;
* respeitar os mesmos tokens;
* não criar uma estética paralela;
* criar apenas o mínimo necessário;
* registrar no relatório o que foi acrescentado.

Não invente grandes módulos novos sem base no escopo.

---

# 18. Rotas

Crie rotas coerentes com o App Router.

Estrutura conceitual:

```text
/
├── hoje
├── pacientes
│   ├── novo
│   └── [patientId]
│       ├── resumo
│       ├── agendamentos
│       ├── proximas-acoes
│       ├── planejamento
│       │   └── [areaId]
│       ├── evolucoes
│       ├── historico
│       ├── arquivos
│       ├── financeiro
│       └── dados-cadastrais
├── agenda
├── fluxos
├── mensagens
└── mais
```

Adapte às telas realmente encontradas.

Evite criar páginas desnecessárias quando um modal, aba ou bottom sheet for mais adequado.

---

# 19. Nomenclatura oficial

Utilize consistentemente:

* Hoje;
* Pacientes;
* Ficha do paciente;
* Planejamento;
* Próxima ação;
* Pendência;
* Agendamento;
* Reagendamento;
* Retorno;
* Evolução clínica;
* Fluxos;
* Captura rápida;
* Dados cadastrais;
* Histórico;
* Arquivos;
* Exportação.

Distinções:

* `Pendência`: algo que exige resolução;
* `Próxima ação`: próximo passo definido;
* `Agendamento`: atendimento com data e horário;
* `Reagendamento`: alteração de atendimento existente;
* `Retorno`: contato ou atendimento posterior programado;
* `Planejamento`: organização das áreas, procedimentos e etapas do tratamento;
* `Evolução clínica`: registro do atendimento ou procedimento realizado.

Não alterne entre sinônimos sem necessidade.

---

# 20. Organização do código

Adote uma estrutura de projeto clara, com separação por domínio.

Exemplo:

```text
src/
├── app/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── patients/
│   ├── planning/
│   ├── appointments/
│   ├── forms/
│   ├── overlays/
│   └── feedback/
├── features/
│   ├── patients/
│   ├── planning/
│   ├── appointments/
│   ├── tasks/
│   ├── messages/
│   └── exports/
├── repositories/
├── services/
├── mocks/
├── hooks/
├── types/
├── utils/
├── styles/
└── assets/
```

Não aplique padrões arquiteturais excessivamente complexos para esta fase.

A arquitetura deve ser organizada, tipada e preparada para crescer, mas sem abstrações artificiais.

---

# 21. Sequência de implementação

Execute nesta ordem:

## Fase 1 — Diagnóstico

* inspecionar arquivos;
* catalogar telas;
* reconhecer stack;
* identificar assets;
* identificar padrões;
* criar auditoria;
* criar plano.

## Fase 2 — Base técnica

* configurar Next.js;
* configurar TypeScript;
* organizar estilos;
* criar layout global;
* criar tokens;
* centralizar ícones;
* definir tipos;
* criar mocks;
* criar repositórios simulados.

## Fase 3 — Componentes canônicos

* cabeçalhos;
* barra inferior;
* botões;
* cards;
* badges;
* campos;
* modais;
* estados de feedback.

## Fase 4 — Rotas e telas

* converter ou integrar as telas existentes;
* ligar rotas;
* preservar o design;
* eliminar duplicações.

## Fase 5 — Fluxos funcionais

Implemente ao menos:

* abrir Hoje;
* navegar pela barra inferior;
* listar pacientes;
* pesquisar pacientes;
* aplicar filtro simulado;
* abrir ficha;
* navegar pelas áreas da ficha;
* abrir planejamento;
* abrir uma área do planejamento;
* visualizar agendamentos;
* visualizar próximas ações;
* criar pendência simulada;
* concluir pendência;
* reagendar consulta simulada;
* abrir captura rápida;
* abrir ação de WhatsApp simulada;
* mostrar confirmação;
* mostrar feedback de sucesso.

## Fase 6 — Estados

* loading;
* vazio;
* erro;
* sem resultados;
* confirmação;
* sucesso;
* ação destrutiva.

## Fase 7 — Execução

* instalar dependências;
* executar verificação de tipos;
* executar lint;
* executar build;
* iniciar servidor local.

## Fase 8 — Verificação visual

Abra a aplicação no navegador e valide:

* viewport mobile;
* viewport desktop;
* navegação;
* alinhamento;
* overflow;
* responsividade;
* menus;
* cabeçalhos;
* cards;
* modais;
* formulários;
* estados ativos;
* botões;
* erros no console.

Corrija os problemas encontrados.

Não considere a missão concluída apenas porque o código compila.

---

# 22. Verificação visual obrigatória

Use o navegador para inspecionar as páginas principais.

Priorize um viewport aproximado de:

```text
390 × 844 px
```

Verifique também desktop.

Capture evidências visuais das principais telas implementadas.

Compare o resultado com as telas exportadas.

Analise:

* fidelidade;
* diferenças;
* conteúdo cortado;
* elementos desalinhados;
* navegação sobrepondo conteúdo;
* botões fora da viewport;
* textos ilegíveis;
* cards inconsistentes;
* menus diferentes;
* responsividade;
* erros de console.

Corrija os problemas de alta prioridade antes de encerrar.

---

# 23. Documentação produzida

Crie e mantenha:

```text
docs/
├── PRODUCT_CONTEXT.md
├── UI_AUDIT.md
├── SCREEN_INVENTORY.md
├── COMPONENT_INVENTORY.md
├── ROUTE_MAP.md
├── IMPLEMENTATION_PLAN.md
├── MISSING_UI.md
├── TECHNICAL_DECISIONS.md
└── NEXT_STEPS.md
```

## `PRODUCT_CONTEXT.md`

Descreve o que é o Lifeum Flow e seus princípios.

## `SCREEN_INVENTORY.md`

Lista:

* tela;
* módulo;
* rota;
* origem;
* destino;
* status;
* observações.

## `COMPONENT_INVENTORY.md`

Lista componentes, variantes e telas em que aparecem.

## `MISSING_UI.md`

Lista:

* telas faltantes;
* modais;
* estados;
* confirmações;
* fluxos incompletos.

## `TECHNICAL_DECISIONS.md`

Registra decisões tomadas e justificativas.

## `NEXT_STEPS.md`

Apresenta o plano para:

1. revisão do protótipo;
2. consolidação do Design System;
3. modelagem do banco;
4. autenticação;
5. backend;
6. regras de acesso;
7. integrações;
8. testes;
9. GitHub;
10. deploy na Hostinger.

---

# 24. O que não fazer

Não:

* redesenhe tudo;
* substitua o projeto por template genérico;
* apague telas sem documentação;
* duplique componentes;
* crie um menu diferente em cada página;
* utilize ícones diferentes para a mesma função;
* invente regras clínicas;
* conecte banco;
* conecte GitHub;
* faça deploy;
* use dados reais;
* exponha informações sensíveis;
* implemente autenticação improvisada;
* crie funcionalidades aleatórias;
* esconda erros de TypeScript;
* ignore erros de build;
* declare sucesso sem executar a aplicação;
* encerre sem verificar no navegador.

---

# 25. Critérios de conclusão

Esta missão estará concluída quando:

* o projeto executar localmente;
* as telas exportadas estiverem incorporadas;
* a identidade visual estiver preservada;
* a navegação principal funcionar;
* os componentes recorrentes estiverem centralizados;
* os menus estiverem padronizados;
* os cabeçalhos estiverem padronizados;
* os ícones estiverem reutilizados;
* os principais fluxos puderem ser testados;
* os dados simulados estiverem centralizados;
* não houver dependência de backend;
* não houver erros críticos no console;
* TypeScript estiver válido;
* o build for concluído;
* a aplicação tiver sido verificada no navegador;
* as lacunas estiverem documentadas;
* o planejamento das próximas etapas estiver criado.

---

# 26. Entrega final da missão

Ao finalizar, apresente um relatório objetivo contendo:

## Implementado

Liste tudo o que foi efetivamente construído.

## Reaproveitado

Informe quais telas, estilos, assets e componentes foram aproveitados do material original.

## Padronizado

Informe quais elementos foram consolidados:

* menus;
* cabeçalhos;
* ícones;
* cards;
* botões;
* estilos.

## Criado para completar fluxos

Informe quais modais, estados ou telas auxiliares foram acrescentados.

## Verificado

Informe:

* comandos executados;
* resultado do typecheck;
* resultado do lint;
* resultado do build;
* telas verificadas no navegador;
* problemas encontrados e corrigidos.

## Pendente

Liste claramente o que ainda não foi implementado.

## Próxima etapa recomendada

Apresente uma sequência técnica objetiva para evolução do protótipo até a aplicação de produção.

Comece agora pela inspeção integral do workspace, registre o plano e prossiga com a implementação local da aplicação.
