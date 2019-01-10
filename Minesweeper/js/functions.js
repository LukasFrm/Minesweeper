"use strict";

function renderGame( settings ) {
    var HTML = '',
        board_size = settings.board.width * settings.board.height;

    // generating board
    for ( var i=0; i<board_size; i++ ) {
        HTML += '<div class="cell"></div>';
    }
    $('.game > .field').html(HTML);

    if ( settings.board.width > 10 ) {
        $('.game').css('width', settings.board.width*30).css('margin-left', 'calc(50% - '+settings.board.width*15+'px)');
    }

    // atnaujiname kiek zaidime bus bombu
    $('.game > .header > #mines').text( countBombsForCurrentGame() );

    return;
}

function startGame( game_settings, cell_position ) {
    // paleidzia zaidimo laikrodi
    startClock();

    // sugeneruoja bombas ir jas isdelioja
    renderBombs( game_settings, cell_position );

    // atidaro langeli, ant kurio paspaudziau
    openCell( cell_position );

    return;
}

function startClock() {
    myTimer = setInterval(myClock, 1000);

    function myClock() {
        var ct = game_settings.clock.current_time++;
        if ( ct < 10 ) {
            ct = '00'+ct;
        } else if ( ct < 100 ) {
            ct = '0'+ct;
        }

        $('#clock').text(ct);
        if (game_settings.clock.current_time === 1000) {
            clearInterval(myTimer);
        }
    }
    return;
}

function countBombsForCurrentGame() {
    var board_size = game_settings.board.width * game_settings.board.height - 1,
        bomb_count = Math.floor(board_size * game_settings.mines.count / 100);
    if ( bomb_count === 0 ) {
        bomb_count = 1;
    }
    return bomb_count;
}

function renderBombs( game_settings, starting_cell ) {
    var board_size = game_settings.board.width * game_settings.board.height - 1,
        bomb_count = countBombsForCurrentGame(),
        position = 0;

    // generuojame reikiama kieki unikaliu atsitiktiniu poziciju bomboms
    for ( var i=0; i<bomb_count; i++ ) {
        position = Math.round( Math.random()*board_size );

        if ( game_settings.mines.list.indexOf( position ) === -1 &&
             starting_cell !== position ) {
            game_settings.mines.list.push( position );
        } else {
            // neuzskaitome itaracijos, nes neradome unikalios reiksmes - kartojam is naujo
            i--;
        }
    }

    console.log( game_settings.mines.list );

    // isdeliojame bombas i reikiamas vietas
    // CHEAT
    // for ( var i=0; i<bomb_count; i++ ) {
    //     $('.game > .field > .cell').eq(game_settings.mines.list[i]).text('X');
    // }

    return;
}

function openCell( index ) {
    var count = 0,
        w = game_settings.board.width,
        h = game_settings.board.height,
        kx = index%w,
        ky = (index-kx)/w;
    // $('.game > .field > .cell').eq(index).addClass('open');

    if ( $('.game > .field > .cell').eq(index).hasClass('open') ) {
        return;
    }

    // A B C
    // D x E
    // F G H

    // suskaiciuojame kiek yra aplinkui bombu
    // A
    if ( kx-1 >= 0 && ky-1 >= 0 && game_settings.mines.list.indexOf( index-w-1 ) >= 0 ) {
        count++;
    }

    // B
    if ( ky-1 >= 0 && game_settings.mines.list.indexOf( index-w ) >= 0 ) {
        count++;
    }
    
    // C
    if ( kx+1 <= (w-1) && ky-1 >= 0 && game_settings.mines.list.indexOf( index-w+1 ) >= 0 ) {
        count++;
    }
    
    // D
    if ( kx-1 >= 0 && game_settings.mines.list.indexOf( index-1 ) >= 0 ) {
        count++;
    }
    
    // E
    if ( kx+1 <= (w-1) && game_settings.mines.list.indexOf( index+1 ) >= 0 ) {
        count++;
    }
    
    // F
    if ( kx-1 >= 0 && ky+1 <= (h-1) && game_settings.mines.list.indexOf( index+w-1 ) >= 0 ) {
        count++;
    }
    
    // G
    if ( ky+1 <= (h-1) && game_settings.mines.list.indexOf( index+w ) >= 0 ) {
        count++;
    }
    
    // H
    if ( kx+1 <= (w-1) && ky+1 <= (h-1) && game_settings.mines.list.indexOf( index+w+1 ) >= 0 ) {
        count++;
    }
    
    // irasome i langeli bombu skaiciu
    $('.game > .field > .cell').eq(index).text( count ).addClass('open');

    // jeigu aplinkui nera nei vienos bombos, tai atidarinejame ir kaimyninius langelius
    if ( count === 0 ) {
        if ( kx-1 >= 0 && ky-1 >= 0 ) {
            openCell( index-w-1 );
        }
        if ( ky-1 >= 0 ) {
            openCell( index-w );
        }
        if ( kx+1 <= (w-1) && ky-1 >= 0 ) {
            openCell( index-w+1 );
        }
        if ( kx-1 >= 0 ) {
            openCell( index-1 );
        }
        if ( kx+1 <= (w-1) ) {
            openCell( index+1 );
        }
        if ( kx-1 >= 0 && ky+1 <= (h-1) ) {
            openCell( index+w-1 );
        }
        if ( ky+1 <= (h-1) ) {
            openCell( index+w );
        }
        if ( kx+1 <= (w-1) && ky+1 <= (h-1) ) {
            openCell( index+w+1 );
        }
    }
    return;
}

function gameOver() {
    console.log('GAME OVER... :\'(');
    // pakeisti zaidimo statusa i "game_over"
    game_settings.status = 'game_over';

    // prideti klase .game-over
    $('.game').addClass('game-over');

    // sustabdyti laikrodi
    clearInterval(myTimer);

    // parodyti visas bombas
    var bomb_count = game_settings.mines.list.length;
    for ( var i=0; i<bomb_count; i++ ) {
        $('.game > .field > .cell').eq(game_settings.mines.list[i]).text('💣');
    }

    return;
}

function resetGame() {
    // grazinti smile face
    $('.game').removeClass('game-over');

    // nunulinti laikrodi
    game_settings.clock.current_time = 1;
    $('.game > .header > #clock').text('000');

    // isvalyti bombas
    // .cell.open pakeisti i .cell
    $('.game > .field > .cell').text('').removeClass('open');

    // atstatyti bombu skaiciaus skaitikli
    $('.game > .header > #mines').text( countBombsForCurrentGame() );
    return;
}



