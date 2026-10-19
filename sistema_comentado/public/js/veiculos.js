const tbody = document.getElementById('tbody');

// Verifica a sessão do usuário e prepara o botão Sair.
iniciarPagina();
carregar();

// Busca os veículos cadastrados e atualiza a tabela da página.
async function carregar() {
    const veiculos = await api('/api/veiculos');
    // Constrói as linhas da tabela; cliente_nome vem do relacionamento retornado pela API.
    tbody.innerHTML = veiculos.map(v => `
        <tr>
            <td>${esc(v.placa)}</td>
            <td>${esc(v.modelo)}</td>
            <td>${esc(v.tipo)}</td>
            <td>${esc(v.marca)}</td>
            <td>${esc(v.cliente_nome)}</td>
        </tr>`).join('') || '<tr><td colspan="5" class="vazio">Nenhum veículo cadastrado.</td></tr>';
}

// Abre o cadastro e carrega os clientes disponíveis para associar o proprietário.
document.getElementById('btn-novo').addEventListener('click', async () => {
    // o veículo precisa ser associado a um cliente: carrega a lista de clientes no select
    const clientes = await api('/api/clientes');
    document.getElementById('cliente').innerHTML =
        '<option value="">Selecione...</option>' +
        clientes.map(c => `<option value="${c.id}">${esc(c.nome)}</option>`).join('');
    // Limpa os campos para evitar reaproveitar valores de um cadastro anterior.
    document.getElementById('form').reset();
    abrirModal('modal');
});
document.getElementById('btn-cancelar').addEventListener('click', () => fecharModal('modal'));

// Trata o envio do formulário de cadastro de veículo.
document.getElementById('form').addEventListener('submit', async e => {
    e.preventDefault();
    try {
        // Envia os campos para a rota que valida e grava o veículo no banco.
        await api('/api/veiculos', {
            method: 'POST',
            body: {
                placa: document.getElementById('placa').value,
                modelo: document.getElementById('modelo').value,
                tipo: document.getElementById('tipo').value,
                marca: document.getElementById('marca').value,
                cliente_id: Number(document.getElementById('cliente').value)
            }
        });
        // Após salvar, fecha o modal, avisa o usuário e atualiza a tabela.
        fecharModal('modal');
        avisar('Veículo cadastrado.');
        carregar();
    // Se a API rejeitar os dados ou ocorrer uma falha, apresenta a mensagem de erro.
    } catch (err) {
        avisar(err.message, 'erro');
    }
});
