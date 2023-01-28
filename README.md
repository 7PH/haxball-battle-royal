# HaxBall Battle Royal Bot

To use this bot, it's super simple:

## With cloning the repo (easier if you know how to use git)

1. Setup the bot:
    ```bash
    git clone https://github.com/7PH/haxball-battle-royal.git
    cd haxball-battle-royal
    npm install
    ```
2. Get a token [here](https://www.haxball.com/headlesstoken)
3. Start a room (replace `$YOUR_TOKEN$` with your token):
    ```bash
    HAXBALL_TOKEN=$YOUR_TOKEN$ npm start
    ```

Next time you can just do steps 3 and 4.

## Without cloning the repo

1. Get a token [here](https://www.haxball.com/headlesstoken)
2. Open [this page](https://html5.haxball.com/headless) in your browser
3. Open the browser console (F12 on chrome, Ctrl+Shift+J on firefox)
4. Write `HAXBALL_TOKEN=$YOUR_TOKEN$` in the console and hit enter (replace $YOUR_TOKEN$ with your token)
4. Copy and paste [this code](https://raw.githubusercontent.com/7PH/haxball-battle-royal/master/dist/bundle.js) in the console and hit enter
5. That's it! Your battle royal room is running
