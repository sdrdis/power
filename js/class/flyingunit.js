FlyingUnit = new Class({
    Extends: Unit,
    initialize: function(position){
        this.parent(position);
        this.category = 'flying';
    }
});
