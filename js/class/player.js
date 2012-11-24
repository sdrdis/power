Player = new Class({
    initialize: function(id, name, hq){
        this.id = id;
        this.name = name;
        this.hq = hq;
        this.units = [];
    },
    createUnit: function(name, position) {//position 
        var unit = new window[name](position || this.hq);
        unit.player = this;
        this.units.push(unit);
    },
    canMove: function(unit, position) {
        return unit.canMove(position);
    },
    canFusion: function(unit) {
        var unitsFusion = Game.getUnitsOnCell(unit.position);
        
        var permit = false;
        var nbFusion = 0;
        
        unitsFusion.forEach(function(unitFusion){
            if(unitFusion.type == unit.type){ nbFusion++; }//compte les unités de même type
        });
        if(nbFusion >= 3){ permit = true }//si au moins 3 unités du même type, on peux fusionner
        
        return permit;
    },
    canMegaMissile: function(unit) {
        var unitsFusion = Game.getUnitsOnCell(unit.position);
        
        var permit = false;
        var countPower = 0;
        
        unitsFusion.forEach(function(unitFusion){
            countPower += unitFusion.power
        });
        if(countPower >= 100){ permit = true }//si au moins 3 unités du même type, on peux fusionner
        
        return permit;
    },
    canBuy: function(type) {
        
    }
});
