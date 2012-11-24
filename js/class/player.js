Player = new Class({
    initialize: function(id, name, hq){
        this.id = id;
        this.name = name;
        this.hq = hq;
        this.units = [];
    },
    createUnit: function(name, position) {
        var unit = new window[name](position || this.hq);
        unit.player = this;
        this.units.push(unit);
    }
});
