PlanificationFusion = new Class({
    Extends: Planification,
    initialize: function(position, involvedUnits) {
        this.parent();
        this.type = 'Fusion';
        this.position = position;
        this.involvedUnits = involvedUnits;
    },
    isAuthorised: function() {
        if (typeof this.involvedUnits[0].evolution == 'undefined') {
            return false;
        }
        var fusionType = this.involvedUnits[0].type;
        var remaining = 3; // How many units of the same type we need for the fusion
        var self = this;
        
        this.involvedUnits.forEach(function(unit) {
            var destination = self.player.getUnitPositionAfterPlanification(unit);
            if (!self.player.isFusionning(unit) && unit.type == fusionType && destination.x == self.position.x && destination.y == self.position.y) {
                remaining--;
            }
        });
        return remaining <= 0;
    },
    resolve: function() {
        var evolution = this.involvedUnits[0].evolution;

        this.involvedUnits.forEach(function(unit) {
            unit.remove();
        });
        this.player.createUnit(evolution, this.position);
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
