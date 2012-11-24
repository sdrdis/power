JetFighter = new Class({
    Extends: Unit,
    initialize: function(map, position) {
        this.parent(map, position);
        this.type = 'flying';
        this.power = 5;
        this.movement = 5;
    }
});
