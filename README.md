# travel-planner-api-test

Projeto de automação de testes de API para o Viaja Travel Planner usando Playwright.

## Estrutura do projeto

```
travel-planner-api-test/
├─ .env.example
├─ .gitignore
├─ package.json
├─ playwright.config.js
├─ README.md
├─ swagger.json
└─ tests/
   ├─ auth/
   │  └─ auth.spec.js
   |  └─ flows.spec.js
   ├─ currency/
   │  └─ currency.spec.js
   |  └─ validation.spec.js
   ├─ helpers
   |  └─ api.js
   ├─ openapi/
   │  └─ openapi.spec.js
   ├─ planner
   |  └─ planner.spec.js
   └─ register/
      └─ register.spec.js
      └─ validation.spec.js
```

## Pré-requisitos

- Node.js 18 ou superior
- npm
- API em execução local ou URL pública para testes

## Instalação

1. Copie o arquivo de exemplo para criar o `.env`:
   ```bash
   cp .env.example .env
   ```

2. Abra `.env` e ajuste a URL da API se necessário.

3. Instale as dependências:
   ```bash
   npm install
   ```

## Execução dos testes

- Executar todos os testes:
  ```bash
  npm test
  ```

- Executar testes com outra URL de API:
  ```bash
  API_BASE_URL=https://sua-api.com npm test
  ```

- Abrir o relatório HTML gerado pelo Playwright:
  ```bash
  npm run test:report
  ```

## Configuração do ambiente

O arquivo `.env` deve conter:

```bash
API_BASE_URL=http://localhost:3000
```

Se `API_BASE_URL` não estiver definido, os testes usam `http://localhost:3000` por padrão.

## Organização dos testes

- `tests/openapi/openapi.spec.js` - valida a especificação OpenAPI da API.
- `tests/currency/currency.spec.js` - testa a conversão de moedas.
- `tests/currency/validation.spec.js` - valida conversões entre moedas iguais, valores padrão, limites e parâmetros inválidos.
- `tests/auth/auth.spec.js` - testa os endpoints de autenticação.
- `tests/auth/flows.spec.js` - testa provedores, CSRF, sessões, login, logout e validações de recuperação e redefinição de senha.
- `tests/register/register.spec.js` - testa o endpoint de cadastro de usuário.
- `tests/register/validation.spec.js` - valida campos obrigatórios, tipos, limites, criação de conta e e-mail duplicado.
- `tests/helpers/api.js` - centraliza requisições auxiliares, validações de respostas e preparação de contas e sessões de teste.
- `tests/planner/planner.spec.js` - testa autenticação, persistência do planejamento, regras de atividades e carregamento e cache de capas.
- `tests/profile/profile.spec.js` - testa exclusão de conta e rejeição de sessões antigas.

Cada teste cria uma conta exclusiva e a remove pelo `DELETE /api/profile` no
`afterEach`, mesmo após falhas. A limpeza autentica novamente a conta para cobrir
os fluxos de logout e valida o retorno 204 sem corpo. A API deve disponibilizar
esse endpoint; falhas de limpeza são reportadas como falhas do teste.

## Observações

- O arquivo `.gitignore` já protege `node_modules/`, `playwright-report/` e `.env`.
- Use `npm test` sempre após instalar dependências ou atualizar a URL de teste.
- O workflow de CI está em `.github/workflows/ci.yml`.
- O workflow de publicação do relatório está em `.github/workflows/deploy-report.yml`.

## Relatório no GitHub Pages

O workflow `deploy-report.yml` gera o relatório Playwright e publica pelo GitHub Pages, mesmo quando os testes falham.
Após o deploy, o relatório poderá ser acessado em uma URL semelhante a:

```text
https://cintiaomaas.github.io/travel-planner-api-test/
```

## Como usar o deploy do relatório

- O deploy é acionado automaticamente em push para `main` ou `master`.
- Também pode ser executado manualmente pela aba **Actions** > **Publicar relatório Playwright** > **Run workflow**.
- O relatório será publicado mesmo que haja falha nos testes, permitindo visualização dos detalhes do erro.

### Desenvolvido por Cintia
