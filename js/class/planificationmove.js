PlanificationMove = new Class({
    Extends: Planification,
    initialize: function(unit, where) {
        this.unit = unit;
        this.where = where;
    },
    isAuthorised: function() {

        if (!this.unit.canMove(this.where)) {
            return false;
        }
        var involvedInFusion = false
        var self = this;
        this.player.planifications.forEach(function(p) {
            if (instanceOf(p, PlanificationFusion) && p.isInvolved(self.unit)) {
                involvedInFusion = true;
            }
            if (instanceOf(p, PlanificationMissile) && p.isInvolved(self.unit)) {
                involvedInFusion = true;
            }
        });
        return !involvedInFusion;
    },
    resolve: function() {
        this.unit.moveTo(this.where);
    }
});
