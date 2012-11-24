Unit = new Class({
    initialize : function(position){
        this.position = position;
        this.id = String.uniqueID();
    },
    canMove : function(new_position) {
        var distance = this.distanceTo(new_position);
        return distance == -1 ? false : distance <= this.movement;
    },
    distanceTo : function(new_position) {
        var path = AStar(Game.map.grid, [this.position.x, this.position.y], [new_position.x, new_position.y], 'DiagonalFree');
        return path.length == 0 ? -1 : path.length - 1;
    },
    moveTo : function(new_position) {
        if (!this.canMove(new_position)) {
            return false;
        }
        this.position = new_position;
        return true;
    },
    remove : function() {
        var uniqueID = this.id;
        var player = this.player;
        player.units.forEach(function(unit, i) {
            if (unit.id == uniqueID) {
                player.units.splice(i, 1);
            }
        });
    }
});
