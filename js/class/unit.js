Unit = new Class({
    initialize: function(position){
        this.position = position;
        this.id = Unit.getNewId();
    },
    canMove: function(new_position) {

        if (this.type == 'naval') {
            return true;
        }
        
        if (this.type == 'ground') {
            if (!this.checkRooms(this.position ,this.new_position)) {
                return false;
            }
        }

        if (this.type == 'ground' || this.type == 'flying') {
            var path = AStar(Map.grid, [this.position.x, this.position.y], [new_position.x, new_position.y], 'DiagonalFree');
            return this.movement < path.length;
        }

    },

    // Ground units cannot move out of each rooms
    checkRooms: function(old_position, new_position) {
        var rooms = [
            [{x:0, y:0}, {x:0, y:4}],
            [{x:0, y:4}, {x:4, y:8}],
            [{x:4, y:8}, {x:8, y:4}],
            [{x:4, y:8}, {x:8, y:8}]
        ];

        for (var i=0; i<rooms.length ; i++) {
            var room = rooms[i];
            if (this._isCellInsideRoom(old_position, room)) {
                return this._isCellInsideRoom(new_position, room);
            }
        }
        return true;
    },

    _isCellInsideRoom: function(cell, room) {
        return cell.x >= room[0].x && cell.x <= room[1].x && cell.y >= room[0].y && cell.y <= room[1].y;
    }
});

Unit._internalId = 0;
Unit.getNewId = function() {
    Unit._internalId++;
    return Unit._internalId;
};
