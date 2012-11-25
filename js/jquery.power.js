$.widget("power.power", {
    options: {
        width: 9,
        height: 9,
        game: null,
        team: {
            1: 'chicken',
            2: 'cow',
            3: 'pig',
            4: 'rabbit'
        },
        playerNames: {
            1: 'Player 1',
            2: 'Player 2',
            3: 'Player 3',
            4: 'Player 4'
        },
        nbPlayer: 4,
        buyableUnits: ['Soldier', 'Tank', 'JetFighter', 'Destroyer']
    },
    instances: {
        map: {
            main: null,
            grid: null,
            drawZone: null,
            touchZone: null,
            gridItems: {}
        },
        topView: null
    },
    unitsSelected: {
    },
    playerSelected: 1,
    players: {},
    preSelectedUnit: null,

    _create: function() {
        var players = this.options.game.players;
        for (var i = 0; i < players.length; i++) {
            this.players[players[i].id] = players[i];
            this.players[players[i].id].gold = 200;
        }

        this.instances.map.main = $('<div class="map"></div>');
        this.instances.mainView = $('<div class="main_view"></div>');
        this.instances.topView = $('<div class="top_view"></div>');

        this.instances.map.main.appendTo(this.element);
        this.instances.mainView.appendTo(this.element);
        this.instances.topView.appendTo(this.element);

        this._initializeMap();
        this.refresh();
    },

    refresh: function() {
        this._refreshMap();
        this._refreshTopView();
        this._refreshDrawZone();
    },

    _refreshDrawZone: function() {
        this.instances.map.drawZone.drawZone('clear');
        for (var i = 0; i < this.players[this.playerSelected].planifications.length; i++) {
            var planification = this.players[this.playerSelected].planifications[i];
            if (planification[0] == 'resolveMove') {
                this._drawMovement(planification[1].position, planification[2], '#00FF00', false);
            }
        }
    },

    _refreshTopView: function() {
        var self = this;
        this.instances.topView.html('');
        var $playerName = $('<div class="player_name"></div>');
        var $playerPower = $('<div class="player_power"></div>');
        var $playerBuy = $('<div class="player_buy"></div>');
        var $playerRound = $('<div class="player_round"></div>');
        var $buttonNext = $('<input type="button" />');
        var $buttonBuy = $('<input type="button" />');

        $playerName.appendTo(this.instances.topView);
        $playerPower.appendTo(this.instances.topView);
        $playerRound.appendTo(this.instances.topView);
        $playerBuy.appendTo(this.instances.topView);

        var playerName = this.options.playerNames[this.playerSelected];
        $playerName.text(strtr('Player playing: {playerName}', {playerName: playerName}));
        $playerPower.text(strtr('{power} power', {power: this.players[this.playerSelected].gold}));
        $playerRound.append($buttonNext);
        $buttonNext.val('Next');
        $buttonNext.click(function() {
            if (self.playerSelected == self.options.nbPlayer) {
                self.options.game.nextRound();
                self.playerSelected = 1;
            } else {
                self.playerSelected++;
            }
            self.refresh();
        });

        $buttonBuy.val('Buy');
        $buttonBuy.click(function() {
            self._showBuyView();
        });
        $playerBuy.append($buttonBuy);
    },

    _initializeMap: function() {
        var self = this;
        this.instances.map.drawZone = $('<canvas class="draw_zone"></canvas>');
        this.instances.map.grid = $('<div class="grid"></div>');
        this.instances.map.touchZone = $('<div class="touch_zone"></div>');
        this.instances.map.grid.appendTo(this.instances.map.main);
        this.instances.map.drawZone.appendTo(this.instances.map.main);
        this.instances.map.touchZone.appendTo(this.instances.map.main);

        this.instances.map.drawZone.drawZone();

        var mergedPositions1 = {
            0: true,
            4: true,
            8: true
        };

        var mergedPositions2 = {
            1: true,
            3: true,
            5: true,
            7: true
        };

        var biggerPositions = {
            2: true,
            6: true
        };

        var o = this.options;
        for (var i = 0; i < o.width; i++) {
            this.instances.map.gridItems[i] = {};
            for (var j = 0; j < o.height; j++) {
                if (mergedPositions1[i] && mergedPositions2[j] || mergedPositions1[j] && mergedPositions2[i]) {
                    continue;
                }

                var $gridItem = $('<div class="grid_item"></div>');
                $gridItem.css({
                    left: (i * 100 / 9) + '%',
                    top: (j * 100 / 9) + '%'
                });
                if (mergedPositions1[i] && biggerPositions[j]) {
                    $gridItem.addClass('bigger_vertical');
                }
                if (mergedPositions1[j] && biggerPositions[i]) {
                    $gridItem.addClass('bigger_horizontal');
                }
                $gridItem.data('position', {x: i, y: j});


                var $gridTouchItem = $gridItem.clone();
                $gridTouchItem.data('position', {x: i, y: j});

                $gridTouchItem.click(function() {
                    self.selectGridItem($(this).data('position'));
                });
                $gridTouchItem.mouseenter(function() {
                    var $this = $(this);
                    var position = $this.data('position');
                    var positionFrom = null;
                    var state = 'hover';
                    for (var key in self.unitsSelected) {
                        if (state === 'hover') {
                           state = 'possible';
                        }
                        if (!self.unitsSelected[key].canMove(position)) {
                            state = 'impossible';
                        }
                        positionFrom = self.unitsSelected[key].position;
                    }
                    if (positionFrom) {
                        self._drawMovement(positionFrom, position, state == 'possible' ? '#00FF00' : 'red');
                    }
                    $(this).removeClass('hover')
                        .removeClass('possible')
                        .removeClass('impossible')
                        .addClass(state);

                });

                $gridTouchItem.mouseleave(function() {
                    $(this).removeClass('hover')
                        .removeClass('possible')
                        .removeClass('impossible');
                });

                $gridItem.appendTo(this.instances.map.grid);
                $gridTouchItem.appendTo(this.instances.map.touchZone);

                $gridItem.data('touch', $gridTouchItem);

                this.instances.map.gridItems[i][j] = $gridItem;
            }
        }
    },

    _drawMovement: function(positionFrom, positionTo, color, refresh) {
        var $gridFrom = this.instances.map.gridItems[positionFrom.x][positionFrom.y];
        var $gridTo = this.instances.map.gridItems[positionTo.x][positionTo.y];
        var pixelPositionFrom = $gridFrom.position();
        var pixelPositionTo = $gridTo.position();
        var decalXFrom = $gridFrom.width() / 2 + parseInt($gridFrom.css('margin-left'));
        var decalYFrom = $gridFrom.height() / 2 + parseInt($gridFrom.css('margin-top'));
        var decalXTo = $gridTo.width() / 2 + parseInt($gridTo.css('margin-left'));
        var decalYTo = $gridTo.height() / 2 + parseInt($gridTo.css('margin-top'));
        if (typeof refresh == 'undefined') {
            refresh = true;
        }
        if (refresh) {
            this._refreshDrawZone();
        }
        this.instances.map.drawZone.drawZone('drawArrow', pixelPositionFrom.left + decalXFrom, pixelPositionFrom.top + decalYFrom, pixelPositionTo.left + decalXTo, pixelPositionTo.top + decalYTo, 3, color);
    },

    _refreshMap: function() {
        var self = this;
        this.instances.map.grid.find('.grid_item').html('');
        this.instances.map.touchZone.find('.grid_item').html('');

        var units = this.options.game.getUnitsOnMap();

        for (var i = 0; i < units.length; i++) {
            var position = units[i].position;
            var unitsList = units[i].units;
            var unitDisplayClass = 'unit_display_' + Math.ceil(Math.sqrt(unitsList.length));
            var $gridItem = this.instances.map.gridItems[position.x][position.y];
            var $gridTouchItem = $gridItem.data('touch');
            $gridItem
                .removeClass('unit_display_1')
                .removeClass('unit_display_2')
                .removeClass('unit_display_3')
                .addClass(unitDisplayClass);
            $gridTouchItem
                .removeClass('unit_display_1')
                .removeClass('unit_display_2')
                .removeClass('unit_display_3')
                .addClass(unitDisplayClass);
            for (var j = 0; j < unitsList.length; j++) {
                var unit = unitsList[j];

                var unitType = unit.type;
                var $unit = $('<div class="unit"></div>')
                    .addClass(unitType)
                    .addClass(this.options.team[unit.player.id]);
                $unit.data('unit', unit);
                $unit.appendTo($gridItem);

                var $touchUnit = $('<div class="unit"></div>');
                $touchUnit.appendTo($gridTouchItem);

                $touchUnit.data('unit', unit);

                $touchUnit.click(function() {
                    self.preSelectedUnit = $(this).data('unit');
                });
            }
        }
    },

    selectGridItem: function(position) {
        var self = this;
        if (this.unitsSelected) {
            for (var key in this.unitsSelected) {
                this.players[this.playerSelected].planifyMove(this.unitsSelected[key], position);
            }
        }
        this.unitsSelected = {};
        if (this.preSelectedUnit) {
            this.selectUnit(this.preSelectedUnit);
            this.preSelectedUnit = null;
        }
        self._refreshDrawZone();
        var $gridItem = this.instances.map.gridItems[position.x][position.y];
        this.instances.map.grid.find('.grid_item').removeClass('selected');
        $gridItem.addClass('selected');
        this._trigger('selectGrid', {position: position});

        this.instances.mainView.html('');
        var $gridItemView = $('<div class="grid_item_view"></div>');
        $gridItemView.appendTo(this.instances.mainView);

        var $position = $('<div class="position"></div>');
        $position.appendTo($gridItemView);
        $position.text(strtr(_('Cell selected: {x}, {y}'), position));

        var units = this.options.game.getUnitsOnCell(position);

        var $units = $('<div class="units"></div>');
        var $unitsLabel = $('<div class="units_label"></div>');
        var $unitsList = $('<div class="units_list"></div>');
        $unitsLabel.appendTo($units);
        $unitsList.appendTo($units);
        $units.appendTo($gridItemView);
        $unitsLabel.text(strtr(_('There is {nb} unit(s) on this cell'), {nb: units.length}));
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            var $unitItem = $('<div class="unit_item"></div>');
            $unitItem.addClass(unit.type)
                .addClass(this.options.team[unit.player.id]);
            $unitItem.appendTo($unitsList);
            var $unitItemHover = $('<div class="unit_item_hover"></div>');
            $unitItemHover.appendTo($unitItem);
            $unitItem.data('unit', unit);

            $unitItem.click(function() {
                var $this = $(this);
                self.switchSelectUnit($this.data('unit'));
            });
        }
        this._refreshUnitsView();
    },

    switchSelectUnit: function(unit) {
      return this.unitsSelected[unit.id] ? this.deselectUnit(unit) : this.selectUnit(unit);
    },

    selectUnit: function(unit) {
        if (unit.player.id == this.playerSelected) {
            this.unitsSelected[unit.id] = unit;
            this._refreshUnitsView();
            return true;
        }
        return false;
    },

    deselectUnit: function(unit) {
        delete this.unitsSelected[unit.id];
        this._refreshUnitsView();
        return false;
    },

    _refreshUnitsView: function() {
        var self = this;
        this.instances.mainView.find('.unit_item').each(function() {
            var $this = $(this);
            self.unitsSelected[$this.data('unit').id] ? $this.addClass('selected') : $this.removeClass('selected');
        });
    },

    _trigger: function(name, params) {
        return this.element.trigger(name, params);
    },

    _showBuyView: function() {
        var self = this;
        this.instances.mainView.html('');
        var $buy = $('<div class="buy"></div>');
        $buy.appendTo(this.instances.mainView);
        var $buyLabel = $('<div class="buy_label"></div>');
        var $buyList = $('<div class="buy_list"></div>');
        $buyLabel.appendTo(this.instances.mainView);
        $buyList.appendTo(this.instances.mainView);

        $buyLabel.text(_('Buy units'));
        for (var i = 0; i < this.options.buyableUnits.length; i++) {
            var buyableUnit = this.options.buyableUnits[i];
            var cost = new window[buyableUnit]().power; //@todo: to be improved

            var $item = $('<div class="buy_list_item"></div>');
            $item.appendTo($buyList);
            var $item_image = $('<div class="buy_list_item_image"></div>');
            var $item_label = $('<div class="buy_list_item_label"></div>');
            var $item_action_zone = $('<div class="buy_list_item_action_zone"></div>');
            $item_image.appendTo($item);
            $item_label.appendTo($item);
            $item_action_zone.appendTo($item);

            $item_image
                .addClass(buyableUnit.toLowerCase())
                .addClass(this.options.team[this.playerSelected]);
            $item_label.text(strtr(_('{cost} power'), {cost: cost}));

            var $item_button = $('<input type="button" />').val(_('Buy'));
            $item_button.appendTo($item_action_zone);
            $item_button.data('unit', buyableUnit);
            $item_button.click(function() {
                self.players[self.playerSelected].planifyBuy($(this).data('unit'));
            });
        }
    }
});