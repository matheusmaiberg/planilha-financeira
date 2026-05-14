/**
 * @fileoverview Value Object imutável representando uma transação financeira.
 */

var Suevich = Suevich || {};
Suevich.Domain = Suevich.Domain || {};

Suevich.Domain.Transaction = (function() {
  'use strict';

  /**
   * @param {Object} props
   * @constructor
   */
  function Transaction(props) {
    this._id = props.id;
    this._date = props.date;
    this._service = props.service;
    this._category = props.category;
    this._currency = props.currency;
    this._amount = props.amount;
    this._direction = props.direction; // 'Entrada' | 'Saída'
    this._rawType = props.rawType;
  }

  Transaction.prototype.getId = function() { return this._id; };
  Transaction.prototype.getDate = function() { return this._date; };
  Transaction.prototype.getService = function() { return this._service; };
  Transaction.prototype.getCategory = function() { return this._category; };
  Transaction.prototype.getCurrency = function() { return this._currency; };
  Transaction.prototype.getAmount = function() { return this._amount; };
  Transaction.prototype.getDirection = function() { return this._direction; };
  Transaction.prototype.getRawType = function() { return this._rawType; };

  /**
   * Converte para array de linha da planilha.
   * @returns {Array}
   */
  Transaction.prototype.toSheetRow = function() {
    return [
      this._date,
      this._service,
      this._category,
      this._currency,
      this._amount,
      this._direction,
      this._id
    ];
  };

  return Transaction;
})();
