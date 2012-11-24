$.widget("power.power", {
    options: {
        width: 9,
        height: 9,
        map: {
            units: [
                {
                    position: {x: 1, y: 1},
                    list: [
                        {
                            type: 'soldier'
                        },
                        {
                            type: 'soldier'
                        }
                    ]
                }
            ]
        }
    },
    instances: {
        map: {
            main: null,
            grid: null,
            gridItems: {}
        },
        mainView: null
    },

    _create: function() {
        this.instances.map.main = $('<div class="map"></div>');
        this.instances.mainView = $('<div class="main_view"></div>');

        this.instances.map.main.appendTo(this.element);
        this.instances.mainView.appendTo(this.element);

        this._initializeMap();
        this._refreshMap();
    },

    _initializeMap: function() {
        var self = this;

        this.instances.map.grid = $('<div class="grid"></div>');
        this.instances.map.grid.appendTo(this.instances.map.main);

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
                $gridItem.click(function() {
                    self.selectGridItem($(this).data('position'));
                });

                $gridItem.appendTo(this.instances.map.grid);

                this.instances.map.gridItems[i][j] = $gridItem;
            }
        }
    },

    _refreshMap: function() {
        this.instances.map.grid.find('.grid_item').html('');

        var units = this.options.map.units; //@todo temporary

        for (var i = 0; i < units.length; i++) {
            var position = units[i].position;
            var unitsList = units[i].list;
            var unitDisplayClass = 'unit_display_' + Math.ceil(Math.sqrt(unitsList.length));
            this.instances.map.gridItems[position.x][position.y]
                .removeClass('unit_display_1')
                .removeClass('unit_display_2')
                .removeClass('unit_display_3')
                .addClass(unitDisplayClass);
            for (var i = 0; i < unitsList.length; i++) {
                var unit = unitsList[i];
                var unitType = unit.type; //@todo temporary
                var $unit = $('<div class="unit"></div>').addClass(unitType);
                $unit.appendTo(this.instances.map.gridItems[position.x][position.y]);
            }
        }
    },

    selectGridItem: function(position) {
        var $gridItem = this.instances.map.gridItems[position.x][position.y];
        this.instances.map.grid.find('.grid_item').removeClass('selected');
        $gridItem.addClass('selected');
        this._trigger('selectGrid', {position: position});

        this.instances.mainView.html('');
        var $gridItemView = $('<div class="grid_item_view"></div>');
        var $position = $('<div class="position"></div>');

        $position.appendTo($gridItemView);
        $gridItemView.appendTo(this.instances.mainView);

        $position.text(strtr('Cell selected: {x}, {y}', position));




        //.text('Position: [' + position.x + ', ' + position.y + ']');
    },

    _trigger: function(name, params) {
        return this.element.trigger(name, params);
    }
});