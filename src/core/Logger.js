/**
 * @fileoverview Wrapper do Logger nativo com níveis semânticos.
 */

var Suevich = Suevich || {};
Suevich.Core = Suevich.Core || {};

Suevich.Core.Logger = (function() {
  'use strict';

  var LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
  var _currentLevel = LEVELS.INFO;

  function _log(level, prefix, message) {
    if (level < _currentLevel) return;
    Logger.log('[' + prefix + '] ' + message);
  }

  return {
    debug: function(msg) { _log(LEVELS.DEBUG, 'DEBUG', msg); },
    info:  function(msg) { _log(LEVELS.INFO,  'INFO',  msg); },
    warn:  function(msg) { _log(LEVELS.WARN,  'WARN',  msg); },
    error: function(msg) { _log(LEVELS.ERROR, 'ERROR', msg); },
    setLevel: function(level) { _currentLevel = LEVELS[level] || LEVELS.INFO; }
  };
})();
