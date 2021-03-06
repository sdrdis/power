Unit = new Class({
    initialize : function(position){
        this.position = position;
        this.id = String.uniqueID();
        this.hasMoved = false;
    },
    canMove : function(new_position) {
        var distance = this.distanceTo(new_position);
        return distance == -1 ? false : distance <= this.movement;
    },
    distanceTo : function(new_position) {
        var path = AStar(this.getCollisionMap(), [this.position.x, this.position.y], [new_position.x, new_position.y], this.getAlgorithm(new_position));
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
    },
    getCollisionMap : function() {
        if (this.category == 'ground' || this.category == 'flying') {
            return [
                [0,1,1,1,0,1,1,1,0],
                [1,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,0,0,0,1],
                [0,1,1,1,0,1,1,1,0],
                [1,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,0,0,0,1],
                [1,0,0,0,1,0,0,0,1],
                [0,1,1,1,0,1,1,1,0]
            ];
        } else if (this.category == 'naval') {
            return [
                [0,1,0,1,0,1,0,1,0],
                [1,0,0,0,1,0,0,0,1],
                [0,0,1,0,0,0,1,0,0],
                [1,0,0,0,1,0,0,0,1],
                [0,1,0,1,0,1,0,1,0],
                [1,0,0,0,1,0,0,0,1],
                [0,0,1,0,0,0,1,0,0],
                [1,0,0,0,1,0,0,0,1],
                [0,1,0,1,0,1,0,1,0],
            ];
        }
    },
    getAlgorithm : function(new_position) {
        if (this.category != 'naval') {
            return 'DiagonalFree';
        }
        if ([0,4,8].contains(this.position.x) || [0,4,8].contains(this.position.y)) {
            return 'DiagonalFree';
        }
        if ([0,4,8].contains(new_position.x) || [0,4,8].contains(new_position.y)) {
            return 'DiagonalFree';
        }
        return 'Manhattan';
    }
});
