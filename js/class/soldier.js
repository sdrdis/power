Soldier = new Class({
    Extends: GroundUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'Soldier';
        this.power = 2;
        this.movement = 2;
        this.evolution = 'Regiment';
    }
});
Soldier.cost = 2;
