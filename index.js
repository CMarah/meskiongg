const fs = require('fs');
const getResults = require('./setsFromURLs.js');
const dataParser = require('./dataParser.js');

try {
  const URLs = fs.readFileSync('./URLs.txt', 'utf8').split('\n').filter(x => x);
  getResults(URLs).then(results => {
    console.log('API queries completed, processing sets.');
    fs.writeFile('table.txt', dataParser(results), err => {
      if (err) throw err;
      else console.log('Results saved in table.txt.');
    });
    const players_list = Object.entries(results).map(
      x => `${x[0]}, ${x[1].name}`
    );
    fs.writeFile('players.txt', players_list.join('\n'), err => {
      if (err) throw err;
      else console.log('Full players list written in players.txt');
    });
  });
} catch (err) {
  console.error('"URLs.txt" is missing or has an incorrect format (see README)');
  return;
}
