/**
 * @fileoverview Formata atividades brutas da Wise em Transaction VOs.
 */

Suevich.Formatters.TransactionFormatter = (function() {
  'use strict';

  var _dateUtils = Suevich.Utils.DateUtils;
  var _currencyUtils = Suevich.Utils.CurrencyUtils;
  var _textUtils = Suevich.Utils.TextUtils;
  var _classifier = Suevich.Services.CategoryClassifier;
  var _Transaction = Suevich.Domain.Transaction;
  var _Direction = Suevich.Domain.TransactionDirection;
  var _config = Suevich.Core.Config;

  return {
    /**
     * Formata um array de atividades brutas em Transaction VOs.
     * @param {Array} activities
     * @param {number} days
     * @returns {Suevich.Domain.Transaction[]}
     */
    formatMany: function(activities, days) {
      if (!activities || activities.length === 0) return [];

      var cutoff = _dateUtils.getCutoffDate(days);

      return activities
        .filter(function(a) {
          var dateStr = a.createdOn || a.updatedOn || new Date().toISOString();
          return new Date(dateStr) >= cutoff;
        })
        .map(function(a) {
          var dateStr = a.createdOn || a.updatedOn || new Date().toISOString();
          var service = _textUtils.clean(a.title || 'Transação Wise');
          var currency = _currencyUtils.extractCode(a.primaryAmount || '');
          var amount = _currencyUtils.parseValue(a.primaryAmount || '');
          var formattedDate = _dateUtils.formatDateBR(dateStr);
          var direction = this._resolveDirection(a);
          var category = _classifier.classify(service);

          var safeId = a.id;
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
            rawType: a.type || ''
          });
        }, this);
    },

    /**
     * Resolve direção usando o registry de strategies.
     * @param {Object} activity
     * @returns {string}
     */
    _resolveDirection: function(activity) {
      var result = Suevich.Strategies.DirectionContext.resolve(activity);
      if (result) return result;
      return _Direction.SAIDA;
    }
  };
})();
