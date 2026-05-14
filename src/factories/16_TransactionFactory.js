/**
 * @fileoverview Factory para criação de Value Objects Transaction.
 */

Suevich.Factories.TransactionFactory = (function() {
  'use strict';

  var _Transaction = Suevich.Domain.Transaction;
  var _dateUtils = Suevich.Utils.DateUtils;
  var _currencyUtils = Suevich.Utils.CurrencyUtils;
  var _textUtils = Suevich.Utils.TextUtils;
  var _classifier = Suevich.Services.CategoryClassifier;

  return {
    create: function(rawActivity) {
      var dateStr = rawActivity.createdOn || rawActivity.updatedOn || new Date().toISOString();
      var service = _textUtils.clean(rawActivity.title || 'Transação Wise');
      var currency = _currencyUtils.extractCode(rawActivity.primaryAmount || '');
      var amount = _currencyUtils.parseValue(rawActivity.primaryAmount || '');
      var formattedDate = _dateUtils.formatDateBR(dateStr);
      var direction = Suevich.Strategies.DirectionContext.resolve(rawActivity) || Suevich.Domain.TransactionDirection.SAIDA;
      var category = _classifier.classify(service);

      var safeId = rawActivity.id;
      if (!safeId || safeId === '') {
        safeId = 'MANUAL_' + formattedDate.replace(/\//g, '') + '_' + amount + '_' + currency + '_' + direction;
      }

      return new _Transaction({
        id: safeId,
        date: formattedDate,
        service: service,
        category: category,
        currency: currency,
        amount: amount,
        direction: direction,
        rawType: rawActivity.type || ''
      });
    }
  };
})();
