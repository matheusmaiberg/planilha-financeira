/**
 * @fileoverview Orquestração do fluxo de sincronização via Factory Registry.
 */

var Suevich = Suevich || {};
Suevich.Main = Suevich.Main || {};

Suevich.Main.SyncPipeline = (function() {
  'use strict';

  return {
    /**
     * Executa a sincronização completa.
     * @param {number} [days]
     * @returns {string} Mensagem de resultado
     */
    run: function(days) {
      var syncDays = days || Suevich.Core.Config.get('DAYS_TO_SYNC');
      Suevich.Core.Logger.info('SyncPipeline: iniciando sincronização para ' + syncDays + ' dias');

      var apiLimit = syncDays <= 30 ? 100 : (syncDays <= 60 ? 250 : 500);

      var wiseApi = Suevich.Factories.Registry.getService('wiseApi');
      var rawData = wiseApi.getActivities(apiLimit);
      Suevich.Core.Logger.info('SyncPipeline: ' + rawData.length + ' atividades brutas recebidas');

      var txFormatter = Suevich.Factories.Registry.getFormatter('transaction');
      var transactions = txFormatter.formatMany(rawData, syncDays);
      Suevich.Core.Logger.info('SyncPipeline: ' + transactions.length + ' transações válidas no período');

      var sheetService = Suevich.Factories.Registry.getService('sheet');
      var added = sheetService.appendTransactions(transactions);

      var msg = added > 0
        ? 'Sucesso! ' + added + ' novas transações importadas.'
        : 'Nenhuma transação nova encontrada no período.';

      Suevich.Core.Logger.info('SyncPipeline: ' + msg);
      return msg;
    }
  };
})();
