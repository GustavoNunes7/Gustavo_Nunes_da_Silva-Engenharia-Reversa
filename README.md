# Oficina AutoCerta — Engenharia Reversa

Documentação acadêmica do sistema web de gestão de clientes, veículos e agendamentos.

## Executar
- Node.js 22.13 ou superior.
- Na pasta do projeto: npm install e npm start.
- Acessar http://localhost:3000.

## Arquivos principais
- server.js: servidor Express e API REST.
- db/oficina_db.sql: estrutura e dados iniciais do SQLite.
- db/conexao.js: inicialização do banco.
- seguranca.js: criptografia do CPF.
- public/: páginas HTML, CSS e JavaScript.
- docs/engenharia-reversa.md: requisitos, mapas, segurança e testes.
- docs/der.md: diagrama entidade-relacionamento.
- docs/fluxograma.md: fluxo de cadastro de agendamento.
- docs/evidencias/: capturas de tela dos testes.

Os resultados observados dos testes devem ser preenchidos somente após executar cada caso no ambiente local. As contas de demonstração exibidas na tela de login devem ser usadas apenas localmente.
