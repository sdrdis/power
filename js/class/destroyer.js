Destroyer = new Class({
    Extends: NavalUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'destroyer';
        this.power = 10;
        this.movement = 1;
        this.evolution = 'BattleCruiser';
    }
});
Destroyer.cost = 10;