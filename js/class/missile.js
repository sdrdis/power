Missile = new Class({
    Extends: Unit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'missile';
        this.power = 1000;
        this.movement = 0;
    }
});
