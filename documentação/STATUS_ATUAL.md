# STATUS ATUAL

- **Ultima atualizacao:** 19/07/2026 20:15 (America/Sao_Paulo)
- **Fase atual:** fechamento funcional e publicacao do MVP
- **Branch:** `main`
- **Supabase:** `jcteqdvkviodempumgqp`

## Implementado e validado

- Supabase e Storage como fontes reais, com RLS multitenant por clinica.
- Auth por cookies SSR, renovacao no Proxy, login, logout e recuperacao/redefinicao de senha.
- Pacientes com validacao de CPF, telefone e nascimento, aviso de duplicidade, filtros e ordenacao.
- Agenda com desfechos e bloqueio transacional de choque de profissional ou sala/cadeira.
- Pendencias com estados operacionais e persistencia real.
- Planejamento visual em `plan_workflows`/`plan_steps`, sem progresso ficticio.
- Evolucoes estruturadas e revisao atomica com justificativa e historico.
- Arquivos privados com metadados, links externos, URL assinada, exclusao e rollback de upload.
- CRM com cadastro de lead, eventos de contato e conversao atomica em paciente.
- Configuracoes da clinica persistidas; auditoria e versao nas entidades operacionais.
- Tela Hoje com filtros reais e alternancia entre cards e lista.

## Aguardando validacao manual autenticada

- Login invalido, logout, recovery, recarga e expiracao de sessao no navegador publicado.
- CRUD vertical com reload para paciente, pendencia, agenda, evolucao, arquivo e planejamento.
- Responsividade visual em aparelho real de aproximadamente 390 px.
- GitHub Actions e deploy Hostinger apos o push desta rodada.

## Pendencias externas ou decisoes abertas

- Habilitar `Leaked Password Protection` no painel do Supabase Auth.
- Papeis finais, multiunidade, limites definitivos de arquivos, retencao, exportacoes, assinatura, politica final de CPF, navegacao final de fluxos e Clinicorp dependem de decisao explicita.

## Evidencias

- `npm.cmd run lint`: sucesso.
- `npx.cmd tsc --noEmit`: sucesso.
- `npm.cmd run build`: sucesso, 18 paginas estaticas e rotas dinamicas geradas.
- Migrations locais e remotas alinhadas e aplicadas.
- Testes SQL transacionais com rollback: auditoria, conflito de agenda e conversao de lead aprovados sem dados residuais.
- Advisor de seguranca: somente `auth_leaked_password_protection` permanece.
