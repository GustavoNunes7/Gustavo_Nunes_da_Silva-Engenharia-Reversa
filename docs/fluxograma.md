# Fluxograma — cadastro de agendamento

~~~mermaid
flowchart TD
    A[Usuário autenticado abre Agendamentos] --> B[Clica em Novo agendamento]
    B --> C[Front-end solicita GET /api/veiculos]
    C --> D[Seleciona veículo, data e serviço]
    D --> E[Envia POST /api/agendamentos]
    E --> F{Sessão válida?}
    F -- Não --> G[HTTP 401 / login]
    F -- Sim --> H{Veículo existe?}
    H -- Não --> I[HTTP 400: selecione veículo]
    H -- Sim --> J{Data real AAAA-MM-DD?}
    J -- Não --> K[HTTP 400: data inválida]
    J -- Sim --> L{Serviço preenchido?}
    L -- Não --> M[HTTP 400: informe serviço]
    L -- Sim --> N[INSERT no SQLite]
    N --> O[HTTP 201: ok true]
    O --> P[Fecha modal e recarrega listagem]
~~~

O fluxo foi descrito a partir de public/js/agendamentos.js e server.js.
