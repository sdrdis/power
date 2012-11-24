JetFighter = new Class({
    Extends: Unit,
    initialize: function(map, position) {
        this.parent(map, position);
        this.type = 'jetfighter';
        this.category = 'flying';
        this.power = 5;
        this.movement = 5;
    }
});
