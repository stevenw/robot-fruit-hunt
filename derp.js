function new_game() {
	myBot = derpBot(get_board());
	myBot.start();
}

function make_move() {
	return myBot.makeMove();
}

// derp BOT Alpha
derpBot = function (board) {
	var mapFruit = function () {
		var fruit = [];

		for (var i = 0; i <= WIDTH - 1; i++) {
			for (var j = 0; j <= HEIGHT - 1 ; j++) {
				if (has_item(board[i][j])) {
					fruit.push({x: i, y: j, type: board[i][j], distance: getDistance(getPos(), {x: i, y: j})});
				}
			}
		}

		return fruit;
	};

	var getPos = function () {
		return {x: get_my_x(), y: get_my_y()};
	};

	var getDistance = function (alpha, beta) {
		return Math.sqrt(Math.pow(alpha.x - beta.x, 2) + Math.pow(alpha.y - beta.y, 2));
	};

	var closestFruit = function (fruit) {
		var closest = fruit[0];

		for (var i = 1; i < fruit.length; i++) {
			closest = closest.distance < fruit[i].distance ? closest : fruit[i];
		}

		return closest;
	};

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

	var isFruitGood = function (type) {
		var me = get_my_item_count(type);
		var them = get_opponent_item_count(type);
		var toWin = Math.ceil(get_total_item_count(type) / 2);

		if (me < toWin && them < toWin) {
			return true;
		}
	};

	var isFruitRare = function (type) {
		if (type <= Math.ceil(get_number_of_item_types() / 2)) {
			return true;
		}
	};

	var filterFruit = function (fruit) {
		var goodList = [];
		var rareList = [];

		for (var i = 0; i < fruit.length; i++) {
			if (isFruitGood(fruit[i].type)) {
				goodList.push(fruit[i]);
			}
		}

		for (var i = 0; i < goodList.length; i++) {
			if (isFruitRare(goodList[i].type)) {
				rareList.push(goodList[i]);
			}
		}

		if (rareList.length > 0) {
			return rareList;
		}else if (goodList.length > 0) {
			return goodList;
		}else {
			return fruit;
		}
	};

	var makeMove = function () {
		var me = getPos();
		var fruit = filterFruit(mapFruit());
		var next = closestFruit(fruit);
		var x = me.x - next.x;
		var y = me.y - next.y;

		if (x === 0 && y === 0) {
			return TAKE;
		}

		console.log(x + ' = ' + y + ' || ' + next.x + ' = ' + next.y);

		if (checkX(x)) {
			return checkX(x);
		}

		if (checkY(y)) {
			return checkY(y);
		}

		console.log('derp');
	};

	var start = function () {

	};


	return {
		start: start,
		makeMove: makeMove
	}
}