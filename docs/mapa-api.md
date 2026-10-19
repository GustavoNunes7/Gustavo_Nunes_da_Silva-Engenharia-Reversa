# Mapa da API — Oficina AutoCerta

## 1. Objetivo

Este documento apresenta as rotas da API do sistema Oficina AutoCerta, incluindo métodos HTTP, entradas, saídas esperadas e validações identificadas no código-fonte.

## 2. Rotas da API

| Método | Rota | Entrada | Saída esperada | Validações |
|---|---|---|---|---|
| GET | `/` | Nenhuma | Redireciona para `/login.html` | Rota inicial |
| POST | `/api/login` | `login`, `senha` | 200: sucesso; 400: campos ausentes; 401: credenciais inválidas | Verifica campos e senha com bcrypt |
| POST | `/api/logout` | Sessão atual | 200: `{ "ok": true }` | Encerra a sessão |
| GET | `/api/me` | Sessão autenticada | ID e nome do usuário | Exige autenticação |
| GET | `/api/clientes` | Query opcional `busca` | Lista de clientes | Exige autenticação |
| POST | `/api/clientes` | `nome`, `cpf`, `telefone`, `email` | 201: cadastro realizado; 400: dados inválidos | Nome obrigatório, CPF com 11 dígitos, e-mail validado e CPF único |
| PUT | `/api/clientes/:id` | ID e dados do cliente | 200: atualizado; 400: dados inválidos; 404: não encontrado | Valida dados e existência do registro |
| GET | `/api/veiculos` | Nenhuma | Lista de veículos e respectivos clientes | Exige autenticação |
| POST | `/api/veiculos` | `placa`, `modelo`, `tipo`, `marca`, `cliente_id` | 201: cadastro realizado; 400: dados inválidos | Placa válida e única, campos obrigatórios e cliente existente |
| GET | `/api/agendamentos` | Nenhuma | Lista de agendamentos com dados relacionados | Exige autenticação |
| POST | `/api/agendamentos` | `veiculo_id`, `data_agendamento`, `servico` | 201: cadastro realizado; 400: dados inválidos | Veículo existente, data válida e serviço preenchido |
| PUT | `/api/agendamentos/:id` | ID e `data_agendamento` | 200: atualizado; 400: data inválida; 404: não encontrado | Valida data e existência do agendamento |

## 3. Padrão de comunicação

A API utiliza o protocolo HTTP para comunicação entre o front-end e o servidor Express. As operações de cadastro e atualização recebem dados no corpo da requisição, geralmente em formato JSON.

### Principais códigos HTTP

- **200 OK:** operação concluída com sucesso.
- **201 Created:** registro criado com sucesso.
- **400 Bad Request:** dados ausentes ou inválidos.
- **401 Unauthorized:** autenticação necessária ou credenciais inválidas.
- **404 Not Found:** registro não encontrado.

## 4. Segurança da API

As rotas de consulta e gerenciamento verificam a autenticação do usuário. As senhas são verificadas com bcrypt, e os dados são consultados no banco SQLite por meio de consultas parametrizadas.

O CPF é criptografado no armazenamento e descriptografado quando necessário para exibição nas respostas da API. Por isso, o acesso aos dados retornados deve ser restrito.

## 5. Observação

Este mapa representa as rotas identificadas no código-fonte do projeto. Os códigos HTTP e os detalhes das respostas devem ser conferidos no arquivo `server.js` antes da entrega final.
