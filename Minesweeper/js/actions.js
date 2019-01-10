"use strict";

var game_settings = {
        board: {
            width: 15,
            height: 8
        },
        mines: {
            count: 10,     // procentine israiska, nuo lentos dydzio
            list: []
        },
        clock: {
            current_time: 1,
            max: 999
        },
        status: 'start', // start, in_progress, game_over
        click_count: 0
    },
    myTimer;


renderGame( game_settings );

$('.game > .field').on('click', '.cell', function(){
    var cell_position = $(this).index();
    if ( game_settings.status !== 'game_over' && !$(this).hasClass('flag') ) {
        if ( game_settings.click_count === 0 ) {
            startGame( game_settings, cell_position );
        } else {
            if ( !$(this).hasClass('open') ) {
                // tikriname ar tame langelyje yra bomba
                if ( game_settings.mines.list.indexOf( cell_position ) === -1 ) {
                    // bombos langelyje nera, tesiam zaidima
                    console.log('zaidziam toliau...');
                    openCell( cell_position );
                } else {
                    // bomba rasta - GAME OVER... :'(
                    gameOver();
                }
            }
        }
        game_settings.click_count++;
    }
});


$('.game > .header > .status-button').click(function(){
    resetGame();
});


$('.game > .field > .cell').bind("contextmenu", function (event) {
    // Avoid the real one
    event.preventDefault();
    
    $(this).toggleClass('flag');
});


