Run the following within the project folder to install globally:
```$ npm install -g```

Run the following anywhere to uninstall:
``` $ npm uninstall -g news-headlines```

Run from the command line with the following:
```$ news ?<search term> /<serach without term> </serach> <number of articles> <source flag>```

_search term_, _search without term_ _number of articles_ and _source flag_ are optional arguments. Their order does not matter. None are required.

##### Search term
- A string to match with the article headline.
- Prefix with '?', or include between "double quotes" to search for a multi-word string.

##### Search without term
- Exclude an article if the headline contains this term.
- Prefix with '/'

##### Number of articles
_leave blank to default to 10_
_number of returned articles is hard-capped at 50_
- An integer to return up to that number of articles if found.

##### Source Flags
_leave blank to default to -n_
- -n = news.com.au
- -bbc = bbc.com
- -afr = afr.com