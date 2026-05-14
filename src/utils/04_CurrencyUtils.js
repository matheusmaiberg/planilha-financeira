/**
 * @fileoverview Utilitários de moeda e valores numéricos.
 */

Suevich.Utils.CurrencyUtils = (function() {
  'use strict';

  return {
    /**
     * Extrai valor numérico absoluto de string de moeda.
     * @param {string} rawAmount ex: "R$ 200,00" ou "-100.50 BRL"
     * @returns {number}
     */
    parseValue: function(rawAmount) {
      if (!rawAmount) return 0;
      var numericPart = String(rawAmount).replace(/[^\d.,-]/g, '');
      return Math.abs(parseFloat(numericPart.replace(',', '.'))) || 0;
    },

    /**
     * Extrai código de moeda (3 letras maiúsculas).
     * @param {string} rawAmount
     * @returns {string}
     */
    extractCode: function(rawAmount) {
      var match = String(rawAmount).match(/[A-Z]{3}/);
      return match ? match[0] : 'BRL';
    },

    /**
     * Verifica se o valor bruto contém sinal negativo.
     * @param {string} rawAmount
     * @returns {boolean}
     */
    isNegative: function(rawAmount) {
      var s = String(rawAmount);
      return s.indexOf('-') !== -1 || s.indexOf('−') !== -1;
    }
  };
})();
