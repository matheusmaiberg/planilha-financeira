/**
 * @fileoverview Serviço de leitura/escrita na planilha Google Sheets.
 */

Suevich.Services.SheetService = (function() {
  'use strict';

  function _getOrUpdateColumnMap(sheet) {
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var map = {};
    var needsUpdate = false;
    var expected = Suevich.Core.Config.get('HEADERS');

    for (var key in expected) {
      var expectedName = expected[key];
      var index = headers.map(function(h) {
        return String(h).trim().toLowerCase();
      }).indexOf(expectedName.toLowerCase());

      if (index === -1) {
        var newColIndex = headers.length + 1;
        sheet.getRange(1, newColIndex)
          .setValue(expectedName)
          .setFontWeight(Suevich.Core.Config.get('STYLES').HEADER_WEIGHT)
          .setBackground(Suevich.Core.Config.get('STYLES').HEADER_BG);
        headers.push(expectedName);
        map[key] = newColIndex;
        needsUpdate = true;
      } else {
        map[key] = index + 1;
      }
    }
    if (needsUpdate) sheet.autoResizeColumns(1, sheet.getLastColumn());
    return map;
  }

  function _getExistingIds(sheet, colIndex) {
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];
    var values = sheet.getRange(2, colIndex, lastRow - 1, 1).getDisplayValues();
    return values.map(function(row) { return String(row[0]).trim(); });
  }

  return {
    /**
     * Anexa transações à planilha ativa, filtrando duplicatas.
     * @param {Suevich.Domain.Transaction[]} transactions
     * @returns {number} Quantidade adicionada
     */
    appendTransactions: function(transactions) {
      if (!transactions || transactions.length === 0) return 0;

      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var colMap = _getOrUpdateColumnMap(sheet);
      var existingIds = _getExistingIds(sheet, colMap.ID_TRANSACAO);

      var newData = [];
      var loteIds = {};

      transactions.forEach(function(tx) {
        var id = String(tx.getId()).trim();
        if (existingIds.indexOf(id) === -1 && !loteIds[id]) {
          loteIds[id] = true;
          newData.push(tx);
        }
      });

      if (newData.length === 0) return 0;

      var rowFormatter = Suevich.Factories.Registry.getFormatter('sheetRow');
      var outputRows = rowFormatter.toMatrix(newData);

      var maxCol = 0;
      for (var k in colMap) { if (colMap[k] > maxCol) maxCol = colMap[k]; }

      outputRows = outputRows.map(function(row) {
        var line = new Array(maxCol);
        line[colMap.DATA - 1] = row[0];
        line[colMap.SERVICO - 1] = row[1];
        line[colMap.CATEGORIA - 1] = row[2];
        line[colMap.MOEDA - 1] = row[3];
        line[colMap.VALOR - 1] = row[4];
        line[colMap.TIPO - 1] = row[5];
        line[colMap.ID_TRANSACAO - 1] = row[6];

        for (var i = 0; i < maxCol; i++) {
          if (line[i] === undefined || line[i] === null) line[i] = '';
        }
        return line;
      });

      var startRow = sheet.getLastRow() + 1;
      sheet.getRange(startRow, 1, outputRows.length, maxCol).setValues(outputRows);
      sheet.getRange(startRow, colMap.VALOR, outputRows.length, 1)
        .setNumberFormat(Suevich.Core.Config.get('FORMATS').CURRENCY);

      Suevich.Core.Logger.info('SheetService: ' + newData.length + ' transações adicionadas.');
      return newData.length;
    }
  };
})();
