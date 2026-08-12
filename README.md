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
   ├─ currency/
   │  └─ currency.spec.js
   ├─ openapi/
   │  └─ openapi.spec.js
   └─ register/
      └─ register.spec.js
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
- `tests/auth/auth.spec.js` - testa os endpoints de autenticação.
- `tests/register/register.spec.js` - testa o endpoint de cadastro de usuário.

## Observações

- O arquivo `.gitignore` já protege `node_modules/`, `playwright-report/` e `.env`.
- Use `npm test` sempre após instalar dependências ou atualizar a URL de teste.
- O workflow do GitHub Actions está em `.github/workflows/ci.yml`.

### Desenvolvido por Cintia