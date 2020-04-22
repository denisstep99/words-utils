const cheerio = require('cheerio');
const axios = require('axios');

async function makeCambridgeRequest(word) {
  const path = `https://dictionary.cambridge.org/dictionary/english/${word}`;
  return axios.get(path);
}

async function parseResponse(response) {
  const transcriptionRegexp = /^\/+|\/+$/g;

  const $ = cheerio.load(response.data);
  const resultData = Object.create(null);

  resultData.word = $('.headword').first().text().trim();
  resultData.partOfSpeech = $('.posgram').first().text().trim();

  resultData.transcriptionUk = $('.uk .pron').first().text().replace(transcriptionRegexp, '');
  resultData.transcriptionUs = $('.us .pron').first().text().replace(transcriptionRegexp, '');

  resultData.definitions = [];
  $('.sense-body>.def-block .ddef_d').each(function() {
    resultData.definitions.push($(this).text().trim());
  });

  return resultData;
}
