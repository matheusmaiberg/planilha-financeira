/**
 * @fileoverview Cliente HTTP para a API Wise (v1).
 */

var Suevich = Suevich || {};
Suevich.Services = Suevich.Services || {};

Suevich.Services.WiseApiService = (function() {
  'use strict';

  return {
    /**
     * Busca atividades paginadas do perfil configurado.
     * @param {number} customLimit
     * @returns {Array} Atividades brutas da API
     */
    getActivities: function(customLimit) {
      var allActivities = [];
      var seenIds = {};
      var cursor = null;
      var targetLimit = customLimit || 100;
      var maxPages = 100;
      var pageCount = 0;

      Suevich.Core.Logger.info('WiseApiService: iniciando busca paginada');

      do {
        var url = 'https://api.transferwise.com/v1/profiles/' + Suevich.Core.Config.get('PROFILE_ID') + '/activities?limit=100';
        if (cursor) {
          url += '&cursor=' + encodeURIComponent(cursor);
        }

        var options = {
          method: 'get',
          headers: {
            'Authorization': 'Bearer ' + Suevich.Core.Config.get('WISE_API_TOKEN'),
            'Content-Type': 'application/json'
          },
          muteHttpExceptions: true
        };

        var response = UrlFetchApp.fetch(url, options);
        if (response.getResponseCode() !== 200) {
          Suevich.Core.Logger.error('WiseApiService: ' + response.getContentText());
          break;
        }

        var data = JSON.parse(response.getContentText());
        var pageActivities = data.activities || [];
        if (pageActivities.length === 0) break;

        if (seenIds[pageActivities[0].id]) {
          Suevich.Core.Logger.warn('WiseApiService: página repetida detectada');
          break;
        }

        pageActivities.forEach(function(a) {
          if (!seenIds[a.id]) {
            seenIds[a.id] = true;
            allActivities.push(a);
          }
        });

        cursor = data.cursor;
        pageCount++;

        if (pageCount % 5 === 0) {
          Suevich.Core.Logger.info('WiseApiService: página ' + pageCount + ' processada, total=' + allActivities.length);
        }
      } while (cursor && allActivities.length < targetLimit && pageCount < maxPages);

      Suevich.Core.Logger.info('WiseApiService: busca concluída com ' + allActivities.length + ' atividades');
      return allActivities;
    }
  };
})();
