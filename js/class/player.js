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
        this.removeConflictingPlanifications();
    },
    cancelPlanification: function(index) {
        this.planifications.splice(index, i);
        this.removeConflictingPlanifications();
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

    // FUSION
    planifyFusion : function(unit) {
        this.addPlanification(new PlanificationFusion(unit));
    },

    // MISSILE
    planifyMissile : function(position, units) {
        this.addPlanification(new PlanificationMissile(position, units));
    },

    // BUY
    planifyBuy : function(unitType) {
        this.addPlanification(new PlanificationBuy(unitType));
    },

    getUnitsLeavingCell : function(position) {
        var units = [];
        this.planifications.forEach(function(p) {
            if (instanceOf(p, PlanificationMove) && p.unit.position.x == position.x && p.unit.position.y == position.y) {
                units.push(p.unit);
            }
            if (instanceOf(p, PlanificationFusion) || instanceOf(p, PlanificationMissile)) {
                p.involved.forEach(function(unit) {
                    units.push(unit);
                });
            }
        });
        return units;
    },

    getUnitsIncomingCell : function(position) {
        var units = [];
        this.planifications.forEach(function(p) {
            if (instanceOf(p, PlanificationMove) && p.where.x == position.x && p.where.y == position.y) {
                units.push(p.unit);
            }
        });
        return units;
    },

    getUnitsAvailableOnCell : function(position) {
        var units = this.getUnitsOnCellByState(position);
        return units.staying.combine(units.incoming);
    },

    getUnitsOnCellByState: function(position) {
        var leaving = this.getUnitsLeavingCell(position);
        var incoming = this.getUnitsIncomingCell(position);
        var movingIds = [];
        leaving.forEach(function(unit) {
            movingIds.push(unit.id);
        });
        incoming.forEach(function(unit) {
            movingIds.push(unit.id);
        });
        var self = this;
        var staying = [];
        this.units.forEach(function(unit) {
            if (unit.position.x == position.x && unit.position.y == position.y) {
                staying.push(unit);
            }
        });
        return {
            'staying' : staying,
            'incoming' : incoming,
            'leaving' : leaving
        };
    }
});














