/**
 * @fileoverview Resolve direção por keywords no título da transação.
 */

var Suevich = Suevich || {};
Suevich.Strategies = Suevich.Strategies || {};

Suevich.Strategies.TitleDirectionStrategy = (function() {
  'use strict';

  var ENTRADA_KEYWORDS = ['received', 'recebido', 'deposit', 'cashback', 'refund', 'devolução', 'crédito', 'credit', 'money added', 'adicionado'];
  var SAIDA_KEYWORDS = ['sent', 'enviado', 'payment', 'pagamento', 'debit', 'débito', 'withdrawal', 'saque', 'transfer sent'];

  return {
    resolve: function(activity) {
      var title = (activity.title || '').toLowerCase();

      if (Suevich.Utils.TextUtils.containsAny(title, ENTRADA_KEYWORDS)) return Suevich.Domain.TransactionDirection.ENTRADA;
      if (Suevich.Utils.TextUtils.containsAny(title, SAIDA_KEYWORDS)) return Suevich.Domain.TransactionDirection.SAIDA;
      return null;
    }
  };
})();
