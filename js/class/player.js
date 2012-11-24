Player = new Class({
    initialize : function(id, name, hq){
        this.id = id;
        this.name = name;
        this.hq = hq;
        this.units = [];
        this.actions = [];
        this.coins = 0;
        this.planifications = [];
    },
    createUnit : function(name, position) {
        var unit = new window[name](position || this.hq);
        unit.player = this;
        this.units.push(unit);
    },
    canPlanify : function() {
        return this.planifications.length >= 5;
    },
    planifyMove : function(unit, where) {
        if (!this.canPlanify() || !this.canMove(unit, where)) {
            return false;
        }
        this.planifications.push(['move', unit, where]);
        return true;
    },
    planifyFusion : function(unit) {
        if (!this.canPlanify() || !this.canFusion(unit)) {
            return false;
        }
        this.planifications.push(['fusion', unit]);
        return true;
    },
    planifyMissile : function(units) {
        if (!this.canPlanify() || !this.canMissile(unit)) {
            return false;
        }
        this.planifications.push(['missile', units]);
        return true;
    },
    planifyBuy : function(unitType) {
        if (!this.canPlanify() || !this.canBuy(unitType)) {
            return false;
        }
        this.planifications.push(['buy', unitType]);
        return true;
    },
    resolvePlanifications : function() {
        this.planifications.forEach(function(planification) {
            var action = planification.shift();
            this[action].apply(this, planification);
        });
        this.planifications = [];
    },
    resolveMove : function(unit, new_position) {
        return unit.move(new_position);
    },
    resolveFusion : function(unitFusion) {
        if (!this.canFusion(unit)) {
            return false;
        }
        
        var fusionPosition = unitFusion.position;
        var fusionType = unitFusion.type;
        var evolution = unit.evolution;
        
        var units = Game.getUnitsOnCell(fusionPosition);
        var remaining = 3;

        units.forEach(function(unit) {
            if (unit.type == fusionType && remaining > 0) {
                remaining--;
                unit.remove();
            }
        });
        this.createUnit(evolution, fusionPosition);
        return true;
    },
    resolveMissile : function(units) {
        if (!this.canMissile(units)) {
            return false;
        }

        var fusionPosition = units[0].position;
        var remaining = 100;

        units.forEach(function(unit) {
            if (remaining > 0) {
                remaining -= unit.power;
                unit.remove();
            }
        });
        this.createUnit('Missile', fusionPosition);
        return true;
    },
    resolveBuy : function(unitType) {
        if (!this.canBuy(unitType)) {
            return false;
        }

        var unit = this.createUnit(unitType, this.hq);
        this.gold -= unitType['cost'];
        return true;
    }
});














