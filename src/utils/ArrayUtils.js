/**
 * @fileoverview Utilitários para manipulação de arrays.
 */

var Suevich = Suevich || {};
Suevich.Utils = Suevich.Utils || {};

Suevich.Utils.ArrayUtils = (function() {
  'use strict';

  return {
    /**
     * Remove duplicatas de um array de strings.
     * @param {string[]} arr
     * @returns {string[]}
     */
    unique: function(arr) {
      var seen = {};
      return arr.filter(function(item) {
        var key = String(item).trim();
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
    },

    /**
     * Verifica se um valor existe no array.
     * @param {Array} arr
     * @param {*} value
     * @returns {boolean}
     */
    contains: function(arr, value) {
      return arr.indexOf(value) !== -1;
    }
  };
})();
