$(document).ready(function() {
    Game.createPlayers(4);
    Game.createStartingUnits();
    $('.game').power({
        game: Game
    });

//    Game.players[0].units[0].moveTo({x: 1, y: 1});
//    $('.game').power('refresh');

//    console.log('Unit 0#4 can move to 3,3?', Game.players[0].units[4].canMove({x:3, y:3}));
//    console.log('player[0].units.length', Game.players[0].units.length);
//    Game.players[0].units[3].remove();
//    console.log('player[0].units.length', Game.players[0].units.length);
});