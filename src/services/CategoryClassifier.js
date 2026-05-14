/**
 * @fileoverview Serviço puro de classificação de categorias por keyword.
 */

var Suevich = Suevich || {};
Suevich.Services = Suevich.Services || {};

Suevich.Services.CategoryClassifier = (function() {
  'use strict';

  return {
    /**
     * Classifica um nome de serviço em uma categoria.
     * @param {string} serviceName
     * @returns {string}
     */
    classify: function(serviceName) {
      var categories = Suevich.Core.Config.get('CATEGORIES');
      for (var cat in categories) {
        if (cat === 'Geral') continue;
        var keywords = categories[cat];
        if (Suevich.Utils.TextUtils.containsAny(serviceName, keywords)) {
          return cat;
        }
      }
      return 'Geral';
    }
  };
})();
