const getSetsFromURL = require('./setsFromURL');
const dataParser = require('./dataParser');

const URLS = [
  "https://smash.gg/tournament/dashback-ii/events/melee-singles/standings",
  "https://smash.gg/tournament/liga-smash-crush-encounters-3-jornada/events/melee-singles/standings",
  "https://smash.gg/tournament/johns-cup-ii/events/melee-singles/standings",
  "https://smash.gg/tournament/smashcorts-1/events/melee-singles/standings",
];

const getAndMerge = async (urls) => {
  const sets_per_url = await Promise.all(urls.map(url => getSetsFromURL(url)));
  return sets_per_url.reduce((merged, sets) =>
    Object.entries(sets).reduce((acc, [player, wins]) =>
      Object.assign(
        acc, { [player]: (acc[player] || []).concat(wins), }
      )
    , merged)
  , {});
};

const main = async () => {
  const results = await getAndMerge(URLS);
  const parsed_data = dataParser(results);
  require('fs').writeFile('table.txt', parsed_data, err => {
    if (err) throw err;
    console.log('Saved!');
  });
};

main();
