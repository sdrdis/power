NavalUnit = new Class({
    Extends: Unit,
    initialize: function(position){
        this.parent(position);
        this.category = 'naval';
    },
    distanceTo: function(new_position) {
        // Sea cells are wider, we need some extra checks since our base algo uses a grid
        if ([0,4,8].contains(this.position.x) && new_position.x == this.position.x && Math.abs(new_position.y - this.position.y) == 2) {
            return 1;
        }
        if ([0,4,8].contains(this.position.y) && new_position.y == this.position.y && Math.abs(new_position.x - this.position.x) == 2) {
            return 1;
        }
        return this.parent(new_position);
    }
});
