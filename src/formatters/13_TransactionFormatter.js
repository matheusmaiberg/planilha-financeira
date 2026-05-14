/**
 * @fileoverview Formata atividades brutas da Wise em Transaction VOs.
 */

Suevich.Formatters.TransactionFormatter = (function() {
  'use strict';

  var _registry = Suevich.Factories.Registry;

  return {
    /**
     * Formata um array de atividades brutas em Transaction VOs.
     * Delega a criação do VO para TransactionFactory.
     * @param {Array} activities
     * @param {number} days
     * @returns {Suevich.Domain.Transaction[]}
     */
    formatMany: function(activities, days) {
      if (!activities || activities.length === 0) return [];

      var cutoff = Suevich.Utils.DateUtils.getCutoffDate(days);
      var txFactory = _registry.createTransaction;

      return activities
        .filter(function(a) {
          var dateStr = a.createdOn || a.updatedOn || new Date().toISOString();
          return new Date(dateStr) >= cutoff;
        })
        .map(function(a) {
          return txFactory(a);
        });
    }
  };
})();
