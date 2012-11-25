Tank = new Class({
    Extends: GroundUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'Tank';
        this.power = 3;
        this.movement = 3;
        this.evolution = 'Assault';
    }
});
Tank.cost = 3;
