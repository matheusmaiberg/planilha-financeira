/**
 * @fileoverview Registro de handlers de menu (nome → função global).
 */

Suevich.UI.MenuRegistry = (function() {
  'use strict';

  var _handlers = {};

  return {
    register: function(name, handlerFn) {
      _handlers[name] = handlerFn;
      // Expõe globalmente para o Apps Script chamar
      this[name] = handlerFn;
    },

    get: function(name) {
      return _handlers[name];
    },

    getAll: function() {
      return Object.keys(_handlers);
    }
  };
})();
