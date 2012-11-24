$.widget("power.power", {
    options: {
        width: 9,
        height: 9
    },
    instances: {
        map: {
            main: null,
            grid: null
        },
        mainView: null
    },

    _create: function() {
        this.instances.map.main = $('<div class="map"></div>');
        this.instances.mainView = $('<div class="main_view"></div>');

        this.instances.map.main.appendTo(this.element);
        this.instances.mainView.appendTo(this.element);

        this._initializeMap();
    },

    _initializeMap: function() {
        this.instances.map.grid = $('<div class="grid"></div>');

        this.instances.map.grid.appendTo(this.instances.map.main);

        var o = this.options;
        for (var i = 0; i < o.width; i++) {
            for (var j = 0; j < o.height; j++) {
                var $gridItem = $('<div class="grid_item"></div>');
                $gridItem.css({
                    left: (i * 100 / 9) + '%',
                    top: (j * 100 / 9) + '%'
                });

                $gridItem.appendTo(this.instances.map.grid);
            }
        }
    }
});