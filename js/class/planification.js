Planification = new Class({
    duplicateIndex: function() {
        for (var i=0 ; i<this.player.planifications.length ; i++) {
            if (this.checkDuplicate(this.player.planifications[i])) {
                return i;
            }
        }
        return -1;
    },
    checkDuplicate : function(against) {
        return false;
    }
});
