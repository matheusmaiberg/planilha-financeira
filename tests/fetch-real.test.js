const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const PROFILE_ID = '3903096';
const TOKEN = process.env.WISE_API_TOKEN;

describe('Wise API - fetch real de atividades', () => {
  test('deve baixar atividades e salvar em JSON', async () => {
    if (!TOKEN) {
      console.log('⚠️  WISE_API_TOKEN não configurado — pulando fetch real');
      return;
    }

    const since = new Date(Date.now() - 90 * 86400000).toISOString();
    const until = new Date().toISOString();
    const url = `https://api.transferwise.com/v1/profiles/${PROFILE_ID}/activities?size=100&since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`;

    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const bodyText = await res.text();
    assert.strictEqual(res.status, 200, `HTTP ${res.status}: ${bodyText}`);

    const data = JSON.parse(bodyText);
    assert.ok(Array.isArray(data.activities), 'resposta deve conter array activities');

    const outPath = path.join(__dirname, 'data', 'real-activities.json');
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

    console.log(`\n✅ ${data.activities.length} atividades baixadas → ${outPath}`);
    if (data.cursor) console.log('   cursor:', data.cursor);
  });
});
