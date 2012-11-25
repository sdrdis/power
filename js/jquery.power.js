$.widget("power.power", {
    options: {
        width: 9,
        height: 9,
        game: null,
        playersInformations: {
			1: {
				team: 'chicken',
				name: 'Player 1'
			},
			2: {
				team: 'cow',
				name: 'Player 2'
			},
			3: {
				team: 'pig',
				name: 'Player 3'
			},
			4: {
				team: 'rabbit',
				name: 'Player 4'
			},
		},
        nbPlayer: 4,
        buyableUnits: ['Soldier', 'Tank', 'JetFighter', 'Destroyer'],
        unitsInformations: {
			'Soldier': {
				'label': 'soldier'
			},
			'Tank': {
				'label': 'tank'
			},
			'JetFighter': {
				'label': 'jet fighter'
			},
			'Destroyer': {
				'label': 'destroyer'
			},
			'Regiment': {
				'label': 'regiment'
			},
			'Assault': {
				'label': 'assault tank'
			},
			'JetBomber': {
				'label': 'jet bomber'
			},
			'BattleCruiser': {
				'label': 'battlecruiser'
			},
			'Missile': {
				'label': 'missile'
			},
		}
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
    lastPlanifications: null,
    lastSelectedPosition: null,
    lastEvents: null,

    _create: function() {
        var players = this.options.game.players;
        for (var i = 0; i < players.length; i++) {
        	this.players[players[i].id] = players[i];
        }

        this.instances.map.main = $('<div class="map"></div>');
        this.instances.mainView = $('<div class="main_view"></div>');
        this.instances.topView = $('<div class="top_view"></div>');

        this.instances.map.main.appendTo(this.element);
        this.instances.mainView.appendTo(this.element);
        this.instances.topView.appendTo(this.element);

        this._initializeMap();
        this.refresh();
        this._showStartingView();
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
            if (instanceOf(planification, PlanificationMove)) {
                this._drawMovement(planification.unit.position, planification.where, '#00FF00', false);
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
        var $buttonNext = $('<input type="image" src="images/turn.png" width="100" height="100" />');
        var $buttonBuy = $('<input type="image" src="images/buy.png" width="100" height="100" />');
        var $title = $('<img class="game_title" src="images/titre.png" height="70" />');

        $title.appendTo(this.instances.topView);
        $playerName.appendTo(this.instances.topView);
        $playerPower.appendTo(this.instances.topView);
        $playerRound.appendTo(this.instances.topView);
        $playerBuy.appendTo(this.instances.topView);

        var playerName = this.options.playersInformations[this.playerSelected].name;
        $playerName.text(strtr('{playerName}', {playerName: playerName}));
        $playerPower.html(strtr('<div>{power}</div> <img src="images/minipower.png" width="30" height="30" />', {power: this.players[this.playerSelected].getAvailableGold()}));
        $playerRound.append($buttonNext);
        $buttonNext.val('Next');
        $buttonNext.click(function() {
            if (self.playerSelected == self.options.nbPlayer) {
            	self.lastPlanifications = {};
            	for (var key in self.players) {
            		self.lastPlanifications[key] = [];
            		self.players[key].planifications.forEach(function(planification) {
            			var tempPlayer = planification.player;
            			planification.player = null;
            			if (planification.unit) {
            				planification.unit.player = null;
            			}
            			if (planification.involvedUnits) {
            				for (var i = 0; i < planification.involvedUnits.length; i++) {
            					planification.involvedUnits[i].player = null;
            				}
            			}
            			var clonedPlanification = Object.clone(planification);
            			clonedPlanification.player = tempPlayer;
            			planification.player = tempPlayer;
            			if (planification.unit) {
            				planification.unit.player = tempPlayer;
            			}
            			if (planification.involvedUnits) {
            				for (var i = 0; i < planification.involvedUnits.length; i++) {
            					planification.involvedUnits[i].player = tempPlayer;
            				}
            			}
            			self.lastPlanifications[key].push(clonedPlanification);
            			
            		});
            	}
                self.lastEvents = self.options.game.nextRound();
                self.playerSelected = 1;
            } else {
                self.playerSelected++;
            }
            self.refresh();
            self._showStartingView();
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
                .removeClass('unit_display_4')
                .addClass(unitDisplayClass);
            $gridTouchItem
                .removeClass('unit_display_1')
                .removeClass('unit_display_2')
                .removeClass('unit_display_3')
                .removeClass('unit_display_4')
                .addClass(unitDisplayClass);
            for (var j = 0; j < unitsList.length; j++) {
                var unit = unitsList[j];

                var unitType = unit.type.toLowerCase();
                var $unit = $('<div class="unit"></div>')
                    .addClass(unitType)
                    .addClass(this.options.playersInformations[unit.player.id].team);
                $unit.data('unit', unit);
                $unit.appendTo($gridItem);

                var $touchUnit = $('<div class="unit"></div>');
                $touchUnit.appendTo($gridTouchItem);

                $touchUnit.data('unit', unit);

                $touchUnit.click(function() {
                	for (var i in self.unitsSelected) {
                		return true;
                	}
                    self.preSelectedUnit = $(this).data('unit');
                });
            }
        }
    },

    selectGridItem: function(position) {
    	this.lastSelectedPosition = position;
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
        this.instances.map.touchZone.find('.grid_item').removeClass('selected');
        $gridItem.data('touch').addClass('selected');
        this._trigger('selectGrid', {position: position});

        this.instances.mainView.html('');
        var $gridItemView = $('<div class="grid_item_view"></div>');
        $gridItemView.appendTo(this.instances.mainView);

        var $position = $('<div class="position"></div>');
        $position.appendTo($gridItemView);
        $position.text(strtr(_('Cell selected: {x}, {y}'), position));

        var unitsByKey = this.players[this.playerSelected].getUnitsOnCellByState(position);

        var $units = $('<div class="units"></div>');
        
        var $unitsPowerSelected = $('<div class="units_power_selected"></div>');
        var $unitsFusion = $('<div class="units_fusion"></div>');
        var $unitsMissile = $('<div class="units_missile"></div>');
        
        var labelsByKey = {
			staying: _('on this cell'),
			incoming: _(' coming to this cell'),
			leaving: _(' leaving this cell'),
			fusionning: _(' fusionning'),
        };
       
        for (var key in unitsByKey) {
        	var units = unitsByKey[key];
        	if (units.length > 0) {
	        	var $unitsLabel = $('<div class="units_label"></div>');
	            var $unitsList = $('<div class="units_list"></div>');
	            $unitsLabel.appendTo($units);
	            $unitsPowerSelected.appendTo($units);
	            $unitsFusion.appendTo($units);
	            $unitsMissile.appendTo($units);
	            $unitsList.appendTo($units);
	            $units.appendTo($gridItemView);
	            $unitsLabel.text(strtr(_('{nb} unit(s) {label}'), {nb: units.length, label: labelsByKey[key]}));
	            for (var i = 0; i < units.length; i++) {
	                var unit = units[i];
	                var $unitItem = $('<div class="unit_item"></div>');
	                $unitItem.addClass(unit.type.toLowerCase())
	                    .addClass(this.options.playersInformations[unit.player.id].team);
	                $unitItem.appendTo($unitsList);
	                var $unitItemHover = $('<div class="unit_item_hover"></div>');
	                $unitItemHover.appendTo($unitItem);
	                $unitItem.data('unit', unit);
	
	                $unitItem.click(function() {
	                    var $this = $(this);
	                    self.switchSelectUnit($this.data('unit'));
	                });
	            }
        	}
        }
        
        
        
        var $fusionButton = $('<input type="button" />');
        $fusionButton.appendTo($unitsFusion);
        $fusionButton.val(_('Fusion'));
        $fusionButton.click(function() {
        	var units = [];
        	for (var key in self.unitsSelected) {
            	units.push(self.unitsSelected[key]);
            }
        	self.players[self.playerSelected].planifyFusion(self.lastSelectedPosition, units);
        	self.selectGridItem(position);
        });
        
        var $missileButton = $('<input type="button" />');
        $missileButton.appendTo($unitsMissile);
        $missileButton.val(_('Missile'));
        $missileButton.click(function() {
        	var units = [];
        	for (var key in self.unitsSelected) {
            	units.push(self.unitsSelected[key]);
            }
        	self.players[self.playerSelected].planifyMissile(self.lastSelectedPosition, units);
        	self.selectGridItem(position);
        });
        
        this._refreshUnitsView();
    },

    switchSelectUnit: function(unit) {
      return this.unitsSelected[unit.id] ? this.deselectUnit(unit) : this.selectUnit(unit);
    },

    selectUnit: function(unit) {
        if (unit.player.id == this.playerSelected) {
        	this.refresh();
            this.unitsSelected[unit.id] = unit;
            this._refreshUnitsView();
            playSound(unit.type.toLowerCase());
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
        var totalPower = 0;
        var units = [];
        for (var key in self.unitsSelected) {
        	totalPower += self.unitsSelected[key].power;
        	units.push(self.unitsSelected[key]);
        }
        this.instances.mainView.find('.units_power_selected').text(strtr(_('Your selection has a total power of {totalPower}'), {totalPower: totalPower}));
        
        if (units.length == 3) {
	        var $unitFusion = this.instances.mainView.find('.units_fusion');
	        this.players[this.playerSelected].canFusion(this.lastSelectedPosition, units) ? $unitFusion.addClass('active') : $unitFusion.removeClass('active');
        }
        
        var $unitMissile = this.instances.mainView.find('.units_missile');
        this.players[this.playerSelected].canMissile(this.lastSelectedPosition, units) ? $unitMissile.addClass('active') : $unitMissile.removeClass('active');
    },

    _trigger: function(name, params) {
        return this.element.trigger(name, params);
    },

    _showBuyView: function() {
        var self = this;
        this.refresh();
        this.unitsSelected = {};
        this.instances.mainView.html('');
        var $buy = $('<div class="buy"></div>');
        $buy.appendTo(this.instances.mainView);
        
        
        var $buyLabel = $('<div class="buy_label"></div>');
        var $buyList = $('<div class="buy_list"></div>');
        $buyLabel.appendTo(this.instances.mainView);
        $buyList.appendTo(this.instances.mainView);

        $buyLabel.text(_('Buy units'));
        for (var i = 0; i < this.options.buyableUnits.length; i++) {
            this._displayUnit(
            		this.options.buyableUnits[i],
            		_('Buy'),
            		{},
            		function() {
                        self.players[self.playerSelected].planifyBuy($(this).data('unit'));
                        console.log($(this).data('unit'));
                        playSound($(this).data('unit').toLowerCase(), true);
                        self.refresh();
                        self._showBuyView();
                    }
    		).appendTo($buyList);
        }
        
        var buyingUnits = this.players[this.playerSelected].getBuyingPlanifications();
        
        if (buyingUnits.length > 0) {
	        var $buyingLabel = $('<div class="buying_label"></div>');
	        var $buyingList = $('<div class="buying_list"></div>');
	        $buyingLabel.text(_('Units queue'));
	        $buyingLabel.appendTo(this.instances.mainView);
	        $buyingList.appendTo(this.instances.mainView);
	        for (var i = 0; i < buyingUnits.length; i++) {
	        	this._displayUnit(
	        			buyingUnits[i].unitType,
	            		_('Cancel'),
	            		{planification: buyingUnits[i].planification},
	            		function() {
	            			var planification = $(this).data('data').planification;
	            			planification.cancel();
	                        self.refresh();
	                        self._showBuyView();
	                    }
	    		).appendTo($buyingList);
	        }
        }
    },
    
    _displayUnit: function(buyableUnit, label, data, callback) {
    	var self = this;
        var cost = window[buyableUnit].cost;

        var $item = $('<div class="buy_list_item"></div>');
        var $item_image = $('<div class="buy_list_item_image"></div>');
        var $item_label = $('<div class="buy_list_item_label"></div>');
        var $item_action_zone = $('<div class="buy_list_item_action_zone"></div>');
        $item_image.appendTo($item);
        $item_label.appendTo($item);
        $item_action_zone.appendTo($item);

        $item_image
            .addClass(buyableUnit.toLowerCase())
            .addClass(this.options.playersInformations[this.playerSelected].team);
        $item_label.text(strtr(_('{cost} power'), {cost: cost}));

        var $item_button = $('<button type="button">' + strtr(_('Buy for {cost}'), {cost: cost}) + ' <img src="images/minipower.png" width="20" height="20"> </button>');
        $item_button.appendTo($item_action_zone);
        $item_button.data('unit', buyableUnit);
        $item_button.data('data', data);
        $item_button.click(callback);
        return $item;
    },
    
    _showStartingView: function() {
    	var self = this;
    	this.instances.mainView.html('');
    	var $title = $('<div class="title"></div>');
    	var $description = $('<div class="description"></div>');
    	$title.appendTo(this.instances.mainView);
    	$description.appendTo(this.instances.mainView);
    	if (this.lastPlanifications === null) {
    		$title.text(_('First round'));
    		$description.text(_('You can start playing now'));
    	} else {
    		$title.text(_('Last round summary'));
    		var $planificationsOrders = $('<div class="planifications_orders"></div>');
    		$planificationsOrders.text(_('Orders'));
    		$planificationsOrders.appendTo($description);
    		for (var key in this.lastPlanifications) {
    			var $planificationsPlayer = $('<div class="planifications_player"></div>');
    			var $planificationsPlayerList = $('<div class="planifications_player_list"></div>');
    			$planificationsPlayer.appendTo($description);
    			$planificationsPlayerList.appendTo($description);
    			$planificationsPlayer.text(this.options.playersInformations[key].name);
    			this.lastPlanifications[key].forEach(function(planification) {
    				self._showPlanification(planification)
    					.appendTo($planificationsPlayerList);
    			});
    		}
    		var $planificationsEvents = $('<div class="planifications_events"></div>');
    		$planificationsEvents.text(_('Events'));
    		$planificationsEvents.appendTo($description);
    		
    		$.each(this.lastEvents.fights, function(key, fight) {
    			var $planificationsFight = $('<div class="planifications_fight"></div>');
    			var playerIds = [];
    			for (var key in fight.scores) {
    				playerIds.push(key);
    			}
    			
    			if (fight.tied) {
    				$planificationsFight.text(strtr(
        					_('Tight fight on [{x}, {y}] between {player1} ({score1}) and {player2} ({score2}). All player lost their units!'),
        					{
        						x: fight.position.x,
        						y: fight.position.y,
        						player1: self.options.playersInformations[playerIds[0]].name,
        						score1: fight.scores[playerIds[0]],
        						player2: self.options.playersInformations[playerIds[1]].name,
        						score2: fight.scores[playerIds[1]]
        					}
    					)
        			);
    			} else {
    				$planificationsFight.text(strtr(
        					_('Fight on [{x}, {y}] between {player1} ({score1}) and {player2} ({score2}). Winner is {playerWinner}!'),
        					{
        						x: fight.position.x,
        						y: fight.position.y,
        						player1: self.options.playersInformations[playerIds[0]].name,
        						score1: fight.scores[playerIds[0]],
        						player2: self.options.playersInformations[playerIds[1]].name,
        						score2: fight.scores[playerIds[1]],
        						playerWinner: self.options.playersInformations[fight.winner.id].name,
        					}
    					)
        			);
    			}
    			
    			$planificationsFight.appendTo($description);
    		});
    		$.each(this.lastEvents.missiles, function(key, missile) {
    			var $planificationsMissile = $('<div class="planifications_missile"></div>');
    			$planificationsMissile.text(strtr(
    					_('Missile sent on [{x}, {y}]. Boom!'),
    					{
    						x: missile.x,
    						y: missile.y
    					}
					)
    			);
    			
    			$planificationsMissile.appendTo($description);
    		});
    	}
    },
    
    _showPlanification: function(planification) {
    	var $item = $('<div class="planification_item"></div>');
    	$item.addClass(planification.type.toLowerCase());
    	if (instanceOf(planification, PlanificationBuy)) {
    		$item.text(strtr(_('Buy {unitType}'), {unitType: this._getUnitTypeLabel(planification.unitType)}));
    	}
    	if (instanceOf(planification, PlanificationMove)) {
    		$item.text(strtr(_('Move {unitType} from [{fromX}, {fromY}] to [{toX}, {toY}]'), {
    			unitType: this._getUnitTypeLabel(planification.unit.type),
    			fromX: planification.unit.position.x,
    			fromY: planification.unit.position.y,
    			toX: planification.where.x,
    			toY: planification.where.y,
    		}));
    	}
    	if (instanceOf(planification, PlanificationFusion)) {
    		$item.text(strtr(_('Merge 3 {unitType}s on [{x}, {y}]'), {
    			unitType: this._getUnitTypeLabel(planification.involvedUnits[0].type),
    			x: planification.involvedUnits[0].position.x,
    			y: planification.involvedUnits[0].position.y,
    		}));
    	}
    	if (instanceOf(planification, PlanificationMissile)) {
    		$item.text(strtr(_('Merge units to missile on [{x}, {y}]'), {
    			x: planification.involvedUnits[0].position.x,
    			y: planification.involvedUnits[0].position.y,
    		}));
    	}
    	return $item;
    },
    
    _getUnitTypeLabel: function(unitType) {
    	return this.options.unitsInformations[unitType].label;
    }
});