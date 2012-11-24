Regiment = new Class({
    Extends: Unit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'ground';
        this.power = 20;
        this.movement = 2;
    }
});
