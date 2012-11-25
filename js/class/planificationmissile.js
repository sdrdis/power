PlanificationMissile = new Class({
    Extends: Planification,
    initialize: function(position, involvedUnits) {
        this.parent();
        this.position = position;
        this.c = involvedUnits;
    },
    isAuthorised: function() {
        var neededPower = 100;
        var self = this;
        this.involvedUnits.forEach(function(unit) {
            var destination = self.player.getUnitPositionAfterPlanification(unit);
            if (destination.x == self.position.x && destination.y == self.position.y) {
                neededPower -= unit.power;
            }
        });
        return neededPower <= 0;
    },
    resolve: function() {
        this.involved.forEach(function(unit) {
            unit.remove();
        });
        this.player.createUnit('Missile', this.position);
    },
    isInvolved : function(unit) {
        var isInvolved = false;
        this.involvedUnits.forEach(function(involved) {
            if (unit.id == involved.id) {
                isInvolved = true;
            }
        });
        return isInvolved;
    }
});
