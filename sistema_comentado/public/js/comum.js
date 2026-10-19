// Chamada à API. Se a sessão expirou (401), volta para o login.
// Centraliza as requisições ao servidor e padroniza o tratamento de erros e sessão expirada.
async function api(url, opcoes = {}) {
    // Envia a requisição HTTP e aguarda a resposta do servidor.
    const resp = await fetch(url, {
        // Usa GET por padrão, mas permite POST/PUT quando a tela precisa gravar dados.
        method: opcoes.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Converte os dados em JSON; em consultas sem corpo, não envia conteúdo.
    });
    // Se uma rota privada responder 401, a sessão não está válida e o usuário volta ao login.
    if (resp.status === 401 && !url.includes('/api/login')) {
        window.location.href = '/login.html?expirou=1';
        return new Promise(() => {});   // página está sendo redirecionada; não continua
    }
    // Tenta interpretar a resposta como JSON; se não houver JSON, usa um objeto vazio.
    const dados = await resp.json().catch(() => ({}));
    // Transforma respostas HTTP de erro em exceções para as telas mostrarem uma mensagem.
    if (!resp.ok) throw new Error(dados.erro || 'Erro inesperado.');
    return dados;
}

// Evita quebrar o HTML (e XSS) ao exibir textos vindos do banco
function esc(texto) {
    // Trata valores nulos como texto vazio e converte tudo para string antes de escapar caracteres.
    return String(texto ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatarCpf(cpf) {
    // Remove pontos e traços para conferir se restaram exatamente 11 dígitos.
    const d = String(cpf).replace(/\D/g, '');
    return d.length === 11 ? `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}` : cpf;
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Converte a data ISO (AAAA-MM-DD) para o formato brasileiro (DD/MM/AAAA).
function formatarData(iso) {            // 2026-10-25 -> 25/10/2026
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
}
// Obtém o nome do mês e o ano para agrupar os agendamentos na tabela.
function nomeMes(iso) {                 // 2026-10-25 -> Outubro/2026
    const [a, m] = iso.split('-');
    return `${MESES[Number(m) - 1]}/${a}`;
}

function avisar(mensagem, tipo = 'ok') {
    // Atualiza o elemento de aviso existente na página.
    const el = document.getElementById('aviso');
    el.textContent = mensagem;
    el.className = 'aviso ' + tipo;
    el.style.display = 'block';
    // Esconde a mensagem após 3,5 segundos para não deixar avisos antigos na tela.
    setTimeout(() => (el.style.display = 'none'), 3500);
}

// Exibe a janela modal identificada pelo ID recebido.
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
// Oculta a janela modal identificada pelo ID recebido.
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

// Páginas internas: mostra o usuário logado e liga o botão Sair
async function iniciarPagina() {
    // Consulta o servidor para confirmar a sessão e obter o nome do usuário conectado.
    const usuario = await api('/api/me');
    document.getElementById('nome-usuario').textContent = usuario.nome;
    // Ao clicar em Sair, pede ao servidor para destruir a sessão antes de redirecionar.
    document.getElementById('btn-sair').addEventListener('click', async () => {
        await api('/api/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });
}
