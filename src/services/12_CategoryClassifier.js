/**
 * @fileoverview Serviço puro de classificação de categorias por keyword.
 */

Suevich.Services.CategoryClassifier = (function() {
  'use strict';

  var _config = Suevich.Core.Config;
  var _textUtils = Suevich.Utils.TextUtils;

  return {
    /**
     * Classifica um nome de serviço em uma categoria.
     * @param {string} serviceName
     * @returns {string}
     */
    classify: function(serviceName) {
      var categories = _config.get('CATEGORIES');
      for (var cat in categories) {
        if (cat === 'Geral') continue;
        var keywords = categories[cat];
        if (_textUtils.containsAny(serviceName, keywords)) {
          return cat;
        }
      }
      return 'Geral';
    }
  };
})();
