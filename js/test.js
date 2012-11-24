
Game.start(4);

// console.log(Game);

var unitsHQ = Game.getUnitsOnCell({x:0, y:0});
console.log(unitsHQ[0]);
console.log(unitsHQ[0].canMove({x:1, y:1}));