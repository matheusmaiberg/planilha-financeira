/**
 * @fileoverview Resolve direção pelo tipo Wise conhecido.
 */

var Suevich = Suevich || {};
Suevich.Strategies = Suevich.Strategies || {};

Suevich.Strategies.TypeDirectionStrategy = (function() {
  'use strict';

  var ENTRADA_TYPES = [
    'DEPOSIT', 'BALANCE_CREDIT', 'BALANCE_DEPOSIT',
    'REFUND', 'RECEIVED', 'MONEY_ADDED', 'CASHBACK', 'INTEREST'
  ];
  var SAIDA_TYPES = [
    'CARD_PAYMENT', 'CONVERSION',
    'SENT', 'DIRECT_DEBIT', 'WITHDRAWAL', 'FEE'
  ];

  function _isInternalTransfer(activity) {
    var title = Suevich.Utils.TextUtils.clean(activity.title || '').toLowerCase();
    var desc = (activity.description || '').toLowerCase();
    return title.indexOf('to ') !== -1 ||
           title.indexOf('from ') !== -1 ||
           desc.indexOf('moved by you') !== -1;
  }

  return {
    resolve: function(activity) {
      var type = (activity.type || '').toUpperCase().trim();

      if (type === 'INTERBALANCE') return Suevich.Domain.TransactionDirection.TRANSFERENCIA;
      if (_isInternalTransfer(activity)) return Suevich.Domain.TransactionDirection.TRANSFERENCIA;
      if (Suevich.Utils.ArrayUtils.contains(ENTRADA_TYPES, type)) return Suevich.Domain.TransactionDirection.ENTRADA;
      if (Suevich.Utils.ArrayUtils.contains(SAIDA_TYPES, type)) return Suevich.Domain.TransactionDirection.SAIDA;
      return null;
    }
  };
})();
