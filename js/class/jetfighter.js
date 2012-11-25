JetFighter = new Class({
    Extends: FlyingUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'JetFighter';
        this.power = 5;
        this.movement = 5;
        this.evolution = 'JetBomber';
    }
});
JetFighter.cost = 5;
