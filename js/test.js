
$(document).ready(function() {

    Game.createPlayers(1);
    var player_1 = Game.players[0];
    var soldier_1 = player_1.createUnit('Soldier');
    var soldier_2 = player_1.createUnit('Soldier');
    var soldier_3 = player_1.createUnit('Soldier');
    var soldier_4 = player_1.createUnit('Soldier');

    player_1.planifyFusion(soldier_1);
    player_1.planifyMove(soldier_1, {x: 1, y: 1});
    player_1.planifyMove(soldier_2, {x: 2, y: 2});
    player_1.resolvePlanifications();

    console.log(player_1.units);

    $('.game').power({
        game: Game
    });

    $('.game').power('refresh');

    return;

    console.log('Unit 0#6 can move to 1,1?', Game.players[0].units[6].canMove({x:1, y:1}));

    console.log(Game.players[0].planifyMove(Game.players[0].units[7], {x: 2, y: 0}));
    console.log(Game.players[0].planifyMove(Game.players[0].units[4], {x: 6, y: 5}));
    console.log(Game.players[0].planifyMove(Game.players[0].units[5], {x: 5, y: 3}));
    console.log(Game.players[0].planifyMove(Game.players[0].units[0], {x: 2, y: 2}));
    console.log(Game.players[0].planifyMove(Game.players[0].units[1], {x: 2, y: 2}));
    console.log(Game.players[0].planifyMove(Game.players[0].units[2], {x: 2, y: 2}));
    console.log(Game.players[0].planifyMove(Game.players[0].units[3], {x: 2, y: 2}));
    console.log(Game.players[0].resolvePlanifications());




    console.log('Unit 0#4 can move to 3,3?', Game.players[0].units[4].canMove({x:3, y:3}));
    console.log('player[0].units.length', Game.players[0].units.length);
    Game.players[0].units[3].remove();
    console.log('player[0].units.length', Game.players[0].units.length);

    $('.game').power('refresh');

    return;

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