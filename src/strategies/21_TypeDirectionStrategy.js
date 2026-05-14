/**
 * @fileoverview Resolve direção pelo tipo Wise conhecido.
 */

Suevich.Strategies.TypeDirectionStrategy = (function() {
  'use strict';

  var ENTRADA_TYPES = [
    'DEPOSIT', 'BALANCE_CREDIT', 'BALANCE_DEPOSIT',
    'REFUND', 'RECEIVED', 'MONEY_ADDED', 'CASHBACK', 'INTEREST'
  ];
  var SAIDA_TYPES = [
    'CARD_PAYMENT', 'TRANSFER', 'CONVERSION',
    'SENT', 'DIRECT_DEBIT', 'WITHDRAWAL', 'FEE'
  ];

  return {
    resolve: function(activity) {
      var type = (activity.type || '').toUpperCase().trim();

      if (Suevich.Utils.ArrayUtils.contains(ENTRADA_TYPES, type)) return Suevich.Domain.TransactionDirection.ENTRADA;
      if (Suevich.Utils.ArrayUtils.contains(SAIDA_TYPES, type)) return Suevich.Domain.TransactionDirection.SAIDA;
      return null;
    }
  };
})();
