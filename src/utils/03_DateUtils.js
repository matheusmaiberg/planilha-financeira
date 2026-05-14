/**
 * @fileoverview Utilitários de data e timezone.
 */

Suevich.Utils.DateUtils = (function() {
  'use strict';

  var _config = Suevich.Core.Config;

  return {
    /**
     * Converte ISO string para formato brasileiro.
     * @param {string} isoDateString
     * @returns {string}
     */
    formatDateBR: function(isoDateString) {
      if (!isoDateString) return '';
      var dateObj = new Date(isoDateString);
      return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), _config.get('FORMATS').DATE);
    },

    /**
     * Retorna a data de corte para sincronização.
     * @param {number} days
     * @returns {Date}
     */
    getCutoffDate: function(days) {
      var d = new Date();
      d.setDate(d.getDate() - days);
      return d;
    }
  };
})();
