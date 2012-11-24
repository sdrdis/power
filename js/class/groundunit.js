GroundUnit = new Class({
    Extends: Unit,
    initialize: function(position){
        this.parent(position);
        this.category = 'ground';
    },
    canMove: function(new_position) {
        if (!this.checkRooms(this.position ,new_position)) {
            return false;
        }
        return this.parent.canMove(new_position);
    },

    // Ground units cannot move out of each rooms
    checkRooms: function(old_position, new_position) {
        var rooms = [
            [{x:0, y:0}, {x:4, y:4}],
            [{x:4, y:0}, {x:8, y:4}],
            [{x:0, y:4}, {x:4, y:8}],
            [{x:4, y:4}, {x:8, y:8}]
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
