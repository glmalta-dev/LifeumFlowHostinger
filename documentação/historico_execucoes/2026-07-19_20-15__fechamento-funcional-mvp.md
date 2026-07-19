# Historico de execucao — fechamento funcional do MVP

- **Data:** 19/07/2026
- **Escopo:** itens consolidados da documentacao mestra ainda ausentes no sistema.
- **Status:** codigo e Supabase implementados; aguardando validacao autenticada no deploy.

## Entregas

- Auth SSR com cookies, Proxy, logout e recuperacao/redefinicao de senha.
- Configuracoes persistidas da clinica, auditoria de eventos e versao de registros.
- Bloqueio transacional de choque de agenda por profissional e recurso.
- Planejamento hierarquico, revisao auditavel de evolucoes e Storage privado completo.
- CRM com eventos de contato e conversao atomica para paciente.
- Validacao cadastral, aviso de duplicidade e confirmacao humana.
- Filtros de pacientes e modos cards/lista na tela Hoje.

## Validacao

- ESLint, TypeScript e build de producao aprovados.
- Migrations aplicadas e historico local/remoto alinhado.
- Testes SQL de auditoria, conflito e conversao executados em transacao com rollback.
- Advisors sem falhas de seguranca controlaveis por migration; permanece a protecao de senha vazada do painel Auth.

## Fora do escopo por decisao aberta

- Papeis finais, multiunidade, politica definitiva de arquivos e retencao.
- Exportacoes, assinatura, CPF como bloqueio definitivo, navegacao final de fluxos e Clinicorp.
