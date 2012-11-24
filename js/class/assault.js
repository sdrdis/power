Assault = new Class({
    Extends: GroundUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'assault';
        this.power = 30;
        this.movement = 3;
    }
});
