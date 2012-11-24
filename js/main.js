$(document).ready(function() {
    Game.start(4);

    $('.game').power({
        game: Game
    });
});