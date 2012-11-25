Regiment = new Class({
    Extends: GroundUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'Regiment';
        this.power = 20;
        this.movement = 2;
    }
});
