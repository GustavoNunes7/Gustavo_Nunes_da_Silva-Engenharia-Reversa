# Mapa do Front-end — Oficina AutoCerta

## 1. Objetivo

Este documento descreve as páginas HTML, os scripts JavaScript e as rotas da API utilizados pelo front-end do sistema Oficina AutoCerta.

## 2. Páginas e arquivos JavaScript

| Página HTML | Script JavaScript | Funcionalidade | Rotas da API |
|---|---|---|---|
| `public/login.html` | `public/js/login.js` | Autenticação do usuário | `POST /api/login` |
| `public/principal.html` | `public/js/comum.js` | Área principal e funcionalidades comuns | `GET /api/me`, `POST /api/logout` |
| `public/clientes.html` | `public/js/clientes.js` | Consulta, pesquisa, cadastro e edição de clientes | `GET /api/clientes`, `POST /api/clientes`, `PUT /api/clientes/:id` |
| `public/veiculos.html` | `public/js/veiculos.js` | Consulta e cadastro de veículos | `GET /api/veiculos`, `POST /api/veiculos` |
| `public/agendamentos.html` | `public/js/agendamentos.js` | Consulta, cadastro e alteração da data de agendamentos | `GET /api/agendamentos`, `POST /api/agendamentos`, `PUT /api/agendamentos/:id` |

## 3. Funcionamento do front-end

O front-end é composto por páginas HTML e scripts JavaScript responsáveis pela interação com o usuário.

O funcionamento geral ocorre nas seguintes etapas:

1. O usuário acessa a página de login.
2. Informa suas credenciais e envia o formulário.
3. O script de login envia uma requisição para a API.
4. O servidor verifica as credenciais e cria a sessão quando o login é válido.
5. Após a autenticação, o usuário pode acessar as funcionalidades protegidas.
6. Os scripts enviam requisições para consultar, cadastrar ou atualizar informações.
7. As respostas da API são utilizadas para atualizar a interface ou apresentar mensagens.

## 4. Integração entre front-end e back-end

A comunicação ocorre por meio de requisições HTTP às rotas disponibilizadas pelo servidor Express. Os scripts JavaScript são responsáveis por enviar os dados dos formulários e processar as respostas recebidas.

O controle de sessão permite que as rotas protegidas identifiquem usuários autenticados. Caso a sessão não seja válida, a API pode retornar uma resposta de erro de autenticação.

## 5. Organização dos arquivos

- `public/`: contém as páginas HTML e os recursos disponibilizados pelo servidor.
- `public/js/`: contém os scripts JavaScript responsáveis pelas funcionalidades das páginas.
- `server.js`: implementa o servidor Express e as rotas da API.

## 6. Observação

O mapa foi elaborado com base nos arquivos identificados no projeto. Antes da entrega, deve-se conferir se cada página realmente chama todas as rotas indicadas e se os comportamentos descritos correspondem à implementação atual.
