Unit = new Class({
    initialize: function(position){
        this.position = position;
        this.id = Unit.getNewId();
    },
    canMove: function(new_position) {
        var path = AStar(Map.grid, [this.position.x, this.position.y], [new_position.x, new_position.y], 'DiagonalFree');
        return this.movement < path.length;
    }
});

Unit._internalId = 0;
Unit.getNewId = function() {
    Unit._internalId++;
    return Unit._internalId;
};
