const tbody = document.getElementById('tbody');
// Mantém em memória os clientes carregados para localizar rapidamente o registro em edição.
let clientes = [];
// null significa cadastro novo; um número indica que o formulário está editando um cliente.
let editandoId = null;

// Confere a sessão e configura o nome do usuário e o botão de saída.
iniciarPagina();
carregar();

// Consulta a API e atualiza a tabela com os clientes que correspondem à pesquisa.
async function carregar() {
    // Lê o filtro de pesquisa e remove espaços extras no começo e no fim.
    const termo = document.getElementById('busca').value.trim();
    clientes = await api('/api/clientes?busca=' + encodeURIComponent(termo));
    // Monta uma linha da tabela para cada cliente recebido da API.
    // esc() protege o HTML ao inserir campos de texto preenchidos pelo usuário.
    tbody.innerHTML = clientes.map(t => `
        <tr>
            <td>${esc(t.nome)}</td>
            <td>${esc(formatarCpf(t.cpf))}</td>
            <td>${esc(t.telefone)}</td>
            <td>${esc(t.email)}</td>
            <td><button class="secundario" data-id="${t.id}">Editar</button></td>
        </tr>`).join('') || '<tr><td colspan="5" class="vazio">Nenhum cliente encontrado.</td></tr>';
}

// busca: atualiza a listagem ao confirmar (botão ou Enter)
// Permite pesquisar clicando no botão ou pressionando Enter no campo de busca.
document.getElementById('btn-buscar').addEventListener('click', carregar);
document.getElementById('busca').addEventListener('keydown', e => { if (e.key === 'Enter') carregar(); });

function abrirFormulario(cliente) {
    // Define se o modal será usado para editar um registro ou cadastrar um novo.
    editandoId = cliente ? cliente.id : null;
    document.getElementById('modal-titulo').textContent = cliente ? 'Editar cliente' : 'Novo cliente';
    document.getElementById('nome').value = cliente ? cliente.nome : '';
    document.getElementById('cpf').value = cliente ? formatarCpf(cliente.cpf) : '';
    document.getElementById('telefone').value = cliente ? cliente.telefone : '';
    document.getElementById('email').value = cliente ? cliente.email : '';
    abrirModal('modal');
}

document.getElementById('btn-novo').addEventListener('click', () => abrirFormulario(null));
document.getElementById('btn-cancelar').addEventListener('click', () => fecharModal('modal'));
// Usa um único evento na tabela para reconhecer qual botão Editar foi clicado.
tbody.addEventListener('click', e => {
    const botao = e.target.closest('button[data-id]');
    if (botao) abrirFormulario(clientes.find(t => t.id === Number(botao.dataset.id)));
});

document.getElementById('form').addEventListener('submit', async e => {
    // Evita que o navegador recarregue a página ao enviar o formulário.
    e.preventDefault();
    // Reúne os valores dos campos em um objeto que será enviado como JSON à API.
    const corpo = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value
    };
    try {
        // Se já existe ID, atualiza com PUT; caso contrário, cria com POST.
        await api(editandoId ? '/api/clientes/' + editandoId : '/api/clientes',
                  { method: editandoId ? 'PUT' : 'POST', body: corpo });
        // Fecha o formulário apenas quando o servidor confirma que salvou os dados.
        fecharModal('modal');
        avisar(editandoId ? 'Cliente atualizado.' : 'Cliente cadastrado.');
        carregar();
    // Mostra erros de validação ou de comunicação sem interromper a página.
    } catch (err) {
        avisar(err.message, 'erro');
    }
});
