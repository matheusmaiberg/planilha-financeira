/**
 * @fileoverview Contexto que orquestra a chain of responsibility de strategies.
 */

var Suevich = Suevich || {};
Suevich.Strategies = Suevich.Strategies || {};

Suevich.Strategies.DirectionContext = (function() {
  'use strict';

  var _strategies = [
    Suevich.Strategies.TypeDirectionStrategy,
    Suevich.Strategies.TitleDirectionStrategy,
    Suevich.Strategies.SignalDirectionStrategy
  ];

  return {
    /**
     * Itera pelas strategies até encontrar uma que resolva.
     * @param {Object} activity
     * @returns {string|null}
     */
    resolve: function(activity) {
      for (var i = 0; i < _strategies.length; i++) {
        var result = _strategies[i].resolve(activity);
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
      _strategies = customStrategies;
    }
  };
})();
