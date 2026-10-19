# Oficina AutoCerta — Engenharia Reversa

## Sobre o projeto

O **Oficina AutoCerta** é um sistema web acadêmico que simula o controle básico de uma oficina mecânica. Ele reúne em uma única aplicação os dados de clientes, os veículos vinculados a esses clientes e os agendamentos de serviços.

O objetivo desta entrega é documentar o funcionamento do sistema por meio de **engenharia reversa**: analisar a estrutura existente, identificar a função de cada parte e incluir comentários simples no código para explicar o que ela faz e por que é necessária. A versão comentada fica na pasta `sistema_comentado/`.

## Funcionalidades

- **Login e sessão:** autenticação dos usuários e encerramento da sessão.
- **Clientes:** consulta, pesquisa por nome/CPF/telefone/e-mail, cadastro e edição.
- **Veículos:** listagem e cadastro de veículos associados a um cliente, com validação da placa.
- **Agendamentos:** criação de agendamentos de serviço e alteração da data, com agrupamento visual por mês.
- **Validação de dados:** o servidor verifica campos obrigatórios, formatos e relacionamentos antes de gravar informações.
- **Proteção de dados:** as senhas de demonstração são verificadas com hash bcrypt e o CPF é criptografado pela aplicação antes de ser armazenado.
- **Banco de dados local:** SQLite mantém os registros de usuários, clientes, veículos e agendamentos.

## Tecnologias utilizadas

- **Node.js** para executar o servidor.
- **Express** para rotas HTTP e API.
- **SQLite** para persistência local dos dados.
- **HTML, CSS e JavaScript** para a interface no navegador.
- **express-session** para sessões de login.
- **bcryptjs** para verificar hashes de senha.
- **Módulo crypto do Node.js** para criptografia do CPF.

## Como o sistema funciona

1. O usuário acessa a página de login e envia suas credenciais.
2. O servidor confere o login e compara a senha informada com o hash armazenado no banco.
3. Após a autenticação, a sessão permite acessar as páginas internas e as rotas privadas da API.
4. A interface consulta a API para mostrar clientes, veículos e agendamentos.
5. Ao cadastrar ou editar informações, o navegador envia os dados ao servidor; o servidor valida os campos e executa as instruções SQL no SQLite.
6. Os agendamentos relacionam um veículo, a data e o serviço. Como o veículo pertence a um cliente, a aplicação também consegue mostrar informações do proprietário.

## Estrutura do projeto

```text
sistema_comentado/
├── server.js                 # Servidor Express e rotas da API
├── seguranca.js              # Criptografia e descriptografia do CPF
├── package.json              # Dependências e comando para iniciar
├── package-lock.json         # Versões exatas das dependências instaladas
├── db/
│   ├── conexao.js            # Abre o banco SQLite e inicializa as tabelas
│   ├── gerar_sql.js          # Gera o script SQL com dados de demonstração
│   └── oficina_db.sql        # Tabelas, relacionamentos e registros iniciais
└── public/
    ├── login.html            # Tela de autenticação
    ├── principal.html        # Menu principal
    ├── clientes.html         # Tela de clientes
    ├── veiculos.html         # Tela de veículos
    ├── agendamentos.html     # Tela de agendamentos
    ├── css/style.css         # Estilos da interface
    └── js/
        ├── comum.js          # Funções compartilhadas e chamadas à API
        ├── login.js          # Comportamento do login
        ├── clientes.js       # Consulta, cadastro e edição de clientes
        ├── veiculos.js       # Consulta e cadastro de veículos
        └── agendamentos.js   # Consulta e manutenção dos agendamentos
```

## Requisitos

- Node.js **22.13.0 ou superior**.
- npm, instalado junto com o Node.js.
- Navegador moderno.

## Como executar localmente

No terminal, entre na pasta do sistema comentado e execute:

```bash
npm install
npm start
```

Depois, abra [http://localhost:3000](http://localhost:3000) no navegador. Na primeira execução, a aplicação cria o arquivo SQLite e inicializa o banco com o script SQL.

### Usuários de demonstração

- `admin` / `admin123`
- `ana.mecanica` / `ana123`
- `carlos.recepcao` / `carlos123`

Essas credenciais são apenas para demonstração local. Não use senhas reais nem publique dados pessoais reais no projeto.

## Documentação da engenharia reversa

A pasta `docs/` contém os materiais de análise, incluindo o diagrama entidade-relacionamento (`der.png`), fluxograma, mapas da API e da interface, análise de segurança e evidências de testes. Consulte também os arquivos nessa pasta para compreender os relacionamentos do banco e o fluxo das funcionalidades.

## Observações sobre segurança

Este projeto é demonstrativo e não deve ser considerado pronto para produção sem ajustes adicionais. Antes de disponibilizá-lo publicamente, seria necessário, entre outras medidas, retirar segredos do código e usar variáveis de ambiente, configurar cookies de sessão seguros em HTTPS, revisar a política de sessões e proteger dados pessoais. As credenciais exibidas na tela são de teste.

## Objetivo acadêmico

O foco da atividade é explicar o funcionamento existente sem alterar desnecessariamente a lógica. Os comentários no código registram a finalidade das rotas, validações, consultas, funções de interface e estrutura do banco, facilitando a leitura e a apresentação do projeto.
