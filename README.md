# meskiongg

This script generates a table with the provided player's head-to-head scores, using smashgg's API.
To use, modify index.js (add the tournaments to consider) and dataParser.js (with each player's name and smashgg ID).
After setting this up, running index.js (using node) will create table.txt, ready to be dropped into excel/drive.

To obtain a player's smashgg ID, navigate to their profile and it will be shown in the URL.
As for the tournament URLS, they should be formatted as "https://smash.gg/tournament/tournament-name".
