# Schema do `.clasp.json`

Arquivo de configuração do [clasp](https://github.com/google/clasp) (Command Line Apps Script Projects).

## Schema local (IDE autocomplete)

O `.clasp.json` aponta para um schema JSON local:

```json
{
  "$schema": "./schemas/clasp-config.schema.json",
  "scriptId": "1VpB37AflQdpgH713OJiXEKtqfHmt3CuhDT-xf-qRS37NjHxcyZB7wvah",
  "rootDir": "src",
  "fileExtension": "js"
}
```

Isso habilita **autocomplete e validação** no VS Code / IntelliJ ao editar o `.clasp.json`.

## Campos principais

### `scriptId` (string, obrigatório)
ID do projeto do Google Apps Script. Encontrado na URL do editor:
```
https://script.google.com/home/projects/{scriptId}/edit
```

### `rootDir` (string, opcional)
Diretório raiz onde os arquivos `.js`/`.gs` estão localizados.  
**Padrão:** `.` (raiz do projeto)

### `fileExtension` (string, opcional)
Extensão usada nos arquivos locais. O clasp faz push como `.gs` no Apps Script.
- `"js"` — arquivos locais são `.js`, upados como `.gs`
- `"ts"` — arquivos locais são `.ts`, compilados para `.gs`

### `filePushOrder` (string[], opcional)
Ordem explícita de push dos arquivos. Útil quando há dependências de load-order entre scripts.

## Campos avançados

| Campo | Tipo | Descrição |
|---|---|---|
| `projectId` | string | ID do projeto GCP vinculado (para APIs avançadas) |
| `scriptExtensions` | string[] | Extensões adicionais de script reconhecidas |
| `htmlExtensions` | string[] | Extensões de HTML reconhecidas (`.html`, `.htm`) |
| `fileDenyList` | string[] | Padrões glob de arquivos ignorados no push |
| `skipSubdirectories` | boolean | Se `true`, não faz push de subdiretórios |

## Exemplo completo

```json
{
  "scriptId": "1x...",
  "rootDir": "src",
  "fileExtension": "js",
  "filePushOrder": [
    "src/core/*.js",
    "src/utils/*.js",
    "src/**/*.js"
  ],
  "fileDenyList": [
    "**/*.test.js",
    "**/*.spec.js"
  ]
}
```

## Comandos úteis

```bash
clasp push              # Envia arquivos locais para o Apps Script
clasp push --watch      # Watch mode (salva e sobe automaticamente)
clasp pull              # Baixa do Apps Script para local
clasp open              # Abre o editor no navegador
clasp logs              # Exibe logs do Stackdriver
clasp deployments       # Lista deployments
clasp version "desc"    # Cria nova versão
```
