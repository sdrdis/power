Soldier = new Class({
    Extends: Unit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'soldier';
        this.category = 'ground';
        this.power = 2;
        this.movement = 2;
    }
});
