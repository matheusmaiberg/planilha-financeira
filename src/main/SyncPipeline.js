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
      var isAll = days === 'all';
      var syncDays = isAll ? Suevich.Core.Config.get('DAYS_TO_SYNC') : (days || Suevich.Core.Config.get('DAYS_TO_SYNC'));
      Suevich.Core.Logger.info('SyncPipeline: iniciando sincronização' + (isAll ? ' COMPLETA' : ' para ' + syncDays + ' dias'));

      var wiseApi = Suevich.Factories.Registry.getService('wiseApi');
      var rawData = isAll ? wiseApi.getActivitiesAll() : wiseApi.getActivities(syncDays);
      Suevich.Core.Logger.info('SyncPipeline: ' + rawData.length + ' atividades brutas recebidas');

      var txFormatter = Suevich.Factories.Registry.getFormatter('transaction');
      var transactions = isAll ? rawData.map(function(a) { return Suevich.Factories.Registry.createTransaction(a); }) : txFormatter.formatMany(rawData, syncDays);
      Suevich.Core.Logger.info('SyncPipeline: ' + rawData.length + ' brutas → ' + transactions.length + ' válidas após filtro de data');
      if (transactions.length === 0) {
        return 'Nenhuma transação encontrada no período. A planilha já pode estar atualizada.';
      }

      var sheetService = Suevich.Factories.Registry.getService('sheet');
      var added = sheetService.appendTransactions(transactions);

      if (added > 0) {
        sheetService.sortTransactions();
      }

      var msg = added > 0
        ? 'Sucesso! ' + added + ' novas transações importadas.'
        : 'Nenhuma transação nova encontrada no período.';

      Suevich.Core.Logger.info('SyncPipeline: ' + msg);
      return msg;
    }
  };
})();
