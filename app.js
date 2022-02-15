#!/usr/bin/env node

import axios from 'axios';
import cheerio from 'cheerio';

const searchTerm = process.argv.slice(2);
console.log(`\nGathering stories concerning "${searchTerm[0]}"...`);

export async function getHeadlines(search) {
    const html = await axios.get('https://www.news.com.au/world');
    const $ = await cheerio.load(html.data);
    let data = [];
    
    $('.storyblock').each((i, elem) => {
        if (i <= 14) {

            let excerpt = $(elem).find('p.storyblock_standfirst.g_font-body-s').text();
            let excerptArray = excerpt.split(' ');

            let brokenExcerpt = '';
            for (let i = 0; i < excerptArray.length; i++) {
                brokenExcerpt += `${excerptArray[i]} `;
                if (i != 0 && i % 7 == 0) {
                    brokenExcerpt += '\n';
                }
            }

            if (search) {
                search = search.toLowerCase();
                let title = $(elem).find('a.storyblock_title_link').text();

                if (title.toLowerCase().includes(search.toLowerCase())) {
                    data.push({
                        title: title,
                        link: $(elem).find('a.storyblock_title_link').attr('href'),
                        excerpt: brokenExcerpt
                    })
                }
            } else {
                data.push({
                    title: $(elem).find('a.storyblock_title_link').text(),
                    link: $(elem).find('a.storyblock_title_link').attr('href'),
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

getHeadlines(searchTerm[0]);