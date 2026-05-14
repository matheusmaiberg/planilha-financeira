/**
 * @fileoverview Registro central — ponto único de acesso a todas as factories.
 * Implementa o padrão Service Locator + Abstract Factory.
 */

Suevich.Factories.Registry = (function() {
  'use strict';

  var _serviceFactory = Suevich.Factories.ServiceFactory;
  var _formatterFactory = Suevich.Factories.FormatterFactory;
  var _transactionFactory = Suevich.Factories.TransactionFactory;

  return {
    getService: function(name) {
      switch (name) {
        case 'sheet': return _serviceFactory.createSheetService();
        case 'wiseApi': return _serviceFactory.createWiseApiService();
        case 'classifier': return _serviceFactory.createCategoryClassifier();
        default: throw new Error('Serviço desconhecido: ' + name);
      }
    },

    getFormatter: function(name) {
      switch (name) {
        case 'transaction': return _formatterFactory.createTransactionFormatter();
        case 'sheetRow': return _formatterFactory.createSheetRowFormatter();
        default: throw new Error('Formatter desconhecido: ' + name);
      }
    },

    createTransaction: function(rawData) {
      return _transactionFactory.create(rawData);
    },

    clearServices: function() {
      _serviceFactory.clearCache();
    }
  };
})();
