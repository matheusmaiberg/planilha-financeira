/**
 * @fileoverview Registro central — ponto único de acesso a todas as factories.
 * Implementa o padrão Service Locator + Abstract Factory.
 */

Suevich.Factories.Registry = (function() {
  'use strict';

  return {
    getService: function(name) {
      switch (name) {
        case 'sheet': return Suevich.Factories.ServiceFactory.createSheetService();
        case 'wiseApi': return Suevich.Factories.ServiceFactory.createWiseApiService();
        case 'classifier': return Suevich.Factories.ServiceFactory.createCategoryClassifier();
        default: throw new Error('Serviço desconhecido: ' + name);
      }
    },

    getFormatter: function(name) {
      switch (name) {
        case 'transaction': return Suevich.Factories.FormatterFactory.createTransactionFormatter();
        case 'sheetRow': return Suevich.Factories.FormatterFactory.createSheetRowFormatter();
        default: throw new Error('Formatter desconhecido: ' + name);
      }
    },

    createTransaction: function(rawData) {
      return Suevich.Factories.TransactionFactory.create(rawData);
    },

    clearServices: function() {
      Suevich.Factories.ServiceFactory.clearCache();
    }
  };
})();
