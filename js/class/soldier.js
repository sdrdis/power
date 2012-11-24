Soldier = new Class({
    Extends: GroundUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'soldier';
        this.power = 2;
        this.movement = 2;
    }
});
