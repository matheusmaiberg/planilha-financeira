/**
 * @fileoverview Pontos de entrada globais exigidos pelo Google Apps Script.
 * Delegam toda a lógica para o namespace Suevich.
 */

function onOpen() {
  var builder = Suevich.UI.MenuBuilder.create();
  builder
    .addItem('Sincronizar Wise Agora', 'runManualSync')
    .addItem('Puxar Todas as Atividades', 'runSyncAll')
    .addItem('Limpar e Reimportar Tudo', 'runForceReimport')
    .addSubMenu('Sincronização Histórica', function(sub) {
      sub.addItem('Últimos 30 dias', 'runSync30');
      sub.addItem('Últimos 60 dias', 'runSync60');
      sub.addItem('Últimos 90 dias', 'runSync90');
    })
    .addSeparator()
    .addItem('Ativar Automação Diária (04:00)', 'setupWiseTrigger')
    .addItem('Desativar Automações', 'clearAllTriggers')
    .build();
}

function runSync30() { _runHistorical(30); }
function runSync60() { _runHistorical(60); }
function runSync90() { _runHistorical(90); }

function _runHistorical(days) {
  var ui = SpreadsheetApp.getUi();
  try {
    var msg = Suevich.Main.SyncPipeline.run(days);
    ui.alert('Sincronização Histórica Concluída', msg, ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Erro', 'Falha na sincronização: ' + error.message, ui.ButtonSet.OK);
  }
}

function runManualSync() {
  var ui = SpreadsheetApp.getUi();
  try {
    var msg = Suevich.Main.SyncPipeline.run();
    ui.alert('Sincronização Concluída', msg, ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Erro', 'Falha na sincronização: ' + error.message, ui.ButtonSet.OK);
  }
}

function runSyncAll() {
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    'Puxar Todas as Atividades',
    'Isso pode demorar e importar MUITAS transações. Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  try {
    var msg = Suevich.Main.SyncPipeline.run('all');
    ui.alert('Sincronização Completa', msg, ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Erro', 'Falha na sincronização: ' + error.message, ui.ButtonSet.OK);
  }
}

function setupWiseTrigger() {
  var ui = SpreadsheetApp.getUi();
  Suevich.UI.TriggerManager.setupDailyTrigger('syncAllWiseAccounts', 4);
  ui.alert('Automação Ativada', 'A rotina rodará todos os dias por volta das 04:00 da manhã.', ui.ButtonSet.OK);
}

function clearAllTriggers() {
  Suevich.UI.TriggerManager.clearTriggers('syncAllWiseAccounts');
}

function syncAllWiseAccounts() {
  return Suevich.Main.SyncPipeline.run();
}

function runForceReimport() {
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert(
    'Limpar e Reimportar',
    'Isso vai APAGAR todos os dados da planilha e reimportar tudo do Wise. Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  try {
    var sheetService = Suevich.Factories.Registry.getService('sheet');
    sheetService.clearData();
    var msg = Suevich.Main.SyncPipeline.run('all');
    ui.alert('Reimportação Concluída', msg, ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Erro', 'Falha na reimportação: ' + error.message, ui.ButtonSet.OK);
  }
}
