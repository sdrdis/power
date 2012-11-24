Game = new new Class({
    initialize: function() {
        this.players = [];
        this.map = null;
    },
    createPlayers: function(playerCount) {
        this.map = new Map();
        var starting_positions = {
            1: {x: 0, y: 0},
            2: {x: 0, y: this.map.height - 1},
            3: {x: this.map.width - 1, y: 0},
            4: {x: this.map.width - 1, y: this.map.height - 1}
        };
        for (var i=1; i<=playerCount ; i++) {
            var player = new Player(i, 'Player ' + i, starting_positions[i]);
            this.players.push(player);
        }
    },
    createStartingUnits : function() {
        this.players.forEach(function(player) {
            player.createUnit('Soldier');
            player.createUnit('Soldier');
            player.createUnit('Tank');
            player.createUnit('Tank');
            player.createUnit('JetFighter');
            player.createUnit('JetFighter');
            player.createUnit('Destroyer');
            player.createUnit('Destroyer');
        });
    },
    getUnitsOnMap: function() {
        var result = [];
        var self = this;
        this.map.grid.forEach(function(row, y) {
            row.forEach(function(cell, x) {
                var position = {x: x, y: y};
                var units = self.getUnitsOnCell(position);
                if (units.length > 0) {
                    result.push({
                       position : position,
                       units : units
                    });
                }
            });
        });
        return result;
    },
    getUnitsOnCell: function(position) {
        var units = [];
        this.players.forEach(function(player) {
            player.units.forEach(function(unit) {
                if (unit.position.x == position.x && unit.position.y == position.y) {
                    units.push(unit);
                }
            });
        });
        return units;
    },
    nextRound: function() {
        this.players.forEach(function(player) {
            player.resolvePlanifications();
        });
    }
});
