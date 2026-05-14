/**
 * @fileoverview Contexto que orquestra a chain of responsibility de strategies.
 */

var Suevich = Suevich || {};
Suevich.Strategies = Suevich.Strategies || {};

Suevich.Strategies.DirectionContext = (function() {
  'use strict';

  var _customStrategies = null;

  function _getStrategies() {
    if (_customStrategies !== null) return _customStrategies;
    return [
      Suevich.Strategies.TypeDirectionStrategy,
      Suevich.Strategies.TitleDirectionStrategy,
      Suevich.Strategies.SignalDirectionStrategy
    ];
  }

  return {
    /**
     * Itera pelas strategies até encontrar uma que resolva.
     * @param {Object} activity
     * @returns {string|null}
     */
    resolve: function(activity) {
      var strategies = _getStrategies();
      for (var i = 0; i < strategies.length; i++) {
        var result = strategies[i].resolve(activity);
        if (result) return result;
      }
      return null;
    },

    /**
     * Permite injetar strategies customizadas (para testes).
     * @param {Array} customStrategies
     */
    setStrategies: function(customStrategies) {
      if (!Array.isArray(customStrategies)) {
        throw new Error('DirectionContext.setStrategies espera um array');
      }
      customStrategies.forEach(function(s, i) {
        if (!s || typeof s.resolve !== 'function') {
          throw new Error('Strategy no índice ' + i + ' não implementa resolve()');
        }
      });
      _customStrategies = customStrategies;
    }
  };
})();
