Regiment = new Class({
    Extends: Unit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'regiment';
        this.category = 'ground';
        this.power = 20;
        this.movement = 2;
    }
});
