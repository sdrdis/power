Game = new new Class({
    initialize: function() {
        this.players = [];
        this.map = null;
    },
    createPlayers: function(playerCount) {
        this.map = new Map();
        var starting_positions = {
            1: {x: 0, y: 0},
            2: {x: 0, y: 8},
            3: {x: 8, y: 0},
            4: {x: 8, y: 8}
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
        this.resolvePlanifications();
        this.resolveFights();
        this.earnGold();
        this.resolveDead();
        this.getUnitsOnMap().forEach(function(cell) {
            cell.units.forEach(function(unit) {
                unit.has_moved = false;
            });
        });
    },
    resolvePlanifications : function() {
        this.players.forEach(function(player) {
            player.resolvePlanifications();
        });
    },
    findPlayer : function(id) {
        var found = false;
        Object.forEach(this.players, function(player) {
            if (player.id == id) {
                found = player;
            }
        });
        return found;
    },
    resolveFights : function() {
        this.resolveMissile();
        this.getUnitsOnMap().forEach(function(cell) {
            var players = {};
            cell.units.forEach(function(unit) {
                if (!players[unit.player.id]) {
                    players[unit.player.id] = 0;
                }
                players[unit.player.id] += unit.power;
            });

            // FIGHT
            if (Object.keys(players).length > 1) {
                var max_score = 0;
                Object.forEach(players, function(score, id) {
                    max_score = Math.max(score, max_score);
                });
                var win_count = 0;
                var win_id = 0;
                Object.forEach(players, function(score, id) {
                    if (max_score == score) {
                        win_count++;
                    }
                    win_id = id;
                });
                var win_player = Game.findPlayer(win_id);
                cell.units.forEach(function(unit) {
                    // Either tied
                    if (win_count > 1) {
                        unit.remove();
                    }
                    if (unit.player.id != win_id) {
                        win_player.createUnit(unit.type);
                        unit.remove();
                    }
                });
            }
        });
    },
    resolveMissile : function() {
        this.getUnitsOnMap().forEach(function(cell) {
            cell.units.forEach(function(unit) {
                if (unit.type == 'Missile' && unit.hasMoved()) {
                    cell.units.forEach(function() {
                        unit.remove();
                    });
                }
            });
        });
    },
    earnGold : function() {
        var rooms = [
            {id : 1, x1:1, y1:1, x2:3, y2:3},
            {id : 2, x1:1, y1:5, x2:3, y2:7},
            {id : 3, x1:5, y1:1, x2:7, y2:3},
            {id : 4, x1:5, y1:5, x2:7, y2:7}
        ];
        Object.forEach(this.players, function(player) {
            var earnedRooms = [];
            player.units.forEach(function(unit) {
                rooms.forEach(function(room) {
                    if (player.id != room.id && Game.isCellInsideRoom(unit.position, room)) {
                        if (!earnedRooms.contains(room.id)) {
                            earnedRooms.push(room.id);
                        }
                    }
                });
            });
            player.gold += Math.min(earnedRooms.length, 3);
        });
    },
    resolveDead : function() {
        // Check HQ invasion
        Game.players.forEach(function(player) {
            Game.getUnitsOnCell(player.hq).forEach(function(unit) {
                if (unit.player.id != player.id) {
                    // Transfer units Ownership
                    player.units.forEach(function() {
                        unit.player.createUnit(unit.type);
                        unit.remove();
                    });
                    player.gameOver = true;
                }
            });
        });
    },
    isCellInsideRoom: function(cell, room) {
        return cell.x >= room.x1 && cell.x <= room.x2 && cell.y >= room.y1 && cell.y <= room.y2;
    }
});
