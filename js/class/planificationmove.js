PlanificationMove = new Class({
    Extends: Planification,
    initialize: function(unit, where) {
        this.unit = unit;
        this.where = where;
    },
    isAuthorised: function() {
        return this.unit.canMove(this.where);
    },
    checkDuplicate : function(against) {
        return instanceOf(against, PlanificationMove) && this.unit.id == against.unit.id;
    },
    resolve: function() {
        this.unit.moveTo(this.where);
    }
});
