// Criptografia reversível do CPF (AES-256-GCM).
// O CPF é gravado no banco já criptografado; só a aplicação consegue ler.
// Módulo nativo do Node.js usado para gerar números aleatórios e cifrar/decifrar dados.
const crypto = require('crypto');

// Deriva uma chave de 32 bytes para o algoritmo AES-256-GCM. Em produção, use um segredo vindo de variável de ambiente.
const CHAVE = crypto.scryptSync('oficina-autocerta-chave-secreta', 'sal-da-oficina', 32);

// Cifra o CPF antes de armazená-lo: IV aleatório evita repetir o mesmo resultado para o mesmo CPF.
function criptografar(texto) {
    // O IV é aleatório e único para cada operação de criptografia.
    const iv = crypto.randomBytes(12);
    // Cria o objeto que transforma o texto original em dados cifrados.
    const cifra = crypto.createCipheriv('aes-256-gcm', CHAVE, iv);
    // Processa o texto e reúne todos os bytes cifrados em um único Buffer.
    const dados = Buffer.concat([cifra.update(texto, 'utf8'), cifra.final()]);
    // A tag permite verificar se os dados foram alterados antes de decifrar.
    const tag = cifra.getAuthTag();
    // Salva IV, tag e conteúdo em Base64, separados por dois-pontos.
    return [iv, tag, dados].map(b => b.toString('base64')).join(':');
}

// Recupera o texto original usando o IV, a etiqueta de autenticação e os dados cifrados salvos juntos.
function descriptografar(valor) {
    // Separa e decodifica as três partes guardadas durante a criptografia.
    const [iv, tag, dados] = valor.split(':').map(p => Buffer.from(p, 'base64'));
    // Prepara a operação inversa usando a mesma chave e o IV original.
    const decifra = crypto.createDecipheriv('aes-256-gcm', CHAVE, iv);
    // Configura a tag de autenticação para detectar alterações nos dados.
    decifra.setAuthTag(tag);
    return Buffer.concat([decifra.update(dados), decifra.final()]).toString('utf8');
}

// Exporta as duas funções para o servidor e o gerador do banco poderem reutilizá-las.
module.exports = { criptografar, descriptografar };
