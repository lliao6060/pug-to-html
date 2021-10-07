const fs = require('fs');
const path = require('path');
var html2jade = require('html2jade');

const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

let html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');

html = html.replace(/<(\/?)([^>\s]*)([^>]*)>/gi, function(str, match1, match2, match3) {
  let camelized = camelToSnakeCase(match2);
  const fromCamelCase = match2.length < camelized.length;

  if (fromCamelCase) {
    camelized = camelized.split('').slice(1).join('');
  }

  return `<${match1}${camelized}${match3}>`;
});

html2jade.convertHtml(html, {}, function (err, jade) {
  const result = jade.replace(/\|\s{2,}/gi, '');

  fs.writeFileSync(path.resolve(__dirname, '../output/index.pug'), result);
});
