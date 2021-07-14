const puppeteer = require('puppeteer');
const fs = require('fs');


const HAXBALL_SERVER_URL = 'https://html5.haxball.com/headless';

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function run () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(HAXBALL_SERVER_URL);

    await timeout(2 * 1000);

    page
        .on('console', message =>
        console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
        .on('pageerror', ({ message }) => console.log(message))
        .on('response', response =>
        console.log(`${response.status()} ${response.url()}`))
        .on('requestfailed', request =>
        console.log(`${request.failure().errorText} ${request.url()}`));
        
    const rawCode = fs.readFileSync('dist/bundle.js').toString();

    await page.evaluate(function(rawCode) {
        eval(rawCode);
    }, rawCode);

    // get screenshot
    await timeout(4 * 1000);
    console.log('saved screenshot');
    await page.screenshot({path: 'screenshot.png'});
}

run();
