# Análise de Segurança — Oficina AutoCerta

## 1. Objetivo

Esta análise identifica os mecanismos de segurança presentes no sistema Oficina AutoCerta, avalia suas finalidades e apresenta três melhorias recomendadas.

## 2. Mecanismos de segurança identificados

| Mecanismo | Implementação | Análise |
|---|---|---|
| Gerenciamento de sessão | `express-session` | Mantém a sessão do usuário autenticado e permite proteger rotas. O segredo está definido diretamente no código, e o armazenamento padrão em memória não é adequado para produção. |
| Hash de senhas | `bcryptjs` | Compara a senha informada com o hash armazenado, evitando a necessidade de guardar senhas em texto puro. |
| Criptografia do CPF | AES-256-GCM | Protege a confidencialidade do CPF armazenado. A derivação da chave utiliza valores definidos no código, o que representa um risco caso o código seja exposto. |
| Proteção de rotas | Verificação da sessão | Impede que usuários sem sessão válida acessem as rotas protegidas. |
| Consultas SQL | Consultas parametrizadas | Reduz o risco de injeção de SQL. |
| Cookie de sessão | Configuração `httpOnly` e expiração | Dificulta o acesso ao cookie por JavaScript e limita a duração da sessão. Recomenda-se avaliar também `secure` e `sameSite`. |

## 3. Melhorias recomendadas

### Melhoria 1 — Proteger segredos e chaves

**Problema:** o segredo da sessão e os valores utilizados para derivar a chave de criptografia estão definidos no código-fonte.

**Solução:** utilizar variáveis de ambiente ou um gerenciador de segredos para manter essas informações fora do código. As chaves devem possuir gerenciamento adequado, controle de acesso e procedimento de substituição.

**Benefício:** reduz o risco de exposição dos dados caso o repositório seja acessado por pessoas não autorizadas.

### Melhoria 2 — Reforçar a segurança das sessões

**Problema:** a configuração atual das sessões pode ser aprimorada para um ambiente de produção.

**Solução:** configurar cookies com `httpOnly`, `secure` em conexões HTTPS e `sameSite`; utilizar armazenamento de sessões apropriado para produção; e implementar proteção contra CSRF quando aplicável.

**Benefício:** ajuda a reduzir riscos relacionados ao roubo ou uso indevido de sessões e a requisições não autorizadas.

### Melhoria 3 — Fortalecer validações e controle de acesso

**Problema:** a validação do CPF verifica a quantidade de dígitos, mas não confirma os dígitos verificadores. Também não foi identificado um limite explícito de tentativas de login.

**Solução:** implementar validação completa do CPF, limitar tentativas de autenticação, registrar eventos relevantes e restringir a exposição de dados pessoais ao mínimo necessário.

**Benefício:** dificulta tentativas automatizadas de acesso e reduz erros no cadastro e a exposição indevida de informações pessoais.

## 4. Conclusão

O sistema Oficina AutoCerta apresenta mecanismos importantes de segurança, incluindo sessões, hash de senhas com bcrypt, criptografia do CPF com AES-256-GCM e consultas parametrizadas ao banco de dados.

Apesar disso, foram identificadas oportunidades de melhoria na proteção dos segredos, no gerenciamento das sessões e na validação dos dados. A implementação das três melhorias propostas pode fortalecer a proteção das informações e aproximar o sistema das práticas recomendadas para aplicações em produção.

## 5. Limitações da análise

Esta análise considera os mecanismos identificados no código-fonte disponível. Ela não representa uma auditoria completa nem comprova a ausência de vulnerabilidades. As conclusões devem ser confirmadas por revisão do código e testes de segurança.
