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
        return unit;
    },
    canPlanify : function() {
        return this.planifications.length < 5;
    },
    resolvePlanifications : function() {
        var self = this;
        this.planifications.forEach(function(planification) {
            var action = planification.shift();
            self[action].apply(self, planification);
        });
        this.planifications = [];
    },

    // MOVE
    canMove: function(unit, where) {
        // @todo check whether the unit has already moved in a previous planifications
        return unit.canMove(where);
    },
    planifyMove : function(unit, where) {
        if (!this.canPlanify() || !this.canMove(unit, where)) {
            console.log("Can't move", !this.canPlanify(), !this.canMove(unit, where))
            return false;
        }
        this.planifications.push(['resolveMove', unit, where]);
        return true;
    },
    resolveMove : function(unit, where) {
        return unit.moveTo(where);
    },

    // FUSION
    canFusion: function(unit) {

        var fusionType = unit.type;
        // @todo retrieve units position after planifications
        var units = Game.getUnitsOnCell(unit.position);
        var remaining = 3; // How many units of the same type we need for the fusion

        units.forEach(function(unit) {
            if (unit.type == fusionType && remaining > 0) {
                remaining--;
            }
        });
        return remaining == 0;
    },
    planifyFusion : function(unit) {
        if (!this.canPlanify() || !this.canFusion(unit)) {
            return false;
        }
        this.planifications.push(['resolveFusion', unit]);
        return true;
    },
    resolveFusion : function(unit) {
        var fusionPosition = unit.position;
        var fusionType = unit.type;
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

    // MISSILE
    canMegaMissile: function(units) {

        // @todo Check all units have the same position (including the previous planifications)
        // @todo Check if unit has moved or have arrived
        var neededPower = 100;
        units.forEach(function(unit) {
            if (neededPower > 0) {
                neededPower -= unit.power;
            }
        });
        return neededPower <= 0;
    },
    planifyMissile : function(units) {
        if (!this.canPlanify() || !this.canMissile(units)) {
            return false;
        }
        this.planifications.push(['resolveMissile', units]);
        return true;
    },
    resolveMissile : function(units) {
        var fusionPosition = units[0].position;
        var neededPower = 100;

        units.forEach(function(unit) {
            if (neededPower > 0) {
                neededPower -= unit.power;
                unit.remove();
            }
        });
        this.createUnit('Missile', fusionPosition);
        return true;
    },

    // BUY
    canBuy: function(unitType) {
        var availableGold = this.gold;
        // Check previous buyings
        this.planifications.foreach(function(planification) {
            if (planification[0] == 'buy') {
                availableGold -= window[planification[1]]['cost'];
            }
        });
        return window[unitType]['cost'] <= availableGold;
    },
    planifyBuy : function(unitType) {
        if (!this.canPlanify() || !this.canBuy(unitType)) {
            return false;
        }
        this.planifications.push(['resolveBuy', unitType]);
        return true;
    },
    resolveBuy : function(unitType) {
        this.createUnit(unitType, this.hq);
        this.gold -= window[unitType]['cost'];
        return true;
    }
});














