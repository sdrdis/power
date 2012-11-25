PlanificationBuy = new Class({
    Extends: Planification,
    initialize: function(unitType) {
        this.unitType = unitType;
    },
    isAuthorised: function() {
        var availableGold = this.player.gold;
        // Check previous buyings
        this.player.planifications.forEach(function(planification) {
            if (planification[0] == 'buy') {
                availableGold -= window[planification[1]]['cost'];
            }
        });
        return window[this.unitType]['cost'] <= availableGold;
    },
    resolve: function() {
        this.player.createUnit(this.unitType);
        this.player.gold -= window[this.unitType]['cost'];
    }
});
