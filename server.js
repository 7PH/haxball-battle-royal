const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();


const HAXBALL_SERVER_URL = 'https://html5.haxball.com/headless';

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (! process.env.HAXBALL_TOKEN) {
    console.error('HAXBALL_TOKEN is not set.');
    process.exit(1);
}

console.log('============================');
console.log('> Starting Haxball Headless');
console.log(`> Using token ${process.env.HAXBALL_TOKEN}`);
console.log('============================');

async function run () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(HAXBALL_SERVER_URL);

    await timeout(2 * 1000);

    page
        .on('console', message =>
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
        )
        .on('pageerror', ({ message }) => console.log(message))
        .on('response', response =>
            console.log(`${response.status()} ${response.url()}`)
        )
        .on('requestfailed', request =>
            console.log(`${request.failure().errorText} ${request.url()}`)
        );
    
    // Inject token
    await page.evaluate(function(token) {
        window.HAXBALL_TOKEN = token;
    }, process.env.HAXBALL_TOKEN);
    
    // Inject bundle.js
    await page.evaluate(function(rawCode) {
        eval(rawCode);
    }, fs.readFileSync('dist/bundle.js').toString());

    // Wait for room to be created
    await timeout(2 * 1000);

    // Retrieve room URL
    const roomUrl = await page.evaluate(() => {
        const iframeDocument = document.getElementsByTagName('iframe')[0].contentWindow.document;
        return iframeDocument.getElementsByTagName('a')[1].href;
    });

    // Print generated room URL
    console.log('');
    console.log('============================');
    console.log(`> Room URL: ${roomUrl}`);
    console.log('============================');
}

run();
