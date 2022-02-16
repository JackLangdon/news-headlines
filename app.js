#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio';

let optionalArgs = process.argv.slice(2);

let searchArg = '';
let numArg = 10;
let urlArg = '-n';

if (optionalArgs.length > 0) {
    for (let i = 0; i < optionalArgs.length && i < 3; i++) {
        if (!isNaN(parseInt(optionalArgs[i]))) {
            numArg = optionalArgs[i];
        } else if (optionalArgs[i].charAt(0) == '-') {
            urlArg = optionalArgs[i];
        } else {
            searchArg = optionalArgs[i];
        }
    }
}

if (searchArg != '') {
    console.log(`\nGathering ${numArg} stories concerning "${searchArg}"...`);
}

let url;
let container;
let titleClass = '';
let excerptClass = '';
let linkClass = '';

switch (urlArg) {
    case '-n':
        url = 'https://www.news.com.au/world';
        container = '.storyblock';
        titleClass = 'a.storyblock_title_link';
        excerptClass = 'p.storyblock_standfirst.g_font-body-s';
        linkClass = 'a.storyblock_title_link';
        break;
    case '-afr':
        url = 'https://www.afr.com/';
        container = '[data-testid="StoryTileBase"]';
        titleClass = 'h3.StoryTileHeadline-h3 a';
        excerptClass = '.StoryTileBase p';
        linkClass = '.StoryTileHeadline-h3 a';
        break;
    case '-bbc':
        url = 'https://www.bbc.com/news';
        container = '.gel-layout__item';
        titleClass = 'h3.gs-c-promo-heading__title';
        excerptClass = 'p.gs-c-promo-summary';
        linkClass = 'a.gs-c-promo-heading';
        break;
    default:
        url = 'https://www.news.com.au/world';
        container = '.storyblock';
        titleClass = 'a.storyblock_title_link';
        excerptClass = 'p.storyblock_standfirst.g_font-body-s';
        linkClass = 'a.storyblock_title_link';
}

export async function getHeadlines(search) {
    const html = await axios.get(url);
    const $ = await cheerio.load(html.data);
    let data = [];
    
    $(container).each((i, elem) => {
        if (data.length < numArg && i <= 100) {

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

            if (searchArg) {
                search = search.toLowerCase();

                if (title != '' && title.toLowerCase().includes(search.toLowerCase())) {
                    data.push({
                        title: title.trim(),
                        link: $(elem).find(linkClass).attr('href'),
                        excerpt: brokenExcerpt
                    })
                    console.log('data: ', data)
                }
            } else if (title != '') {
                data.push({
                    title: title,
                    link: $(elem).find(linkClass).attr('href'),
                    excerpt: brokenExcerpt
                })
            }
        }
    });

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

getHeadlines(searchArg, numArg, urlArg);