// -*- coding: utf-8 -*-

$(document).ready(function() {
    AOS.init();

    const hamburger = document.getElementById('hamburger');
    const user_buttons = document.querySelectorAll('.user-btn');
    const hands = document.querySelectorAll('.move');
    const row_wrapper = document.getElementById('row-wrapper');

    const SCORES = {
        TIE: document.getElementById('tie-score'),
        USER: document.getElementById('user-score'),
        AI: document.getElementById('ai-score'),
    };

    const TYPES = [
        'rock',
        'paper',
        'scissors'
    ];

    var CONFIG = {
        USER: 0,
        AI: 0,
        TIE: 0,
        ROUND: 0
    };

    const HANDS = {
        rock: '/resources/rps/rock.png',
        paper: '/resources/rps/paper.png',
        scissors: '/resources/rps/scissors.png',
        shake: '/resources/rps/shake.png',
    };

    const SVGs = {
        color: '#A3A3A3',

        getSVG(move, winner) {
            this.color = winner ? '#F05454' : '#A3A3A3';
            return this.svgs[move].replace('%c', this.color);
        },

        svgs: {
            rock: `<svg viewBox="0 0 60 60">
                    <g fill="none" fill-rule="evenodd">
                        <path d="M37.048 23.704h-5.492v-2.53L30.38 20h-8.02L16 26.36v7.28L22.36 40h12.096l1.13-1.13 1.48-9.918 1.156-.778v-3.296l-1.174-1.174zm-.307 3.677l-1.056.704-1.481 10.082-.352.352H22.974l-5.493-5.493v-6.052l5.493-5.493h6.793l.307.308v1.915h-2.963v1.481h9.322l.308.308v1.888z" fill="%c" fill-rule="nonzero">
                        </path>
                    </g>
                </svg>`,

            paper: `<svg viewBox="0 0 60 60">
                        <g fill="none" fill-rule="evenodd">
                        </g>
                        <path d="M39.704 38.826v-2.53h3.27l1.174-1.174v-2.53h1.789l1.174-1.173V28.58l-1.174-1.174h-1.048v-2.53l-1.174-1.173h-8.519l.434-.434v-2.096L34.456 20H22.359L16 26.36v7.28L22.36 40h16.17l1.174-1.174zm-16.73-.307l-5.493-5.493v-6.052l5.493-5.493h10.867l.307.308v.867L33.1 23.704h-5.989v1.481H43.1l.307.308v1.914h-11.11v1.482h13.025l.308.307v1.608l-.308.307H32.296v1.482h10.37v1.914l-.307.308H32.296v1.481h5.926v1.915l-.307.308h-14.94z" fill="%c" fill-rule="nonzero"></path>
                    </svg>`,

            scissors: `<svg viewBox="0 0 60 60">
                            <g fill="none" fill-rule="evenodd">
                            </g>
                            <path d="M46 31.563l-6.104-2.674h5.297l1.177-1.174v-2.837l-1.174-1.174h-13.64v-2.53L30.38 20h-8.02L16 26.36v7.28L22.36 40h10.614l1.111-1.111 1-6.004 8.37 3.215 1.541-.415 1.419-2.455L46 31.563zM44.037 34.4l-.481.13-9.63-3.704-1.211 7.322-.37.37h-9.37l-5.494-5.492v-6.052l5.493-5.493h6.793l.307.308v1.915H26.37v1.481h18.211l.308.308V27.1l-.308.307H35.26v1.063l9.482 4.167.1.37-.804 1.393z" fill="%c" fill-rule="nonzero"></path>
                        </svg>`
        }
    };

    hamburger.addEventListener('click', e => {
        hamburger.classList.toggle('show');
    });

    user_buttons.forEach(button => {
        button.addEventListener('click', e => {
            let type = button.getAttribute('data-type');
            play(type);
        });
    });

    // * Reset all
    $('#reset-btn').on('click', function() {
        CONFIG = {
            USER: 0,
            AI: 0,
            TIE: 0,
            ROUND: 0
        };

        SCORES.TIE.innerHTML = CONFIG.TIE;
        SCORES.USER.innerHTML = CONFIG.USER;
        SCORES.AI.innerHTML = CONFIG.AI;

        $('#round').text(`ROUND ${CONFIG.ROUND + 1}`);

        changeHand('shake', 'user');
        changeHand('shake', 'ai');

        row_wrapper.innerHTML = '';
    });

    // * Play a round
    async function play(user) {
        // * Shake hands animation
        hands.forEach(hand => {
            hand.parentElement.classList.add('shake');
        });

        // ? Can be changed in the future to the real waiting promise
        // ? (for ex. waiting for the server responseo of the machine learnign alg)
        await sleep(1000);

        hands.forEach(hand => {
            hand.parentElement.classList.remove('shake');
        });

        // * Choose ai move and find winning side
        const ai = TYPES[Math.floor(Math.random() * TYPES.length)];

        changeHand(user, 'user');
        changeHand(ai, 'ai');

        var winner = false;

        if (ai == user) SCORES.TIE.innerText = ++CONFIG.TIE;
        else if ((user == 'rock' && ai != 'paper') || (user == 'paper' && ai != 'scissors') || user == 'scissors' && ai != 'rock') {
            SCORES.USER.innerText = ++CONFIG.USER;
            winner = 'user';
        }
        else {
            SCORES.AI.innerText = ++CONFIG.AI;
            winner = 'ai';
        }

        CONFIG.ROUND++;
        $('#round').text(`ROUND ${CONFIG.ROUND}`);

        insertLastestRow(user, ai, winner);
    }

    function changeHand(move, type) {
        switch (type) {
            case 'user': {$('#user-hand').attr('src', HANDS[move])} break;
            case 'ai': {$('#ai-hand').attr('src', HANDS[move])} break;
        }
    }

    // * Sleep the execution for a given time
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function insertLastestRow(user, ai, winner) {
        row_wrapper
            .insertAdjacentHTML('afterbegin',
                `<div class="row">
                    <span class="svg-wrapper">
                        ${SVGs.getSVG(user, winner == 'user' ? true : false)}
                    </span>
                    <span class="round-number">${CONFIG.ROUND}</span>
                    <div class="svg-wrapper ai">
                        ${SVGs.getSVG(ai, winner == 'ai' ? true : false)}
                    </div>
                </div>`);
    }
});