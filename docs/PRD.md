# PRD: Suevich Finance — Sincronizador Wise → Google Sheets

## 1. Visão Geral
Sistema serverless (Google Apps Script) que extrai transações da API Wise e as persiste em uma planilha Google Sheets, com classificação automática de categorias e detecção de direção (entrada/saída).

## 2. Requisitos Funcionais

| ID | Descrição | Prioridade |
|---|---|---|
| RF01 | Sincronizar transações Wise dos últimos N dias | P0 |
| RF02 | Detectar direção de cada transação (Entrada/Saída) | P0 |
| RF03 | Classificar transações em categorias pré-definidas | P0 |
| RF04 | Evitar duplicatas via ID único da transação | P0 |
| RF05 | Suportar sincronização histórica (30/60/90 dias) | P1 |
| RF06 | Executar automaticamente diariamente às 04:00 | P1 |
| RF07 | Menu customizado na planilha | P1 |
| RF08 | Aceitar **todas** as transações (entradas e saídas) | P0 |
| RF09 | Criar cabeçalhos automaticamente se ausentes | P1 |
| RF10 | Formatar moeda e data no padrão brasileiro | P1 |

## 3. Requisitos Não-Funcionais

| ID | Descrição |
|---|---|
| RNF01 | Arquitetura modular com namespaces hierárquicos |
| RNF02 | Factory Pattern para criação de objetos |
| RNF03 | Strategy Pattern para detecção de direção |
| RNF04 | Commits semânticos no Git |
| RNF05 | Código organizado em subpastas por responsabilidade |
| RNF06 | Documentação via PRD e comentários JSDoc |

## 4. Arquitetura

```
Suevich
├── Core        (Config, Logger, Namespace)
├── Utils       (Date, Currency, Text, Array)
├── Domain      (Transaction VO, Enums)
├── Services    (SheetService, WiseApiService, CategoryClassifier)
├── Formatters  (TransactionFormatter, SheetRowFormatter)
├── Factories   (Abstract, Transaction, Service, Formatter, Registry)
├── Strategies  (Direction detection chain)
├── UI          (MenuBuilder, MenuRegistry, TriggerManager)
└── Main        (SyncPipeline, EntryPoints)
```

### 4.1 Factory Pattern
- `AbstractFactory`: interface base com método `create()`
- `TransactionFactory`: cria Value Objects `Transaction`
- `ServiceFactory`: cria e memoiza serviços (singleton)
- `FormatterFactory`: cria formatters especializados
- `FactoryRegistry`: ponto único de acesso a todas as factories

### 4.2 Strategy Pattern
- `DirectionStrategy`: interface base
- `TypeDirectionStrategy`: resolve por tipo Wise
- `TitleDirectionStrategy`: resolve por keywords no título
- `SignalDirectionStrategy`: resolve por sinal do valor
- `DirectionContext`: orquestra a chain of responsibility

## 5. Estrutura de Pastas

```
src/
├── core/
├── utils/
├── domain/
├── services/
├── formatters/
├── factories/
├── strategies/
├── ui/
└── main/
```

## 6. Glossário

| Termo | Significado |
|---|---|
| VO | Value Object — objeto imutável sem identidade |
| DI | Dependency Injection — injeção de dependências |
| Chain of Responsibility | Padrão onde múltiplos handlers tentam resolver um problema |
| Memoization | Cache de resultados para evitar recriação |
