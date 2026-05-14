/**
 * @fileoverview Resolve direção pelo sinal do valor bruto.
 */

var Suevich = Suevich || {};
Suevich.Strategies = Suevich.Strategies || {};

Suevich.Strategies.SignalDirectionStrategy = (function() {
  'use strict';

  return {
    resolve: function(activity) {
      var rawAmount = activity.primaryAmount || activity.sourceAmount || '';
      if (Suevich.Utils.CurrencyUtils.isNegative(rawAmount)) return Suevich.Domain.TransactionDirection.SAIDA;
      if (rawAmount && parseFloat(rawAmount.replace(/[^\d.,-]/g, '').replace(',', '.')) > 0) {
        return Suevich.Domain.TransactionDirection.ENTRADA;
      }
      return null;
    }
  };
})();
