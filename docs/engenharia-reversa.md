# Engenharia reversa — Oficina AutoCerta

## Escopo
Análise estática de server.js, db/oficina_db.sql, db/conexao.js, seguranca.js e arquivos de public/. Os resultados esperados abaixo foram derivados do código. Resultado observado fica pendente até execução real.

## Requisitos funcionais
- RF01: autenticar usuário por login e senha.
- RF02: encerrar a sessão.
- RF03: consultar usuário da sessão atual.
- RF04: listar e pesquisar clientes por nome, CPF, telefone ou e-mail.
- RF05: cadastrar e editar clientes.
- RF06: listar veículos.
- RF07: cadastrar veículo vinculado a cliente.
- RF08: listar agendamentos com dados de veículo e cliente.
- RF09: criar agendamento para um veículo.
- RF10: alterar a data de um agendamento.

## Regras de negócio
- RB01: login e senha são obrigatórios; senha comparada com hash bcrypt.
- RB02: rotas de dados exigem sessão autenticada.
- RB03: nome e CPF são obrigatórios; CPF deve ter 11 dígitos após remover pontuação.
- RB04: CPF não pode repetir em outro cliente; a comparação descriptografa os valores armazenados.
- RB05: e-mail informado deve corresponder a um padrão simples de e-mail.
- RB06: placa é normalizada para maiúsculas e sem espaços/hífens; aceita padrão antigo e Mercosul.
- RB07: placa deve ser única e veículo deve apontar para cliente existente.
- RB08: modelo e tipo de veículo são obrigatórios.
- RB09: agendamento exige veículo existente, data real no formato AAAA-MM-DD e serviço não vazio.
- RB10: edição do agendamento altera apenas a data.
- RB11: listagens são ordenadas conforme as consultas SQL.
- RB12: duração configurada da sessão é de 30 minutos.

## Mapa da API
| Método e rota | Autenticação | Entrada | Sucesso | Erros principais |
|---|---|---|---|---|
| GET / | Não | — | Redireciona para /login.html | — |
| POST /api/login | Não | {login, senha} | 200 {ok:true} | 400 campos ausentes; 401 credenciais inválidas |
| POST /api/logout | Não exige middleware de login | — | 200 {ok:true} após destruir sessão | — |
| GET /api/me | Sim | Cookie de sessão | 200 {id,nome} | 401 sem sessão |
| GET /api/clientes | Sim | Query opcional busca | 200 array de clientes com CPF descriptografado | 401 sem sessão |
| POST /api/clientes | Sim | nome, cpf, telefone, email | 201 {ok:true} | 400 nome/CPF/e-mail inválido ou CPF repetido |
| PUT /api/clientes/:id | Sim | Dados do cliente | 200 {ok:true} | 404 inexistente; 400 dados inválidos |
| GET /api/veiculos | Sim | — | 200 array de veículos com nome do cliente | 401 sem sessão |
| POST /api/veiculos | Sim | placa, modelo, tipo, marca, cliente_id | 201 {ok:true} | 400 dados inválidos, cliente ausente ou placa repetida |
| GET /api/agendamentos | Sim | — | 200 array com dados relacionados e CPF descriptografado | 401 sem sessão |
| POST /api/agendamentos | Sim | veiculo_id, data_agendamento, servico | 201 {ok:true} | 400 veículo/data/serviço inválido |
| PUT /api/agendamentos/:id | Sim | data_agendamento | 200 {ok:true} | 404 agendamento inexistente; 400 data inválida |

### Observações da API
- Consultas SQL usam parâmetros ? para os valores recebidos.
- A busca de clientes filtra em memória após carregar e descriptografar os CPFs; pode ficar lenta com muitos registros.
- Logout não exige sessão por middleware.
- Não há rotas de exclusão.
- CPF é validado pelo tamanho, não pelos dígitos verificadores.

