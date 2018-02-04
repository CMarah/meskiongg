const fetch = require('isomorphic-fetch');

const repeatString = (num, str) => (new Array(num).fill(str));

const getBracketInfo = bracket_id => {
  const bracket_url = 'https://api.smash.gg/phase_group/'+bracket_id+'?expand[]=sets&expand[]=entrants';
  return fetch(bracket_url).then(response => response.json())
    .then(response => ({
      entrants: response.entities.player.reduce((acc, entr) => {
          acc[entr.entrantId] = [entr.gamerTag, entr.id];
          return acc;
        }, {}),
      results: response.entities.sets.reduce((acc, set) => {
          const { entrant1Id, entrant2Id, winnerId, loserId, entrant1Score, entrant2Score } = set;
          if (!acc[entrant1Id] && entrant1Id) acc[entrant1Id] = {sets: [], games: []}; 
          if (!acc[entrant2Id] && entrant2Id) acc[entrant2Id] = {sets: [], games: []}; 
          if (entrant1Score > 0) acc[entrant1Id].games = acc[entrant1Id].games.concat(repeatString(entrant1Score, entrant2Id));
          if (entrant2Score > 0) acc[entrant2Id].games = acc[entrant2Id].games.concat(repeatString(entrant2Score, entrant1Id));
          if (winnerId && loserId) acc[winnerId].sets = acc[winnerId].sets.concat(loserId);
          return acc;
        }, {})
    }));
};

const analyzeTournament = url => fetch(url)
  .then(response => response.json())
  .then(response => {
    const brackets = response.entities.groups.map(gr => gr.id);
    const bracket_data = Promise.all(brackets.map(getBracketInfo));
    return bracket_data.then(data => {
      const all_entrants = data.reduce((all, { entrants }) =>
        Object.entries(entrants).reduce((acc, entr) => {
          if (!acc.map(x => x[0]).includes(entr[0])) acc.push(entr);
          return acc;
        }, all)
      , []).reduce((obj, elem) => { obj[elem[0]] = elem[1]; return obj; }, {});
      return data.reduce((sets, { results }) => sets.concat(
        Object.entries(results).reduce((sets, per_player) => {
          const player_id = all_entrants[per_player[0]][1];
          const beats = per_player[1].sets.map(x => all_entrants[x][1]);
          return sets.concat(beats.map(x => [player_id, x]));
        }, [])
      ) , []);
    });
  });

const getAPIURL = url => 'https://api.smash.gg/tournament/' +
  url.split('tournament/')[1].split('/')[0].split('?')[0] +
  '/event/melee-singles?expand[]=groups';

const main = url => analyzeTournament(getAPIURL(url)).then(sets =>
  sets.reduce((results, set) => {
    if (!results[set[0]]) results[set[0]] = [set[1]];
    else results[set[0]] =  results[set[0]].concat(set[1]);
    return results;
  }, {})
);

module.exports = main;
