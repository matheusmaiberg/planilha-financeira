/**
 * @fileoverview Gerenciamento CRUD de triggers do Apps Script.
 */

Suevich.UI.TriggerManager = (function() {
  'use strict';

  return {
    setupDailyTrigger: function(handlerFunction, hour) {
      this.clearTriggers(handlerFunction);

      ScriptApp.newTrigger(handlerFunction)
        .timeBased()
        .everyDays(1)
        .atHour(hour || 4)
        .create();

      Suevich.Core.Logger.info('TriggerManager: trigger diário configurado para ' + (hour || 4) + 'h');
    },

    clearTriggers: function(handlerFunction) {
      var triggers = ScriptApp.getProjectTriggers();
      triggers.forEach(function(trigger) {
        if (trigger.getHandlerFunction() === handlerFunction) {
          ScriptApp.deleteTrigger(trigger);
        }
      });
      Suevich.Core.Logger.info('TriggerManager: triggers de "' + handlerFunction + '" removidos');
    },

    listTriggers: function() {
      return ScriptApp.getProjectTriggers().map(function(t) {
        return t.getHandlerFunction();
      });
    }
  };
})();
