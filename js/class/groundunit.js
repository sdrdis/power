GroundUnit = new Class({
    Extends: Unit,
    initialize: function(position){
        this.parent(position);
        this.category = 'ground';
    },
    canMove: function(new_position) {
        // Ground unit can't move outside of their current area (room)
        if (!this.checkRooms(this.position, new_position)) {
            return false;
        }
        return this.parent(new_position);
    },

    // Ground units cannot move out of each rooms
    checkRooms: function(old_position, new_position) {
        var rooms = [
            {x1:0, y1:0, x2:4, y2:4},
            {x1:4, y1:0, x2:8, y2:4},
            {x1:0, y1:4, x2:4, y2:8},
            {x1:4, y1:4, x2:8, y2:8}
        ];
        
        var authorised = false;
        rooms.forEach(function(room) {
            if (Game.isCellInsideRoom(old_position, room) && Game.isCellInsideRoom(new_position, room)) {
                authorised = true;
            }
        });
        return authorised;
    }
});
