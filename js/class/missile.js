Missile = new Class({
    Extends: Unit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'Missile';
        this.category = 'ground';
        this.power = 1000;
        this.movement = 10;
    }
});
