# DER — Oficina AutoCerta

~~~mermaid
erDiagram
    USUARIOS {
        INTEGER id PK
        TEXT nome
        TEXT login UK
        TEXT senha "hash bcrypt"
    }
    CLIENTES {
        INTEGER id PK
        TEXT nome
        TEXT cpf "AES-256-GCM"
        TEXT telefone
        TEXT email
    }
    VEICULOS {
        INTEGER id PK
        TEXT placa UK
        TEXT modelo
        TEXT tipo
        TEXT marca
        INTEGER cliente_id FK
    }
    AGENDAMENTOS {
        INTEGER id PK
        INTEGER veiculo_id FK
        TEXT data_agendamento
        TEXT servico
    }
    CLIENTES ||--o{ VEICULOS : possui
    VEICULOS ||--o{ AGENDAMENTOS : recebe
~~~

## Relacionamentos
- Um cliente pode possuir zero ou vários veículos; cada veículo pertence a um cliente.
- Um veículo pode ter zero ou vários agendamentos; cada agendamento pertence a um veículo.
- Usuários são usados para autenticação e não têm relacionamento declarado com as outras tabelas.

O diagrama corresponde às tabelas e chaves de db/oficina_db.sql. CPF é criptografado no banco e a senha é armazenada como hash bcrypt.
