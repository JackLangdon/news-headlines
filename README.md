Run the following within the project folder to install globally:
```$ npm install -g```

Run the following anywhere to uninstall:
``` $ npm uninstall -g news-headlines```

Run from the command line with the following:
```$ news <search term> <number of articles> <source flag>```

_search term_, _number of articles_ and _source flag_ are optional arguments. Their order does not matter. None are required.

##### Search term
- A string to match with the article headline.

##### Number of articles
_leave blank to default to 10_
- An integer to return up to that number of articles if found.
- The script will always scan the first 100 articles

##### Source Flags
_leave blank to default to -n_
- -n = news.com.au
- -bbc = bbc.com
- -afr = afr.com