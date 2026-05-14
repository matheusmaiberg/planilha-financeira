/**
 * @fileoverview Factory para criação de formatters especializados.
 */

Suevich.Factories.FormatterFactory = (function() {
  'use strict';

  return {
    createTransactionFormatter: function() {
      return Suevich.Formatters.TransactionFormatter;
    },
    createSheetRowFormatter: function() {
      return Suevich.Formatters.SheetRowFormatter;
    }
  };
})();
