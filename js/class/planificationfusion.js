PlanificationFusion = new Class({
    Extends: Planification,
    initialize: function(unit) {
        this.parent();
        this.unit = unit;
    },
    isAuthorised: function() {
        var fusionType = this.unit.type;
        var remaining = 3; // How many units of the same type we need for the fusion
        this.involved = [];
        var units = this.player.getUnitsAvailableOnCell(this.unit.position);
        var self = this;

        units.forEach(function(unit) {
            if (unit.type == fusionType && remaining > 0) {
                remaining--;
                self.involved.push(unit);
            }
        });
        return remaining == 0;
    },
    resolve: function() {
        var fusionPosition = this.unit.position;
        var evolution = this.unit.evolution;

        this.involved.forEach(function(unit) {
            unit.remove();
        });
        this.player.createUnit(evolution, fusionPosition);
    },
    isInvolved : function(unit) {
        // @todo
        return false;
    }
});
