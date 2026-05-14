/**
 * @fileoverview Factory memoizada para serviços (singleton por sessão).
 */

var Suevich = Suevich || {};
Suevich.Factories = Suevich.Factories || {};

Suevich.Factories.ServiceFactory = (function() {
  'use strict';

  var _cache = {};

  function _getOrCreate(key, constructor) {
    if (!_cache[key]) {
      _cache[key] = constructor();
    }
    return _cache[key];
  }

  return {
    createSheetService: function() {
      return _getOrCreate('sheet', function() { return Suevich.Services.SheetService; });
    },
    createWiseApiService: function() {
      return _getOrCreate('wiseApi', function() { return Suevich.Services.WiseApiService; });
    },
    createCategoryClassifier: function() {
      return _getOrCreate('classifier', function() { return Suevich.Services.CategoryClassifier; });
    },
    clearCache: function() {
      _cache = {};
    }
  };
})();
