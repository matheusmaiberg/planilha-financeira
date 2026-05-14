/**
 * @fileoverview Enum de direção da transação.
 */

var Suevich = Suevich || {};
Suevich.Domain = Suevich.Domain || {};

Suevich.Domain.TransactionDirection = (function() {
  'use strict';

  return {
    ENTRADA: 'Entrada',
    SAIDA: 'Saída'
  };
})();
