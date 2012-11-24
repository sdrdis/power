JetBomber = new Class({
    Extends: FlyingUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'jetbomber';
        this.power = 25;
        this.movement = 5;
    }
});
