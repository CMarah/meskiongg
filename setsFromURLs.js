const fetch = require('isomorphic-fetch');

const getBracketAPIUrl = bracket_id =>
  'https://api.smash.gg/phase_group/' +
  bracket_id +
  '?expand[]=sets&expand[]=entrants';
const getTournamentAPIUrl = url => url
  .replace('smash.gg', 'api.smash.gg')
  .replace('/events/', '/event/')
  .concat('?expand[]=groups');

const getBracketIds = url => fetch(getTournamentAPIUrl(url))
  .then(response => response.json())
  .then(response => response.entities.groups.map(gr => gr.id));

const updatePlayerData = ({ name, games, sets }, winner, op_id, score) => ({
  name,
  games: (games || []).concat(new Array(score).fill(op_id)),
  sets: (sets || []).concat(winner ? op_id : []),
});

const getBracketData = bracket_id => fetch(getBracketAPIUrl(bracket_id))
  .then(response => response.json())
  .then(response => {
    const entrants = response.entities.player.reduce(
      (acc, entr) => ({ ...acc, [entr.entrantId]: [entr.gamerTag, entr.id] })
    , {});
    const base_results = Object.values(entrants).reduce(
      (acc, entrant) => ({ ...acc, [entrant[1]]: { name: entrant[0], games: [], sets: [], } })
    , {});
    return response.entities.sets
      .filter(set =>
        set.entrant1Id && set.entrant2Id && set.winnerId &&
        set.loserId && set.entrant1Score >= 0 && set.entrant2Score >= 0
      )
      .map(set => ({
        ...set,
        entrant1Id: entrants[set.entrant1Id][1],
        entrant2Id: entrants[set.entrant2Id][1],
        winnerId:   entrants[set.winnerId][1],
        losetId:    entrants[set.loserId][1],
      }))
      .reduce((acc, set) => {
        const { entrant1Id, entrant2Id, winnerId, loserId, entrant1Score, entrant2Score } = set;
        return {
          ...acc,
          [entrant1Id]: updatePlayerData(
            acc[entrant1Id], entrant1Id === winnerId, entrant2Id, entrant1Score,
          ),
          [entrant2Id]: updatePlayerData(
            acc[entrant2Id], entrant2Id === winnerId, entrant1Id, entrant2Score,
          ),
        };
      }, base_results);
  });


module.exports = async URLs => {
  const all_bracket_ids = (await Promise.all(URLs.map(getBracketIds)))
    .reduce((found_ids, bracket_ids) => found_ids.concat(bracket_ids), []);
  console.log(all_bracket_ids.length + ' brackets found, accessing their results.');
  const bracket_data = (await Promise.all(all_bracket_ids.map(getBracketData)))
    .reduce((all, chunk) => all.concat(Object.entries(chunk)), []);
  return bracket_data.reduce((results, [id, { name, games, sets }]) => ({
    ...results,
    [id]: results[id] ? {
      name,
      games: results[id].games.concat(games),
      sets:  results[id].sets.concat(sets),
    } : { name, games, sets },
  }), {});
};
