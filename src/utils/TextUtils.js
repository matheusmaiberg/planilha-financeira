/**
 * @fileoverview Utilitários de processamento de texto.
 */

var Suevich = Suevich || {};
Suevich.Utils = Suevich.Utils || {};

Suevich.Utils.TextUtils = (function() {
  'use strict';

  return {
    /**
     * Remove tags HTML e espaços desnecessários.
     * @param {string} text
     * @returns {string}
     */
    clean: function(text) {
      if (!text) return '';
      return String(text).replace(/<\/?[^>]+(>|$)/g, '').trim();
    },

    /**
     * Verifica se o texto contém alguma keyword (case-insensitive).
     * @param {string} text
     * @param {string[]} keywords
     * @returns {boolean}
     */
    containsAny: function(text, keywords) {
      var t = String(text).toLowerCase();
      return keywords.some(function(k) {
        return t.includes(k.toLowerCase());
      });
    }
  };
})();
