const ID_TO_PLAYER = [
 ['22900' , 'Trifasia'],
 ['22556' , 'Over'],
 ['39978' , 'K-12'],
 ['9653'  , 'L'],
 ['38145' , 'Malmortis'],
 ['46801' , 'Daisuki'],
 ['24347' , 'Marah'],
 ['23023' , 'Plinci'],
 ['135710', 'Flint'],
 ['27599' , 'Skam'],
 ['149000', 'Joshi'],
 ['48697' , 'Gblade'],
 ['13552' , 'Saix'],
 ['145843', 'Majoras'],
 ['29759' , 'Kyo'],
 ['150662', 'Alinkandro'],
 ['277187', 'Danieru'],
 ['150127', 'Kei'],
 ['12513' , 'Alexandr'],
 ['153926', 'Axarth'],
 ['36713' , 'Metafalo'],
 ['15053' , 'Iu2king'],
 ['9974'  , 'Nex'],
 ['38223' , 'Helmet' ],
 ['323092', 'Seigal'],
 ['31958' , 'Corazon'],
 ['69420' , 'Lustrike'],
 ['21913' , 'Toerq'],
 ['154496', 'Jukes'],
 ['154023', 'Nich'],
 ['150076', 'MILF'],
 ['39555' , 'Wiru'],
 ['14705' , 'Kisame'],
 ['39457' , 'Tazz'],
 ['287914', 'Seru'],
 ['39942' , 'Willyyy'],
 ['153943', 'Linkeiro'],
 ['36363' , 'Mr Tom'],
 ['146415', 'Meskion'],
 ['507274', 'Yuyin'],
 ['31702' , 'Talvi'],
 ['312734', 'DaGomSa'],
 ['158740', 'Verdal'],
 ['31208' , 'Joukai'],
 ['257479', 'Tbag'],
 ['324141', 'DNL'],
 ['35857' , 'Zeone'],
 ['312492', 'Mark'],
 ['499113', 'R5'],
 ['135827', 'Sho'],
 ['278157', 'Kpi'],
 ['47598' , 'Pikkususi'],
 ['312507', 'Kakarot'],
 ['69185' , 'Manu'],
 ['312468', 'VGS'],
 ['256261', 'Regi'],
 ['312984',  'Sr. Gi'],
 ['148525', 'PloPloPlo'],
 ['149646', 'Uruu'],
];

const ORDERED_IDs = ID_TO_PLAYER.map(x => x[0]);

module.exports = results => {
  const player_wins = ID_TO_PLAYER.map(([ id, player ]) =>
    [player].concat((results[id] || []).reduce(
      (all_wins, win) => {
        const win_str = win.toString();
        if (!ORDERED_IDs.includes(win_str)) return all_wins;
        all_wins[ORDERED_IDs.indexOf(win_str)] += 1;
        return all_wins;
      }
    , new Array(Object.keys(ID_TO_PLAYER).length).fill(0)))
  );
  return player_wins.reduce(
    (table, player_win, row) => table + player_win.reduce(
      (line, el, col) => line + (col === row+1 ? '-' : String(el)) + '\t'
    , '') + '\n'
  , '');
};
