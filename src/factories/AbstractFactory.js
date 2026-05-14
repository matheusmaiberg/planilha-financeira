/**
 * @fileoverview Interface base do Factory Pattern.
 */

var Suevich = Suevich || {};
Suevich.Factories = Suevich.Factories || {};

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
