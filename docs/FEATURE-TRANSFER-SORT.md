# Feature: Transferência entre Contas Próprias + Ordenação da Planilha

## Contexto
O usuário possui **várias contas Wise**. Quando transfere dinheiro de uma conta sua para outra conta sua (ex: EUR → BRL dentro da Wise), essa movimentação aparece na API como:

- `type: INTERBALANCE` — movimentação entre saldos do mesmo titular
- `title: "To <strong>EUR</strong>"` ou `"To <strong>BRL</strong>"`  
- `description: "Moved by you"`

Atualmente essas transações caem como **Entrada** ou **Saída** genéricas. O usuário quer identificá-las como **Transferência** (entre contas próprias) e ordená-las separadamente na planilha.

---

## 1. Modelo de Direção (3 estados)

```
Entrada        → DEPOSIT, REFUND, RECEIVED, MONEY_ADDED, CASHBACK, etc.
                 (dinheiro que entrou de FORA da Wise)

Saída          → CARD_PAYMENT, CONVERSION, SENT, DIRECT_DEBIT, 
                 WITHDRAWAL, FEE, etc.
                 (dinheiro que saiu da Wise para fora)

Transferência  → INTERBALANCE, TRANSFER entre contas próprias
                 (dinheiro que moveu entre contas do MESMO titular)
```

### Regra de detecção
Uma atividade é **Transferência** quando:
- `type === 'INTERBALANCE'` **OU**
- `type === 'TRANSFER'` **E** (`title` ou `description` indica movimentação interna: "To ", "Moved by you", "From ")

> **Nota:** `TRANSFER` positivo de terceiros (ex: cliente pagando) continua como **Entrada**.  
> `TRANSFER` negativo para terceiros continua como **Saída**.

### Enum atualizado
```javascript
Suevich.Domain.TransactionDirection = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  TRANSFERENCIA: 'Transferência'
};
```

---

## 2. Botão "Puxar Todas as Atividades"

Novo item no menu: **"Puxar Todas as Atividades"**

Comportamento:
- Não aplica filtro `since`/`until` na API Wise
- Busca **todo o histórico disponível** (pagina até esgotar)
- Pergunta de confirmação antes de executar (pode ser muitas transações)

---

## 3. Ordenação da Planilha

Executada automaticamente após cada sincronização (manual ou automática).

### Critérios (ordem de prioridade)
1. **Data** — decrescente (mais recente primeiro)
2. **Direção** — crescente:
   - `Entrada` (0)
   - `Saída` (1)
   - `Transferência` (2)

### Implementação
Usa `Range.sort(sortSpecObj)` nativo do Google Apps Script.

---

## 4. Impacto nos Arquivos

| Arquivo | Mudança |
|---|---|
| `domain/TransactionDirection.js` | Adicionar `TRANSFERENCIA` |
| `strategies/TypeDirectionStrategy.js` | `INTERBALANCE` → `TRANSFERENCIA`; `TRANSFER` interno → `TRANSFERENCIA` |
| `strategies/SignalDirectionStrategy.js` | Reverte lógica de TRANSFER; volta a ser genérico |
| `ui/MenuBuilder.js` | Novo item no menu |
| `main/EntryPoints.js` | `runSyncAll()` + confirmação |
| `main/SyncPipeline.js` | Suportar `days = 'all'`; chamar `sortTransactions()` após append |
| `services/WiseApiService.js` | `getActivities()` suporta `days = 'all'` (sem since/until) |
| `services/SheetService.js` | `sortTransactions()` com sort nativo do Sheets |

---

## 5. Fases de Implementação

- [x] **Fase 1:** PRD + modelo + strategies atualizadas
- [ ] **Fase 2:** Botão + sync all + ordenação
- [ ] **Fase 3:** Testes unitários para Transferência (INTERBALANCE)
