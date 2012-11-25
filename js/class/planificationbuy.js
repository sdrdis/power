PlanificationBuy = new Class({
    Extends: Planification,
    initialize: function(unitType) {
        this.parent();
        this.unitType = unitType;
    },
    isAuthorised: function() {
        return window[this.unitType]['cost'] <= this.player.getAvailableGold();
    },
    resolve: function() {
        this.player.createUnit(this.unitType);
        this.player.gold -= window[this.unitType]['cost'];
    }
});
