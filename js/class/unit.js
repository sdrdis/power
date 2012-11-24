Unit = new Class({
    initialize : function(position){
        this.position = position;
        this.id = String.uniqueID();
    },
    canMove : function(new_position) {
        var path = AStar(Game.map.grid, [this.position.x, this.position.y], [new_position.x, new_position.y], 'DiagonalFree');
        return path.length - 1 <= this.movement;
    },
    move : function(new_position) {
        if (!this.canMove(new_position)) {
            return false;
        }
        this.position = new_position;
        return true;
    },
    remove : function() {

    }
});
