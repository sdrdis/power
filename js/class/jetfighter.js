JetFighter = new Class({
    Extends: FlyingUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'jetfighter';
        this.power = 5;
        this.movement = 5;
    }
});