## Mapa do front-end
| Página | Scripts | Fluxo |
|---|---|---|
| /login.html | public/js/login.js, comum.js | POST /api/login; sucesso redireciona para /principal.html |
| /principal.html | comum.js | GET /api/me, POST /api/logout; links para módulos |
| /clientes.html | clientes.js, comum.js | GET /api/clientes?busca=; POST /api/clientes; PUT /api/clientes/:id |
| /veiculos.html | veiculos.js, comum.js | GET /api/veiculos; GET /api/clientes; POST /api/veiculos |
| /agendamentos.html | agendamentos.js, comum.js | GET /api/agendamentos; GET /api/veiculos; POST /api/agendamentos; PUT /api/agendamentos/:id |

comum.js centraliza fetch JSON, tratamento de erros, redirecionamento em 401, escape de HTML, formatação de CPF/data, modais e avisos. As páginas internas chamam iniciarPagina() para consultar a sessão.

## Modelo de dados
Consulte der.md. Entidades: usuarios, clientes, veiculos e agendamentos. Chaves estrangeiras: veiculos.cliente_id → clientes.id; agendamentos.veiculo_id → veiculos.id.

## Segurança
### Controles existentes
- Senhas armazenadas com hash bcrypt.
- CPF criptografado em repouso com AES-256-GCM; IV, tag e ciphertext são armazenados em Base64.
- Consultas parametrizadas.
- Middleware exigirLogin protege rotas de dados.
- Cookie de sessão usa httpOnly e expira em 30 minutos.
- esc() codifica caracteres HTML perigosos antes da exibição de textos.

### Riscos e três melhorias prioritárias
1. Segredo de sessão fixo no código: mover para variável de ambiente com valor aleatório forte.
2. Chave de criptografia do CPF derivada de texto fixo em seguranca.js: usar segredo externo ao repositório, planejar rotação e proteger backups. Não trocar sem migração, pois os CPFs existentes podem ficar ilegíveis.
3. Cookie não define secure nem sameSite: em produção HTTPS, configurar secure: true e sameSite adequado.
Outros riscos: express-session usa MemoryStore por padrão; não há rate limit no login nem proteção CSRF explícita; endpoints retornam dados pessoais em excesso; CPF não é validado pelos dígitos verificadores. Recomenda-se store de sessão persistente, limitação de tentativas, revisão de autorização e minimização dos dados retornados.

## Casos de teste — 15
A coluna “resultado observado” fica pendente para evitar inventar execução. Execute no ambiente local, confira as capturas PNG e substitua o status pelo resultado real.

| ID | Teste | Resultado esperado | Resultado observado |
|---|---|---|---|
| CT01 | Abrir / sem login | Redireciona para /login.html | Pendente de execução |
| CT02 | Login com credencial válida de teste | HTTP 200 e painel abre | Pendente de execução |
| CT03 | Login com senha incorreta | HTTP 401 e mensagem de credenciais inválidas | Pendente de execução |
| CT04 | Enviar login sem usuário ou senha | HTTP 400 | Pendente de execução |
| CT05 | Consultar /api/me sem sessão | HTTP 401 | Pendente de execução |
| CT06 | Fazer logout e consultar /api/me | Logout responde sucesso; consulta retorna 401 | Pendente de execução |
| CT07 | Listar clientes autenticado | HTTP 200 com lista | Pendente de execução |
| CT08 | Pesquisar cliente por parte do nome | Retorna correspondências | Pendente de execução |
| CT09 | Cadastrar cliente sem nome | HTTP 400 | Pendente de execução |
| CT10 | Cadastrar CPF com menos de 11 dígitos | HTTP 400 | Pendente de execução |
| CT11 | Cadastrar CPF já existente | HTTP 400 por duplicidade | Pendente de execução |
| CT12 | Cadastrar veículo com placa fora do padrão | HTTP 400 | Pendente de execução |
| CT13 | Cadastrar veículo com placa já existente | HTTP 400 por duplicidade | Pendente de execução |
| CT14 | Criar agendamento com data impossível, como 2026-02-30 | HTTP 400 | Pendente de execução |
| CT15 | Alterar data de agendamento inexistente | HTTP 404 | Pendente de execução |

Para cada caso, registre data, navegador/ambiente, status real, mensagem e nome do PNG em docs/evidencias/. Não use dados pessoais reais.
