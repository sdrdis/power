Unit = new Class({
    initialize: function(position){
        this.position = position;
    },
    canMove: function(new_position) {
        var path = AStar(Map.grid, [this.position.x, this.position.y], [new_position.x, new_position.y], 'DiagonalFree');
        return this.movement < path.length;
    },
    move: function(new_position) {
        if (!this.canMove(new_position)) {
            return false;
        }
        this.position = new_position;
        return true;
    }
});
