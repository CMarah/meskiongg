const ID_TO_PLAYER = []
/*
[
  ['277130', 'Magc'],
  ['146415', 'meskion'],
  ['153926', 'Axarth'],
  ['453974', 'Are$'],
  ['24347', 'Marah'],
  ['14705', 'Kisame'],
  ['311713', 'Weeb'],
  ['277110', 'Nefasto'],
  ['154496', 'Jukes'],
  ['13552', 'SaiX'],
  ['486046', 'Tony-hp'],
  ['520179', 'ivan'],
  ['31702', 'Talvi'],
  ['145843', 'Mäjoras'],
  ['9974', 'Nex'],
  ['507274', 'Yuyin'],
  ['36713', 'Metafalo'],
  ['135827', 'Sho'],
  ['46502', 'Xardov'],
  ['277187', 'Danieru'],
  ['287914', 'Seru'],
  ['69420', 'Lustrike'],
  ['36306', 'Gambs'],
  ['323092', 'El Moreno'],
  ['348205', 'Decade'],
  ['353741', 'lloni$'],
  ['700439', 'Zeinkiu'],
  ['256261', 'Regi'],
  ['5583', 'Animaster3000'],
  ['15053', 'IuDKing'],
  ['22900', 'Trif'],
  ['46987', 'Chobin'],
  ['23023', 'Plinci'],
  ['312734', 'DaGomSa'],
  ['48697', 'GBlade'],
  ['705256', 'JiMBo'],
  ['39978', 'K-12'],
  ['499113', 'R5'],
  ['9653', 'Liax'],
  ['31208', 'Joukai'],
  ['257479', 'TBAG'],
  ['150076', 'MILF'],
  ['38145', 'Malmortis'],
  ['158740', 'Verdal'],
  ['31958', '12MoraSeira'],
  ['677835', 'Kaminari'],
  ['22556', 'Overtriforce'],
  ['425375', 'Shikiso'],
  ['27594', 'PiÇÀ0'],
  ['395968', 'Dunxter'],
  ['681160', 'Emily'],
  ['150650', 'Xilio'],
  ['229832', 'Yoshim'],
  ['499183', 'Across'],
  ['156096', 'Tito MC'],
  ['46801', 'Daisuki'],
  ['12513', 'alexndr'],
  ['29759', 'Kyo'],
  ['21913', 'Toerq'],
  ['452811', 'Isku'],
  ['147391', 'Ender'],
  ['324141', 'DNL'],
  ['150127', 'Kei'],
  ['679093', 'taz0'],
];*/
const ORDERED_IDs = ID_TO_PLAYER.map(x => x[0]);

module.exports = results => {
  const id_list = ORDERED_IDs.length ? ORDERED_IDs : Object.entries(results).map(x => x[0]);
  if (!ORDERED_IDs.length) console.log('No ID/player list provided, using all found players.');
  const player_wins = id_list.map(
    id => results[id].sets.reduce((wins, win_id) => {
      const win_id_str = win_id.toString();
      if (id_list.includes(win_id_str)) wins[id_list.indexOf(win_id_str)] += 1;
      return wins;
    }, new Array(id_list.length).fill(0))
  );
  return player_wins.reduce(
    (table, player_win, row) => table + results[id_list[row]].name + '\t' + player_win.reduce(
      (line, el, col) => line + (col === row ? '-' : String(el)) + '\t'
    , '') + '\n'
  , '');
};
