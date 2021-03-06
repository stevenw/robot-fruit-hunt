var Fruit = {
	id: 0,
	type: 0,
	loc: {x: 0, y: 0},
	rateType: function (rating) {
		if ( ! api.isGood(this.type)) {
			return -100;
		}

		rating += api.isRare(this.type) ? 50 : 0;
		rating += api.isRarest(this.type) ? 40 : 0;

		return rating;
	},
	rateArea: function (rating) {
		var distance = 0;
		var fruitMap = api.getMap();

		for (var i = 0, l = fruitMap.length; i < l; i++) {
			distance = api.getDistance(fruitMap[i].loc, this.loc);
			if (distance < 2 && this.id !== fruitMap[i].id) {
				rating += this.type === fruitMap[i].type ? 5 : 0;
			}
		}

		return rating;
	},
	rateDistance: function (rating) {
		var fromMe = api.getDistance(api.me(), this.loc);
		var fromThem = api.getDistance(api.them(), this.loc);

		rating -= fromMe * 5;

		return rating;
	},
	getRating: function () {
		var rating = 100;

		rating = this.rateType(rating);
		rating = this.rateDistance(rating);
		rating = this.rateArea(rating);


		return rating;
	}
};

function new_game() {
	// API Wrapper
	api = (function () {
		var getMe = function () {
			return {x: get_my_x(), y: get_my_y()};
		};

		var getThem = function () {
			return {x: get_opponent_x(), y: get_opponent_y()};
		};

		var isFruit = function (cell) {
			return has_item(get_board()[cell.x][cell.y]);
		};

		var getType = function (cell) {
			return get_board()[cell.x][cell.y];
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
			return get_total_item_count(type) - (get_my_item_count(type) +  get_opponent_item_count(type));
		};

		var isRare = function (type) {
			if (type <= Math.ceil(get_number_of_item_types() / 2)) {
				return true;
			}
		};

		var isRarest = function (type) {
			var types = [], rarest = {}, thisType = {};

			for (var i = 1, l = get_number_of_item_types(); i < l; ++i) {
				if (countType(i) > 0) {
					types.push({type: i, count: countType(i)});
				}
			}

			rarest = types[0];

			for (var i = 1, l = types.length; i < l; ++i) {
				rarest = rarest.count < types[i].count ? rarest : types[i];
			}

			if (rarest.type === type) {
				return true;
			}

			for (var i = 0, l = types.length; i < l; ++i) {
				if (types[i].type === type) {
					thisType = types[i];
				}
			}

			if (thisType.count === rarest.count) {
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
			getMap: getMap,
			isFruit: isFruit
		}
	}());

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
				target = target.getRating() > fruitMap[i].getRating() ? target : fruitMap[i];
			}

			return target;
		}

		var move = function () {
			var target = getTarget(api.getMap());
			var waypoint = {x: api.me().x - target.loc.x, y: api.me().y - target.loc.y};

			if ( ! waypoint) {
				trace('why is there no waypoint.');

				return PASS;
			}

			if ( ! target) {
				trace('why is there no target.');

				return PASS;
			}

			if (api.me().x === target.loc.x && api.me().y === target.loc.y) {
				if (api.isFruit(target.loc)) {
					return TAKE;
				}else {
					trace('trying to take an empty cell?');
				}
			}

			if (waypoint.x === 0 && waypoint.y === 0) {
				trace('why no take?!?');
			}

			if (checkX(waypoint.x)) {
				return checkX(waypoint.x);
			}

			if (checkY(waypoint.y)) {
				return checkY(waypoint.y);
			}

			trace('why is there no moves.');

			return PASS;
		};

		return {
			move: move
		}
	}(api));
}

function make_move() {
	if (!api) {
		trace('omg no api available?');
	}

	return elmoBot.move();
}