// Guarda o elemento onde as mensagens de erro de login serão exibidas.
const erro = document.getElementById('erro');

function mostrarErro(msg) {
    // Usa textContent para mostrar a mensagem como texto, sem interpretar HTML.
    erro.textContent = msg;
    erro.style.display = 'block';
}

// veio redirecionado porque a sessão expirou
// Verifica se o servidor redirecionou o usuário porque a sessão expirou.
if (new URLSearchParams(location.search).get('expirou')) {
    mostrarErro('Sua sessão expirou. Faça login novamente.');
}

// Envia o login sem recarregar a página e redireciona ao painel se a autenticação for aceita.
document.getElementById('form-login').addEventListener('submit', async (e) => {
    // Impede o envio tradicional do formulário, que recarregaria a página.
    e.preventDefault();
    erro.style.display = 'none';
    try {
        // Envia usuário e senha à rota de autenticação usando POST.
        await api('/api/login', {
            method: 'POST',
            body: {
                login: document.getElementById('login').value,
                senha: document.getElementById('senha').value
            }
        });
        // Se a API não retornar erro, abre o painel principal.
        window.location.href = '/principal.html';
    } catch (err) {
        mostrarErro(err.message);   // falha de autenticação: informa e fica no login
    }
});
