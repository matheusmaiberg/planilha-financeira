/**
 * @fileoverview Formata atividades brutas da Wise em Transaction VOs.
 */

var Suevich = Suevich || {};
Suevich.Formatters = Suevich.Formatters || {};

Suevich.Formatters.TransactionFormatter = (function() {
  'use strict';

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

      return activities
        .filter(function(a) {
          var dateStr = a.createdAt || a.createdOn || a.updatedOn || new Date().toISOString();
          return new Date(dateStr) >= cutoff;
        })
        .map(function(a) {
          return Suevich.Factories.Registry.createTransaction(a);
        });
    }
  };
})();
