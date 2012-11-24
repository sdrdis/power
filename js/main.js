function _(str) {
    return str;
}

$(document).ready(function() {
    Game.start(4);

    $('.game').power({
        game: Game
    });
});