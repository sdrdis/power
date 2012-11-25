Assault = new Class({
    Extends: GroundUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'Assault';
        this.power = 30;
        this.movement = 3;
    }
});
