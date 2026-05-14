/**
 * @fileoverview Factory para criação de Value Objects Transaction.
 */

Suevich.Factories.TransactionFactory = (function() {
  'use strict';

  return {
    create: function(rawActivity) {
      var dateStr = rawActivity.createdOn || rawActivity.updatedOn || new Date().toISOString();
      var service = Suevich.Utils.TextUtils.clean(rawActivity.title || 'Transação Wise');
      var currency = Suevich.Utils.CurrencyUtils.extractCode(rawActivity.primaryAmount || '');
      var amount = Suevich.Utils.CurrencyUtils.parseValue(rawActivity.primaryAmount || '');
      var formattedDate = Suevich.Utils.DateUtils.formatDateBR(dateStr);
      var direction = Suevich.Strategies.DirectionContext.resolve(rawActivity) || Suevich.Domain.TransactionDirection.SAIDA;
      var category = Suevich.Services.CategoryClassifier.classify(service);

      var safeId = rawActivity.id;
      if (!safeId || safeId === '') {
        safeId = 'MANUAL_' + formattedDate.replace(/\//g, '') + '_' + amount + '_' + currency + '_' + direction;
      }

      return new Suevich.Domain.Transaction({
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
