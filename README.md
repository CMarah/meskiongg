# meskiongg

This script generates a table with players' head-to-head scores, using smashgg's API.

Before use, you must provide:

URLs.txt; where each line is the link to a smash.gg tournament's melee singles event. e.g.:
https://smash.gg/tournament/smashcorts-9/events/melee-singles

Optionally, inside dataParser.js, you can modify ID_TO_PLAYER adding players using the format:
[ smashgg_id, player_tagname ]
(see the file for a commented example).
If ID_TO_PLAYER array is not empty, only the players contained in it will be used, and their order will dictate how the resulting table is arranged. If empty, table.txt will contain results for every player found. To retrieve a players' smashgg ID, you can look inside players.txt after a first run.
