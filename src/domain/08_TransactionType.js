/**
 * @fileoverview Enum de tipos de transação retornados pela API Wise.
 */

Suevich.Domain.TransactionType = (function() {
  'use strict';

  return {
    DEPOSIT: 'DEPOSIT',
    BALANCE_CREDIT: 'BALANCE_CREDIT',
    BALANCE_DEPOSIT: 'BALANCE_DEPOSIT',
    REFUND: 'REFUND',
    RECEIVED: 'RECEIVED',
    MONEY_ADDED: 'MONEY_ADDED',
    CASHBACK: 'CASHBACK',
    INTEREST: 'INTEREST',
    CARD_PAYMENT: 'CARD_PAYMENT',
    TRANSFER: 'TRANSFER',
    CONVERSION: 'CONVERSION',
    SENT: 'SENT',
    DIRECT_DEBIT: 'DIRECT_DEBIT',
    WITHDRAWAL: 'WITHDRAWAL',
    FEE: 'FEE'
  };
})();
