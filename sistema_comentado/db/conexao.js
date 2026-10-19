// O módulo fs verifica a existência do banco e lê o script SQL inicial.
const fs = require('fs');
const path = require('path');
// SQLite embutido no Node.js (versão 22.13 ou superior): não precisa instalar nem compilar nada
const { DatabaseSync } = require('node:sqlite');

// Mantém o arquivo SQLite dentro desta pasta, independentemente da pasta de onde o programa foi iniciado.
// Guarda o banco nesta pasta para que o caminho não dependa do terminal usado.
const arquivo = path.join(__dirname, 'oficina_db.sqlite');
// Registra se o arquivo ainda não existe, para executar a criação inicial uma única vez.
// Verifica se o banco ainda não existe para saber se precisa inicializá-lo.
const primeiraVez = !fs.existsSync(arquivo);

// Abre ou cria o arquivo de banco de dados SQLite.
const db = new DatabaseSync(arquivo);
// Obriga o SQLite a respeitar os relacionamentos entre clientes, veículos e agendamentos.
// Pede ao SQLite para validar os relacionamentos entre tabelas.
db.exec('PRAGMA foreign_keys = ON');

// Na primeira execução, cria e popula o banco usando o próprio script oficina_db.sql
if (primeiraVez) {
    db.exec(fs.readFileSync(path.join(__dirname, 'oficina_db.sql'), 'utf8'));
}

// Disponibiliza a conexão para as rotas do servidor executarem consultas SQL.
module.exports = db;
