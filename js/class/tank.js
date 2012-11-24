Tank = new Class({
    Extends: Unit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'tank';
        this.category = 'ground';
        this.power = 3;
        this.movement = 3;
    }
});
