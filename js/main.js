$(document).ready(function() {
    Game.createPlayers(4);
    Game.createStartingUnits();

    $('.game').power({
        game: Game
    });
});