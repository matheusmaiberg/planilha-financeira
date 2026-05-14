/**
 * @fileoverview Interface base do Factory Pattern.
 */

Suevich.Factories.AbstractFactory = (function() {
  'use strict';

  return {
    /**
     * Cria uma instância.
     * @returns {*}
     */
    create: function() {
      throw new Error('AbstractFactory.create() deve ser sobrescrito');
    }
  };
})();
