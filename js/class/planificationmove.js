PlanificationMove = new Class({
    Extends: Planification,
    initialize: function(unit, where) {
        this.parent();
        this.type = 'Move';
        this.unit = unit;
        this.where = where;
    },
    isAuthorised: function() {
        return !this.player.isFusionning(this.unit) && this.unit.canMove(this.where);
    },
    resolve: function() {
        this.unit.moveTo(this.where);
        this.unit.has_moved = true;
    }
});
