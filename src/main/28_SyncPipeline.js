/**
 * @fileoverview Orquestração do fluxo de sincronização via Factory Registry.
 */

Suevich.Main.SyncPipeline = (function() {
  'use strict';

  var _registry = Suevich.Factories.Registry;
  var _config = Suevich.Core.Config;
  var _logger = Suevich.Core.Logger;

  return {
    /**
     * Executa a sincronização completa.
     * @param {number} [days]
     * @returns {string} Mensagem de resultado
     */
    run: function(days) {
      var syncDays = days || _config.get('DAYS_TO_SYNC');
      _logger.info('SyncPipeline: iniciando sincronização para ' + syncDays + ' dias');

      var apiLimit = syncDays <= 30 ? 100 : (syncDays <= 60 ? 250 : 500);

      var wiseApi = _registry.getService('wiseApi');
      var rawData = wiseApi.getActivities(apiLimit);
      _logger.info('SyncPipeline: ' + rawData.length + ' atividades brutas recebidas');

      var txFormatter = _registry.getFormatter('transaction');
      var transactions = txFormatter.formatMany(rawData, syncDays);
      _logger.info('SyncPipeline: ' + transactions.length + ' transações válidas no período');

      var sheetService = _registry.getService('sheet');
      var added = sheetService.appendTransactions(transactions);

      var msg = added > 0
        ? 'Sucesso! ' + added + ' novas transações importadas.'
        : 'Nenhuma transação nova encontrada no período.';

      _logger.info('SyncPipeline: ' + msg);
      return msg;
    }
  };
})();
