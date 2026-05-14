/**
 * @fileoverview Configuração central imutável do sistema.
 */

Suevich.Core.Config = (function() {
  'use strict';

  var _config = {
    WISE_API_TOKEN: '0dd9a8f2-7873-4c41-b107-ff052164eef2',
    PROFILE_ID: '3903096',
    DAYS_TO_SYNC: 30,

    HEADERS: {
      DATA: 'Data',
      SERVICO: 'Servico',
      CATEGORIA: 'Categoria',
      MOEDA: 'Moeda',
      VALOR: 'Valor',
      TIPO: 'Tipo',
      ID_TRANSACAO: 'ID Transacao'
    },

    FORMATS: {
      CURRENCY: '#,##0.00',
      DATE: 'dd/MM/yyyy'
    },

    STYLES: {
      HEADER_BG: '#f3f3f3',
      HEADER_WEIGHT: 'bold'
    },

    CATEGORIES: {
      'Software/Infra': ['contabo', 'google', 'aws', 'elevenlabs', 'github', 'openai', 'cloudflare', 'digitalocean', 'heroku', 'pabbly'],
      'Marketing': ['facebook', 'meta', 'ads', 'google ads', 'linkedin', 'tiktok', 'zapier'],
      'Operacional/Freelancer': ['janaína', 'fernanda', 'pix', 'pagamento', 'transferência', 'sguarizi', 'vega'],
      'Alimentação/Logística': ['restaurante', 'ifood', 'uber', '99app', 'posto', 'shell'],
      'Geral': []
    },

    WISE_TYPES: {
      ENTRADA: ['DEPOSIT', 'BALANCE_CREDIT', 'BALANCE_DEPOSIT', 'REFUND', 'RECEIVED', 'MONEY_ADDED', 'CASHBACK', 'INTEREST'],
      SAIDA: ['CARD_PAYMENT', 'TRANSFER', 'CONVERSION', 'SENT', 'DIRECT_DEBIT', 'WITHDRAWAL', 'FEE']
    }
  };

  return {
    get: function(key) {
      return _config[key];
    },
    getAll: function() {
      return JSON.parse(JSON.stringify(_config));
    }
  };
})();
