const tbody = document.getElementById('tbody');
// Armazena os registros recebidos da API para preencher a tabela e localizar edições.
let agendamentos = [];
// Guarda o ID do agendamento cuja data está sendo alterada.
let editandoId = null;

iniciarPagina();
carregar();

// Atualiza a listagem e separa visualmente os agendamentos por mês.
async function carregar() {
    // a API já devolve ordenado por mês; aqui só mostramos um cabeçalho a cada mês novo
    agendamentos = await api('/api/agendamentos');
    // Controla o último mês exibido para inserir apenas um cabeçalho por mês.
    let mesAtual = '';
    let html = '';
    // Percorre os agendamentos já ordenados pelo servidor e cria suas linhas HTML.
    for (const a of agendamentos) {
        const mes = nomeMes(a.data_agendamento);
        if (mes !== mesAtual) {
            mesAtual = mes;
            html += `<tr class="linha-mes"><td colspan="11">${esc(mes)}</td></tr>`;
        }
        html += `
        <tr>
            <td>${esc(formatarData(a.data_agendamento))}</td>
            <td>${esc(a.servico)}</td>
            <td>${esc(a.placa)}</td>
            <td>${esc(a.veiculo_modelo)}</td>
            <td>${esc(a.tipo)}</td>
            <td>${esc(a.marca)}</td>
            <td>${esc(a.cliente_nome)}</td>
            <td>${esc(formatarCpf(a.cliente_cpf))}</td>
            <td>${esc(a.telefone)}</td>
            <td>${esc(a.email)}</td>
            <td><button class="secundario" data-id="${a.id}">Alterar data</button></td>
        </tr>`;
    }
    tbody.innerHTML = html || '<tr><td colspan="11" class="vazio">Nenhum agendamento.</td></tr>';
}

// ---- alterar data ----
// Detecta o clique em Alterar data usando delegação de eventos na tabela.
tbody.addEventListener('click', e => {
    const botao = e.target.closest('button[data-id]');
    if (!botao) return;
    // Converte o ID guardado no botão para número e encontra a data atual do registro.
    editandoId = Number(botao.dataset.id);
    document.getElementById('data-edit').value =
        agendamentos.find(a => a.id === editandoId).data_agendamento;
    abrirModal('modal-data');
});
document.getElementById('cancelar-data').addEventListener('click', () => fecharModal('modal-data'));

// Envia ao servidor somente a nova data do agendamento selecionado.
document.getElementById('form-data').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        // PUT indica a atualização de um agendamento já existente.
        await api('/api/agendamentos/' + editandoId, {
            method: 'PUT',
            body: { data_agendamento: document.getElementById('data-edit').value }
        });
        fecharModal('modal-data');
        avisar('Data atualizada.');
        carregar();
    } catch (err) {
        avisar(err.message, 'erro');
    }
});

// ---- novo agendamento ----
// Antes de abrir o modal, consulta os veículos para montar a lista de seleção.
document.getElementById('btn-novo').addEventListener('click', async () => {
    const veiculos = await api('/api/veiculos');
    document.getElementById('veiculo').innerHTML =
        '<option value="">Selecione...</option>' +
        veiculos.map(v => `<option value="${v.id}">${esc(v.placa)} - ${esc(v.modelo)} (${esc(v.cliente_nome)})</option>`).join('');
    // Limpa os campos para iniciar um agendamento sem dados antigos.
    document.getElementById('form-novo').reset();
    abrirModal('modal-novo');
});
document.getElementById('cancelar-novo').addEventListener('click', () => fecharModal('modal-novo'));

// Trata o envio dos dados do novo agendamento.
document.getElementById('form-novo').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        // Envia veículo, data e descrição do serviço para a API validar e salvar.
        await api('/api/agendamentos', {
            method: 'POST',
            body: {
                veiculo_id: Number(document.getElementById('veiculo').value),
                data_agendamento: document.getElementById('data-novo').value,
                servico: document.getElementById('servico').value
            }
        });
        // Fecha a janela e atualiza a lista depois que o cadastro é confirmado.
        fecharModal('modal-novo');
        avisar('Agendamento cadastrado.');
        carregar();
    } catch (err) {
        avisar(err.message, 'erro');
    }
});
