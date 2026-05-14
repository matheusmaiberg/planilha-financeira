/**
 * @fileoverview Builder Pattern para construção de menus customizados.
 */

Suevich.UI.MenuBuilder = (function() {
  'use strict';

  function MenuBuilder() {
    this._ui = SpreadsheetApp.getUi();
    this._root = this._ui.createMenu('🚀 Suevich API');
  }

  MenuBuilder.prototype.addItem = function(label, handler) {
    this._root.addItem(label, handler);
    return this;
  };

  MenuBuilder.prototype.addSubMenu = function(label, builderFn) {
    var sub = this._ui.createMenu(label);
    builderFn(sub);
    this._root.addSubMenu(sub);
    return this;
  };

  MenuBuilder.prototype.addSeparator = function() {
    this._root.addSeparator();
    return this;
  };

  MenuBuilder.prototype.build = function() {
    this._root.addToUi();
  };

  return {
    create: function() {
      return new MenuBuilder();
    }
  };
})();
