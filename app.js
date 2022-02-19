#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio';

// get optional arguments
let optionalArgs = process.argv.slice(2);

// set default arguments
let searchArg = '';
let withoutArg = '';
let numArg = 10;
let urlArg = '-n';

// update arguments
if (optionalArgs.length > 0) {
    for (let i = 0; i < optionalArgs.length && i < 4; i++) {
        if (!isNaN(parseInt(optionalArgs[i]))) {
            numArg = optionalArgs[i];
        }
        if (optionalArgs[i].charAt(0) == '-') {
            urlArg = optionalArgs[i];
        }
        if (optionalArgs[i].charAt(0) == '/') {
            withoutArg = optionalArgs[i].substring(1);
        }
        if (optionalArgs[i].charAt(0) == '?') {
            searchArg = optionalArgs[i].substring(1).split('_').join(' ');
        }
    }
}

let url;
let site;
let container;
let titleClass = '';
let excerptClass = '';
let linkClass = '';

// set site specific content to scrape
switch (urlArg) {
    case '-n':
        url = 'https://www.news.com.au/world';
        site = 'news.com.au';
        container = '.storyblock';
        titleClass = 'a.storyblock_title_link';
        excerptClass = 'p.storyblock_standfirst.g_font-body-s';
        linkClass = 'a.storyblock_title_link';
        break;
    case '-afr':
        url = 'https://www.afr.com/';
        site = 'afr.com';
        container = 'div[data-testid="StoryTileBase"]';
        titleClass = 'h3[data-testid="StoryTileHeadline-h3"] a';
        excerptClass = 'div[data-testid="StoryTileBase"] p';
        linkClass = 'h3[data-testid="StoryTileHeadline-h3"] a';
        break;
    case '-bbc':
        url = 'https://www.bbc.com/news';
        site = 'bbc.com';
        container = '.gel-layout__item';
        titleClass = 'h3.gs-c-promo-heading__title';
        excerptClass = 'p.gs-c-promo-summary';
        linkClass = 'a.gs-c-promo-heading';
        break;
    default:
        url = 'https://www.news.com.au/world';
        site = 'news.com.au';
        container = '.storyblock';
        titleClass = 'a.storyblock_title_link';
        excerptClass = 'p.storyblock_standfirst.g_font-body-s';
        linkClass = 'a.storyblock_title_link';
}

console.log(`\nChecking "${site}" for up to ${numArg > 50 ? '50' : numArg} ${numArg == 1 ? 'story' : 'stories'}...`);
if (searchArg != '') {
    console.log(`\nSearch = "${searchArg}"`);
}
if (withoutArg != '') {
    console.log(`\nIgnore = "${withoutArg}"`);
}

export async function getHeadlines(searchArg, withoutArg, numArg, url) {
    const html = await axios.get(url);
    const $ = await cheerio.load(html.data);
    let data = [];
    
    $(container).each((i, elem) => {
        // search page for up to the first 50 articles
        if (data.length < numArg && i <= 49) {

            // break excerpt into multiple lines for easier reading
            let excerpt = $(elem).find(excerptClass).text().trim();
            let excerptArray = excerpt.split(' ');
            let brokenExcerpt = '';
            for (let i = 0; i < excerptArray.length; i++) {
                brokenExcerpt += `${excerptArray[i]} `;
                if (i != 0 && i % 7 == 0) {
                    brokenExcerpt += '\n';
                }
            }

            let title = $(elem).find(titleClass).text().trim();
            let search = searchArg.toLowerCase();
            let without = withoutArg.toLowerCase();

            // skip to next article if title contains 'without' argument
            if (title != '' && without != '' && title.toLowerCase().includes(without)) {
                return;
            }

            // empty search will return all articles by default
            if (title != '' && title.toLowerCase().includes(search.toLowerCase())) {
                data.push({
                    title: title.trim(),
                    link: $(elem).find(linkClass).attr('href'),
                    excerpt: brokenExcerpt
                })
            }
        }
    });

    // output results
    if (data.length > 0) {
        console.log(`\nFound ${data.length}!\n\n`);
        for (let i = 0; i < data.length; i++) {
            console.log('\x1b[1m\x1b[47m\x1b[30m%s\x1b[0m', `Story #${i+1}`)
            console.warn('\x1b[32m%s\x1b[0m', `\n${(data[i].title).toUpperCase()}`)
            console.log('\x1b[33m%s\x1b[0m', `\n${data[i].excerpt}`)
            console.log('\x1b[4m%s\x1b[0m', `\n${data[i].link}`)
            console.log('\n')
        }
    } else {
        console.log("\nNo stories found...")
    }
}

getHeadlines(searchArg, withoutArg, numArg, url);