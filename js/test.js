
$(document).ready(function() {
    Game.start(4);

    $('.game').power({
        game: Game
    });

//    Game.players[0].units[0].moveTo({x: 1, y: 1});
//    $('.game').power('refresh');

//    console.log('Unit 0#4 can move to 3,3?', Game.players[0].units[4].canMove({x:3, y:3}));
//    console.log('player[0].units.length', Game.players[0].units.length);
//    Game.players[0].units[3].remove();
//    console.log('player[0].units.length', Game.players[0].units.length);

    console.log('test -> ', Game.players[2].units[2].moveTo({x: 7, y: 1}))

    $('.game').power('refresh');
    console.log('test -> ', Game.players[2].units[2].moveTo({x: 8, y: 4}))

    $('.game').power('refresh');
    console.log('test -> ', Game.players[2].units[2].moveTo({x: 7, y: 6}))
    
    var tank = Game.players[2].units[2];
    console.log('---------------------------------');
    console.log(tank._isCellInsideRoom(tank.position, {x1:4, y1:4, x2:8, y2:8}));
    console.log(tank._isCellInsideRoom({x: 7, y: 6}, {x1:4, y1:4, x2:8, y2:8}));

    $('.game').power('refresh');
});