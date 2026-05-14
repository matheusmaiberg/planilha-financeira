/**
 * @fileoverview Resolve direção pelo tipo Wise conhecido.
 */

Suevich.Strategies.TypeDirectionStrategy = (function() {
  'use strict';

  var _config = Suevich.Core.Config;
  var _Direction = Suevich.Domain.TransactionDirection;
  var _Type = Suevich.Domain.TransactionType;

  var ENTRADA_TYPES = [
    _Type.DEPOSIT, _Type.BALANCE_CREDIT, _Type.BALANCE_DEPOSIT,
    _Type.REFUND, _Type.RECEIVED, _Type.MONEY_ADDED, _Type.CASHBACK, _Type.INTEREST
  ];
  var SAIDA_TYPES = [
    _Type.CARD_PAYMENT, _Type.TRANSFER, _Type.CONVERSION,
    _Type.SENT, _Type.DIRECT_DEBIT, _Type.WITHDRAWAL, _Type.FEE
  ];

  return {
    resolve: function(activity) {
      var type = (activity.type || '').toUpperCase().trim();

      if (Suevich.Utils.ArrayUtils.contains(ENTRADA_TYPES, type)) return _Direction.ENTRADA;
      if (Suevich.Utils.ArrayUtils.contains(SAIDA_TYPES, type)) return _Direction.SAIDA;
      return null;
    }
  };
})();
