Regiment = new Class({
    Extends: GroundUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'regiment';
        this.power = 20;
        this.movement = 2;
    }
});
