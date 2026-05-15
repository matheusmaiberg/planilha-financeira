# PRD — Suite de Testes Suevich

## Objetivo
Garantir confiabilidade do código de sincronização Wise → Google Sheets com uma suite de testes que evolui do básico ao E2E.

---

## Phase 1: Unitários Puros (BÁSICA — IMPLEMENTADA AGORA)
**Escopo:** Funções puras sem dependência de APIs externas.
**Arquivo:** `tests/phase1-unit.test.js`

- Utils: `ArrayUtils`, `CurrencyUtils`, `DateUtils`, `TextUtils`
- Domain: `TransactionDirection`, `Transaction` VO
- Strategies isoladas: `TypeDirectionStrategy`, `TitleDirectionStrategy`, `SignalDirectionStrategy`
- **Sem mocks de GAS.** Entrada e saída são valores primitivos/objetos.

---

## Phase 2: Integração API Wise (ESSENCIAL)
**Escopo:** Validar contrato real da Wise API.
**Arquivo:** `tests/phase2-wise-api.test.js`

- Fetch real para `/v1/profiles/{id}/activities`
- Verificar schema da resposta (campos obrigatórios: `id`, `type`, `title`, `primaryAmount`, `createdOn`)
- Validar que `since`/`until`/`size` são aceitos pela API
- Salvar snapshot em `tests/data/` para uso offline
- **Não testa lógica de negócio, só o contrato HTTP.**

---

## Phase 3: Pipeline End-to-End (INTERMEDIÁRIA)
**Escopo:** Rodar `SyncPipeline.run()` com mocks leves de GAS.
**Arquivo:** `tests/phase3-pipeline.test.js`

- Mockar `UrlFetchApp`, `SpreadsheetApp`, `Utilities`, `Session`
- Usar dados reais de `tests/data/real-activities.json`
- Verificar: filtro de data, classificação de direção, classificação de categoria, escrita na planilha
- Testar 30d, 60d, 90d e modo trigger (sem parâmetro)

---

## Phase 4: Edge Cases e Regressão (AVANÇADA)
**Escopo:** Proteger contra bugs silenciosos e cenários raros.
**Arquivo:** `tests/phase4-edge.test.js`

- Paginação: API retorna múltiplas páginas (mock de `cursor`)
- Duplicatas: mesma transação em duas sincronizações consecutivas
- Rate limit: HTTP 429 e retry
- Timezone: transação no limite da meia-noite
- Array vazio em `setStrategies([])`
- Token inválido: HTTP 401
- Campo `primaryAmount` com HTML (`<positive>+ 40 BRL</positive>`)

---

## Phase 5: E2E com Google Sheets (COMPLETA — FUTURO)
**Escopo:** Testar contra ambiente real ou mock pesado.
**Arquivo:** `tests/phase5-e2e.test.js`

- Rodar em conta de teste do Google Apps Script (clasp run)
- Ou mock completo de `SpreadsheetApp` com validação de formatação, cores, fórmulas
- Validar que `onOpen()` cria o menu corretamente
- Validar que triggers são criados/removidos via `ScriptApp`

---

## Estrutura de Pastas
```
tests/
  phase1-unit.test.js
  phase2-wise-api.test.js
  phase3-pipeline.test.js
  phase4-edge.test.js
  phase5-e2e.test.js
  data/
    .gitignore  ← ignorar conteúdo, manter pasta
    real-activities.json
```

## Como Rodar
```bash
# Tudo
node --test tests/*.test.js

# Ap Phase 1
node --test tests/phase1-unit.test.js
```
