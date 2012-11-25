Planification = new Class({
    initialize: function() {
        this.id = String.uniqueID();
    },
    cancel : function() {
        var uniqueID = this.id;
        var player = this.player;
        player.planifications.forEach(function(plan, i) {
            if (plan.id == uniqueID) {
                player.planifications.splice(i, 1);
            }
        });
    }
});
