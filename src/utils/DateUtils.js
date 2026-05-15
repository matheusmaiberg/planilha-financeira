/**
 * @fileoverview Utilitários de data e timezone.
 */

var Suevich = Suevich || {};
Suevich.Utils = Suevich.Utils || {};

Suevich.Utils.DateUtils = (function() {
  'use strict';

  return {
    /**
     * Converte ISO string para formato brasileiro.
     * @param {string} isoDateString
     * @returns {string}
     */
    formatDateBR: function(isoDateString) {
      if (!isoDateString) return '';
      var dateObj = new Date(isoDateString);
      return Utilities.formatDate(dateObj, Session.getScriptTimeZone(), Suevich.Core.Config.get('FORMATS').DATE);
    },

    /**
     * Retorna a data de corte para sincronização.
     * @param {number} days
     * @returns {Date}
     */
    getCutoffDate: function(days) {
      var d = new Date();
      d.setUTCDate(d.getUTCDate() - days);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    }
  };
})();
