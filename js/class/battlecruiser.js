BattleCruiser = new Class({
    Extends: NavalUnit,
    initialize: function(position) {
        this.parent(position);
        this.type = 'battlecruiser';
        this.power = 50;
        this.movement = 1;
    }
});
