Player = new Class({
    initialize : function(id, name, hq) {
        this.id = id;
        this.name = name;
        this.hq = hq;
        this.units = [];
        this.actions = [];
        this.gold = 0;
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
    addPlanification: function(planification) {
        planification.player = this;
        // No conflict : can't add more than 5 notifications
        if (!this.canPlanify() || !planification.isAuthorised()) {
            return false;
        }
        this.planifications.push(planification);
    },
    replacePlanification: function(index, planification) {
        planification.player = this;
        this.planifications.splice(index, 1, planification);
    },
    cancelPlanification: function(index) {
        this.planifications.splice(index, 1);
    },
    resolvePlanifications : function() {
        this.planifications.forEach(function(planification) {
            planification.resolve();
        });
        this.planifications = [];
    },

    // MOVE
    planifyMove : function(unit, where) {
        var planification = new PlanificationMove(unit, where);
        var conflicting = -1;
        // Search if a move is already planned for this unit
        for (var i=0 ; i<this.planifications.length ; i++) {
            var existing = this.planifications[i];
            if (instanceOf(existing, PlanificationMove) && existing.unit.id == unit.id) {
                conflicting = i;
            }
        }
        if (conflicting >= 0) {
            // Cancel if destination is the current position
            if (unit.position.x == where.x && unit.position.y == where.y) {
                this.cancelPlanification(conflicting);
            } else {
                this.replacePlanification(conflicting, planification);
            }
        } else {
            this.addPlanification(planification);
        }
    },
    planifyFusion : function(position, units) {
        this.addPlanification(new PlanificationFusion(position, units));
    },
    planifyMissile : function(position, units) {
        this.addPlanification(new PlanificationMissile(position, units));
    },
    planifyBuy : function(unitType) {
        this.addPlanification(new PlanificationBuy(unitType));
    },

    getUnitsStayingCell : function(cell) {
        var staying = [];
        var self = this;
        this.units.forEach(function(unit) {
            var start = unit.position;
            if (start.x == cell.x && start.y == cell.y && !self.isMoving(unit)) {
                staying.push(unit);
            }
        });
        return staying;
    },
    getUnitsLeavingCell : function(cell) {
        var leaving = [];
        var self = this;
        this.units.forEach(function(unit) {
            var start = unit.position;
            if (start.x == cell.x && start.y == cell.y && self.isMoving(unit)) {
                leaving.push(unit);
            }
        });
        return leaving;
    },
    getUnitsIncomingCell : function(cell) {
        var incoming = [];
        var self = this;
        this.units.forEach(function(unit) {
            var destination = self.getUnitPositionAfterPlanification();
            if (destination.x == cell.x && destination.y == cell.y && self.isMoving(unit)) {
                incoming.push(unit);
            }
        });
        return incoming;
    },
    getUnitsFusionningCell : function(cell) {
        var fusionning = [];
        var self = this;
        this.units.forEach(function(unit) {
            var destination = self.getUnitPositionAfterPlanification();
            if (destination.x == cell.x && destination.y == cell.y && self.isFusionning(unit)) {
                fusionning.push(unit);
            }
        });
        return fusionning;
    },
    getUnitsOnCellByState: function(position) {
        var states = {
            'staying' : this.getUnitsStayingCell(position),
            'incoming' : this.getUnitsIncomingCell(position),
            'leaving' : this.getUnitsLeavingCell(position),
            'fusionning' : this.getUnitsFusionningCell(position)
        };
    },
    getUnitPositionAfterPlanification : function(unit) {
        var destination = unit.position;
        this.planifications.forEach(function(plan) {
            if (instanceOf(plan, Planificationmove) && plan.unit.id == unit.id) {
                destination = plan.where;
            }
        });
        return destination;
    },
    
    isMoving : function(unit) {
        var start = unit.position;
        var destination = unit.getUnitPositionAfterPlanification();
        return start.x != destination.x || start.y != destination.y;
    },
    
    isFusionning : function(unit) {
        var fusionning = false;
        this.player.planifications.forEach(function(p) {
            if (instanceOf(p, PlanificationFusion) && p.isInvolved(unit)) {
                fusionning = true;
            }
            if (instanceOf(p, PlanificationMissile) && p.isInvolved(unit)) {
                fusionning = true;
            }
        });
        return fusionning;
    },

    getAvailableGold: function() {
        var availableGold = this.gold;
        
        var buyingPlanifications = this.getBuyingPlanifications();
        buyingPlanifications.forEach(function(buyingPlanification) {
        	availableGold -= window[buyingPlanification.unitType].cost;
        });
        
        return availableGold;
    },
    
    getBuyingPlanifications: function() {
    	var planifications = [];
    	this.planifications.forEach(function(planification) {
            if (instanceOf(planification, PlanificationBuy)) {
            	planifications.push(planification);
            }
        });
    	return planifications;
    }
});














