PlanificationMove = new Class({
    Extends: Planification,
    initialize: function(unit, where) {
        this.unit = unit;
        this.where = where;
    },
    isAuthorised: function() {
        return this.unit.canMove(this.where);
    },
    resolve: function() {
        this.unit.moveTo(this.where);
    }
});
