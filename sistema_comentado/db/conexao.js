// O módulo fs verifica a existência do banco e lê o script SQL inicial.
const fs = require('fs');
const path = require('path');
// SQLite embutido no Node.js (versão 22.13 ou superior): não precisa instalar nem compilar nada
const { DatabaseSync } = require('node:sqlite');

// Mantém o arquivo SQLite dentro desta pasta, independentemente da pasta de onde o programa foi iniciado.
const arquivo = path.join(__dirname, 'oficina_db.sqlite');
const primeiraVez = !fs.existsSync(arquivo);

// Abre ou cria o arquivo de banco de dados SQLite.
const db = new DatabaseSync(arquivo);
db.exec('PRAGMA foreign_keys = ON');

// Na primeira execução, cria e popula o banco usando o próprio script oficina_db.sql
if (primeiraVez) {
    db.exec(fs.readFileSync(path.join(__dirname, 'oficina_db.sql'), 'utf8'));
}

// Disponibiliza a conexão para as rotas do servidor executarem consultas SQL.
module.exports = db;
