/**
 * @fileoverview Resolve direção pelo sinal do valor bruto.
 */

Suevich.Strategies.SignalDirectionStrategy = (function() {
  'use strict';

  var _Direction = Suevich.Domain.TransactionDirection;
  var _currencyUtils = Suevich.Utils.CurrencyUtils;

  return {
    resolve: function(activity) {
      var rawAmount = activity.primaryAmount || activity.sourceAmount || '';
      if (_currencyUtils.isNegative(rawAmount)) return _Direction.SAIDA;
      if (rawAmount && parseFloat(rawAmount.replace(/[^\d.,-]/g, '').replace(',', '.')) > 0) {
        return _Direction.ENTRADA;
      }
      return null;
    }
  };
})();
