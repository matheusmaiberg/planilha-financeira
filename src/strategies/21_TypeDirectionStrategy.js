/**
 * @fileoverview Resolve direção pelo tipo Wise conhecido.
 */

Suevich.Strategies.TypeDirectionStrategy = (function() {
  'use strict';

  var _config = Suevich.Core.Config;
  var _base = Suevich.Strategies.DirectionStrategy;
  var _Direction = Suevich.Domain.TransactionDirection;

  return {
    resolve: function(activity) {
      var type = (activity.type || '').toUpperCase().trim();
      var entrada = _config.get('WISE_TYPES').ENTRADA;
      var saida = _config.get('WISE_TYPES').SAIDA;

      if (Suevich.Utils.ArrayUtils.contains(entrada, type)) return _Direction.ENTRADA;
      if (Suevich.Utils.ArrayUtils.contains(saida, type)) return _Direction.SAIDA;
      return null;
    }
  };
})();
