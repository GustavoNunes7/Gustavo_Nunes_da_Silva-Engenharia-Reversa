// Criptografia reversível do CPF (AES-256-GCM).
// O CPF é gravado no banco já criptografado; só a aplicação consegue ler.
// Módulo nativo do Node.js usado para gerar números aleatórios e cifrar/decifrar dados.
const crypto = require('crypto');

// Deriva uma chave de 32 bytes para AES-256-GCM. Em produção, a chave e o salt devem ficar fora do código.

// Cifra o CPF antes de armazená-lo: IV aleatório evita repetir o mesmo resultado para o mesmo CPF.
function criptografar(texto) {
    const iv = crypto.randomBytes(12);
    const cifra = crypto.createCipheriv('aes-256-gcm', CHAVE, iv);
    const dados = Buffer.concat([cifra.update(texto, 'utf8'), cifra.final()]);
    const tag = cifra.getAuthTag();
    return [iv, tag, dados].map(b => b.toString('base64')).join(':');
}

// Recupera o texto original usando o IV, a etiqueta de autenticação e os dados cifrados salvos juntos.
function descriptografar(valor) {
    const [iv, tag, dados] = valor.split(':').map(p => Buffer.from(p, 'base64'));
    const decifra = crypto.createDecipheriv('aes-256-gcm', CHAVE, iv);
    decifra.setAuthTag(tag);
    return Buffer.concat([decifra.update(dados), decifra.final()]).toString('utf8');
}

// Exporta as duas funções para o servidor e o gerador do banco poderem reutilizá-las.
module.exports = { criptografar, descriptografar };
