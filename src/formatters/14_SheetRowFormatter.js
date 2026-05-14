/**
 * @fileoverview Formata Transaction VOs em arrays para escrita na planilha.
 */

Suevich.Formatters.SheetRowFormatter = (function() {
  'use strict';

  return {
    /**
     * Converte array de Transactions em matriz de linhas.
     * @param {Suevich.Domain.Transaction[]} transactions
     * @returns {Array[]}
     */
    toMatrix: function(transactions) {
      return transactions.map(function(tx) {
        return tx.toSheetRow();
      });
    }
  };
})();
