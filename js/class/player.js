Player = new Class({
    initialize : function(id, name, hq) {
        this.id = id;
        this.name = name;
        this.hq = hq;
        this.units = [];
        this.actions = [];
        this.gold = 0;
        this.planifications = [];
        this.gameOver = false;
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
        if (!planification.isAuthorised()) {
            this.cancelPlanification(index);
        } else {
            this.planifications.splice(index, 1, planification);
        }
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
            if (existing.type == 'Move' && existing.unit.id == unit.id) {
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
    canFusion: function(position, units) {
    	if (units.length == 0) {
    		return false;
    	}
    	var planification = new PlanificationFusion(position, units);
    	planification.player = this;
    	return planification.isAuthorised();
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
            var destination = self.getUnitPositionAfterPlanification(unit);
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
            if (plan.type == 'Move' && plan.unit.id == unit.id) {
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
        this.planifications.forEach(function(p) {
            if (p.type == 'Fusion' && p.isInvolved(unit)) {
                fusionning = true;
            }
            if (p.type == 'Missile' && p.isInvolved(unit)) {
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
            if (planification.type == 'Buy') {
            	planifications.push(planification);
            }
        });
    	return planifications;
    }
});














