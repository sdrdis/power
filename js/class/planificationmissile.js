PlanificationMissile = new Class({
    Extends: Planification,
    initialize: function(position, units) {
        this.parent();
        this.position = position;
        this.units = units;
    },
    isAuthorised: function() {
        var neededPower = 100;
        this.involved = [];

        var authorisedIds = [];
        this.getUnitsAvailableOnCell(this.position).forEach(function(unit) {
            authorisedIds.push(unit.id);
        });
        
        this.units.forEach(function(unit) {
            if (neededPower > 0 && authorisedIds.contains(unit.id)) {
                neededPower -= unit.power;
                this.involved.push(unit.id);
            }
        });
        return neededPower <= 0;
    },
    resolve: function() {
        var fusionPosition = this.units[0].position;
        //var neededPower = 100;

        this.involved.forEach(function(unit) {
            //if (neededPower > 0) {
            //    neededPower -= unit.power;
            unit.remove();
            //}
        });
        this.player.createUnit('Missile', fusionPosition);
    },
    isInvolved : function(unit) {
        // @todo
        return false;
    }
});
