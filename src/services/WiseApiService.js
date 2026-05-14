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
     * Usa since/until para filtrar diretamente na API.
     * @param {number} days
     * @returns {Array} Atividades brutas da API
     */
    getActivities: function(days) {
      var allActivities = [];
      var seenIds = {};
      var cursor = null;
      var maxPages = 100;
      var pageCount = 0;

      var now = new Date();
      var since = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
      var sinceIso = since.toISOString();
      var untilIso = now.toISOString();

      Suevich.Core.Logger.info('WiseApiService: busca de ' + days + ' dias (since=' + sinceIso + ', until=' + untilIso + ')');

      do {
        var url = 'https://api.transferwise.com/v1/profiles/' + Suevich.Core.Config.get('PROFILE_ID') + '/activities?size=100&since=' + encodeURIComponent(sinceIso) + '&until=' + encodeURIComponent(untilIso);
        if (cursor) {
          url += '&nextCursor=' + encodeURIComponent(cursor);
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

        cursor = data.nextCursor;
        pageCount++;

        if (pageCount % 5 === 0) {
          Suevich.Core.Logger.info('WiseApiService: página ' + pageCount + ' processada, total=' + allActivities.length);
        }
      } while (cursor && pageCount < maxPages);

      Suevich.Core.Logger.info('WiseApiService: busca concluída com ' + allActivities.length + ' atividades');
      return allActivities;
    }
  };
})();
