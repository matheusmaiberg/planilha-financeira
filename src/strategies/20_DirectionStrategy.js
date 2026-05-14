/**
 * @fileoverview Interface base para estratégias de detecção de direção.
 */

Suevich.Strategies.DirectionStrategy = (function() {
  'use strict';

  return {
    /**
     * Tenta resolver a direção de uma atividade.
     * @param {Object} activity
     * @returns {string|null} 'Entrada', 'Saída' ou null se não conseguir
     */
    resolve: function(activity) {
      throw new Error('DirectionStrategy.resolve() deve ser implementado');
    }
  };
})();
