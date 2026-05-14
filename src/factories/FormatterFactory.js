/**
 * @fileoverview Factory para criação de formatters especializados.
 */

var Suevich = Suevich || {};
Suevich.Factories = Suevich.Factories || {};

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
