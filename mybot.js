function new_game() {
	// API Wrapper
	api = (function (board) {
		var getMe = function () {
			return {x: get_my_x(), y: get_my_y()};
		};

		var getThem = function () {
			return {x: get_opponent_x(), y: get_opponent_y()};
		};

		var isFruit = function (cell) {
			return has_item(board[cell.x][cell.y]);
		};

		var getType = function (cell) {
			return board[cell.x][cell.y];
		};

		var getDistance = function (alpha, beta) {
			return Math.sqrt(Math.pow(alpha.x - beta.x, 2) + Math.pow(alpha.y - beta.y, 2));
		};

		var getMap = function () {
			var cell = {}, fruit = {}, counter = 0, fruitMap = [];

			for (var i = 0; i <= WIDTH - 1; i++) {
				for (var j = 0; j <= HEIGHT - 1 ; j++) {
					cell = {x: i, y: j};

					if (isFruit(cell)) {
						counter += 1;
						fruit = Object.create(Fruit);

						fruit.id = counter;
						fruit.loc = cell;
						fruit.type = getType(cell);

						fruitMap.push(fruit);
					}
				}
			}

			return fruitMap;
		};

		var isGood = function (type) {
			var mine = get_my_item_count(type);
			var them = get_opponent_item_count(type);
			var ftw = Math.ceil(get_total_item_count(type) / 2); // Assume every type has an odd number of pieces

			if (mine < ftw && them < ftw) {
				return true;
			}
		};

		var countType = function (type) {
			return get_total_item_count(type);
		};

		var isRare = function (type) {
			if (type <= Math.ceil(get_number_of_item_types() / 2)) {
				return true;
			}
		};

		var isRarest = function (type) {
			var count, rarest, types = [];

			for (var i = 1; i < get_number_of_item_types(); i++) {
				count = countType(i) - get_my_item_count(i) - get_opponent_item_count(i);
				if (count > 0) {
					types.push({type: i, left: count});
				}
			}

			rarest = types[0];

			for (var i = 1; i < types.length; i++) {
				rarest = rarest.left < types[i].left ? rarest : types[i];
			}

			if (!rarest) {
				console.log(types);
			}

			if (rarest && rarest.type === type) {
				return true;
			}
		};

		return {
			me: getMe,
			them: getThem,
			isGood: isGood,
			countType: countType,
			isRare: isRare,
			isRarest: isRarest,
			getDistance: getDistance,
			getMap: getMap
		}
	}(get_board()));

	// Elmo BETA
	elmoBot = (function (api) {
		var checkX = function (x) {
			if (x > 0) {
				return WEST;
			}else if(x < 0) {
				return EAST;
			}else {
				return false;
			}
		}

		var checkY = function (y) {
			if (y > 0) {
				return NORTH;
			}else if(y < 0) {
				return SOUTH;
			}else {
				return false;
			}
		};

		var getTarget = function (fruitMap) {
			var target = fruitMap[0];

			for (var i = 1; i < fruitMap.length; i++) {
				target = target.getRating(api) > fruitMap[i].getRating(api) ? target : fruitMap[i];
			}

			return target;
		}

		var move = function () {
			var target = getTarget(api.getMap());
			var waypoint = {x: api.me().x - target.loc.x, y: api.me().y - target.loc.y};

			if ( ! target) {
				return PASS;
			}

			if (api.me().x === target.loc.x && api.me().y === target.loc.y) {
				return TAKE;
			}

			if (checkX(waypoint.x)) {
				return checkX(waypoint.x);
			}

			if (checkY(waypoint.y)) {
				return checkY(waypoint.y);
			}


			console.log(waypoint);

			console.log('shit fuck');
		};

		return {
			move: move
		}
	}(api));

	//myBot = derpBot(get_board());
	//myBot.start();
}

function make_move() {
	return elmoBot.move();
	//return myBot.makeMove();
}



var Fruit = {
	id: 0,
	type: 0,
	loc: {x: 0, y: 0},
	getRating: function (api) {
		var rating = 100;
		var distMe = api.getDistance(api.me(), this.loc);
		var distThem = api.getDistance(api.them(), this.loc);

		rating -= distMe * 3.4;
		rating -= api.countType(this.type) * 1.5;
		rating -= api.isGood(this.type) ? 0 : 100;
		rating += api.isRare(this.type) ? 10 : 0;
		rating += api.isRarest(this.type) ? 15 : 0;


		//if (rating < 0) {
			//console.log('less than zero?');
		//}

		return rating;
	}
};

// derp BOT Alpha
derpBot = function (board) {
	//var mapFruit = function () {
		//var fruit = [];

		//for (var i = 0; i <= WIDTH - 1; i++) {
			//for (var j = 0; j <= HEIGHT - 1 ; j++) {
				//if (has_item(board[i][j])) {
					//fruit.push({x: i, y: j, type: board[i][j], distance: getDistance(getPos(), {x: i, y: j})});
				//}
			//}
		//}

		//return fruit;
	//};

	//var getPos = function () {
		//return {x: get_my_x(), y: get_my_y()};
	//};

	//var getDistance = function (alpha, beta) {
		//return Math.sqrt(Math.pow(alpha.x - beta.x, 2) + Math.pow(alpha.y - beta.y, 2));
	//};

	//var closestFruit = function (fruit) {
		//var closest = fruit[0];

		//for (var i = 1; i < fruit.length; i++) {
			//closest = closest.distance < fruit[i].distance ? closest : fruit[i];
		//}

		//return closest;
	//};

	//var checkX = function (x) {
		//if (x > 0) {
			//return WEST;
		//}else if(x < 0) {
			//return EAST;
		//}else {
			//return false;
		//}
	//}

	//var checkY = function (y) {
		//if (y > 0) {
			//return NORTH;
		//}else if(y < 0) {
			//return SOUTH;
		//}else {
			//return false;
		//}
	//};

	//var isFruitGood = function (type) {
		//var me = get_my_item_count(type);
		//var them = get_opponent_item_count(type);
		//var toWin = Math.ceil(get_total_item_count(type) / 2);

		//if (me < toWin && them < toWin) {
			//return true;
		//}
	//};

	//var isFruitRare = function (type) {
		//if (type <= Math.ceil(get_number_of_item_types() / 2)) {
			//return true;
		//}
	//};

	//var filterFruit = function (fruit) {
		//var goodList = [];
		//var rareList = [];

		//for (var i = 0; i < fruit.length; i++) {
			//if (isFruitGood(fruit[i].type)) {
				//goodList.push(fruit[i]);
			//}
		//}

		//for (var i = 0; i < goodList.length; i++) {
			//if (isFruitRare(goodList[i].type)) {
				//rareList.push(goodList[i]);
			//}
		//}

		//if (rareList.length > 0) {
			//return rareList;
		//}else if (goodList.length > 0) {
			//return goodList;
		//}else {
			//return fruit;
		//}
	//};

	//var makeMove = function () {
		//var me = getPos();
		//var fruit = filterFruit(mapFruit());
		//var next = closestFruit(fruit);
		//var x = me.x - next.x;
		//var y = me.y - next.y;

		//if (x === 0 && y === 0) {
			//return TAKE;
		//}

		//console.log(x + ' = ' + y + ' || ' + next.x + ' = ' + next.y);

		//if (checkX(x)) {
			//return checkX(x);
		//}

		//if (checkY(y)) {
			//return checkY(y);
		//}

		//console.log('derp');
	//};

	//var start = function () {

	//};


	//return {
		//start: start,
		//makeMove: makeMove
	//}
};