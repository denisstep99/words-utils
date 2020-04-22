const axios = require('axios');
const cheerio = require('cheerio');


function defineLanguage(word) {
  const russianRegexp = /[а-яА-ЯёЁ]/;
  const englishRegexp = /[a-zA-Z]/;

  const language = {
    RUSSIAN: 'russian-english',
    ENGLISH: 'english-russian',
  };

  const letter = word.trim().charAt(0);

  if (russianRegexp.test(letter)) {
    return language.RUSSIAN;
  } else if (englishRegexp.test(letter)) {
    return language.ENGLISH;
  }

  throw new Error(`Invalid argument: ${word}`);
}


function parseExamples($, examples) {
  const parsedExamples = [];

  examples.each(function() {
    parsedExamples.push({
      originalSentence: $(this).find('.src span.text').text().trim(),
      translatedSentence: $(this).find('.trg span.text').text().trim(),
    });
  });

  return parsedExamples;
}


async function makeWordRequest(word) {
  const direction = defineLanguage(word);
  const encodedWord = encodeURIComponent(word);
  const path = `https://context.reverso.net/translation/${direction}/${encodedWord}`;

  return axios.get(path);
}


async function parseResponse(response) {
  const responseBody = response.data;
  const $ = cheerio.load(responseBody);

  const examples = $('#examples-content .example');
  return parseExamples($, examples);
}

