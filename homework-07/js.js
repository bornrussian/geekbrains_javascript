"use strict";
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
	barriersCount: 5,
};

const config = {
    settings,
    init(userSettings) { 
        Object.assign(this.settings, userSettings);
    },
    getRowsCount() {
        return this.settings.rowsCount;
    },
    getColsCount() {
        return this.settings.colsCount;
    },
    getSpeed() {
        return this.settings.speed;
    },
    getWinFoodCount() {
        return this.settings.winFoodCount;
    },    
	getBarriersCount() {
        return this.settings.barriersCount;
    },    
    validate() {
        const result = {
            isValid: true,
            errors: [],
        };
        if (this.settings.rowsCount < 10 || this.settings.rowsCount > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        }
        if (this.settings.colsCount < 10 || this.settings.colsCount > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        }
        if (this.settings.speed < 1 || this.settings.speed > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        }
        if (this.settings.winFoodCount < 5 || this.settings.winFoodCount > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50].');
        }
        return result;
    },
};

const map = {
    cells: {},
    usedCells: [],
    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        this.cells = {}; // {x1_y1: td, x1_y2: td...}
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');

                this.cells[`x${col}_y${row}`] = td;
                tr.appendChild(td);
            }
        }
    },
    render(snakePointsArray, barrierPointsArray, foodPoint) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
			cell.textContent = '';
        }
        this.usedCells = [];

		// SNAKE render
        snakePointsArray.forEach((point, idx) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell);
        });
		if (snakePointsArray.length > 2) { // Пишем длину змейки на змейке
			const snakeLastElementCell = this.cells[`x${snakePointsArray[1].x}_y${snakePointsArray[1].y}`];
			snakeLastElementCell.textContent = snakePointsArray.length - 1;
		}
		
		// BARRIERS render
        barrierPointsArray.forEach((point, idx) => {
            const barrierCell = this.cells[`x${point.x}_y${point.y}`];
            barrierCell.classList.add('barrier');
            this.usedCells.push(barrierCell);
        });		
		
		// FOOD render
        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);
    }
};

const snake = {
    body: [],
    direction: null,
    lastStepDirection: null,
	mapMaxY: null,
	mapMaxX: null,
    init(startBody, direction, rowsCount, colsCount) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
		this.mapMaxY = rowsCount-1;
		this.mapMaxX = colsCount-1;
    },
    getBody() {
        return this.body;
    },
    getLastStepDirection() {
        return this.lastStepDirection;
    },
	getMapMaxY() {
		return this.mapMaxY;
	},
	getMapMaxX() {
		return this.mapMaxX;
	},
    isOnPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },
    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint());
        this.body.pop();
    },
    growUp() {
        const lastBodyIndex = this.body.length - 1;
        const lastBodyPoint = this.body[lastBodyIndex];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);
        this.body.push(lastBodyPointClone)
    },
    getNextStepHeadPoint() {
        const firstPoint = this.body[0];

		// Даём змейке возможность ходить сквозь стены:
        switch (this.direction) {
            case 'up':
                return {
					x: firstPoint.x, 
					y: firstPoint.y === 0 ? this.getMapMaxY() : firstPoint.y - 1
				};
            case 'right':
                return {
					x: firstPoint.x === this.getMapMaxX() ? 0 : firstPoint.x + 1, 
					y: firstPoint.y
				};
            case 'down':
                return {
					x: firstPoint.x, 
					y: firstPoint.y === this.getMapMaxY() ? 0 : firstPoint.y + 1
				};
            case 'left':
                return {
					x: firstPoint.x === 0 ? this.getMapMaxX() : firstPoint.x - 1, 
					y: firstPoint.y
				};
        }
    },
    setDirection(direction) {
        this.direction = direction;
    }
};

const barriers = {
    place: [], // [{x:,y:}, {x:,y:}, {x:,y:}, ...]
	clear () {
		this.place = [];
	},
	addNew(point) {
		this.place.push(point);
	},
    getPlaces() {
        return this.place;
    },	
    isOnPoint(point) {
		return this.place.some(barrier => barrier.x === point.x && barrier.y === point.y)
    },
};

const food = {
    x: null,
    y: null,
    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },
    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },
    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

const status = {
    condition: null,
    setPlaying() {
        this.condition = 'playing';
    },
    setStopped() {
        this.condition = 'stopped';
    },
    setFinished() {
        this.condition = 'finished';
    },
    isPlaying() {
        return this.condition === 'playing';
    },
    isStopped() {
        return this.condition === 'stopped';
    },
};

const game = {
    config,
    map,
    snake,
	barriers,
    food,
    status,
    tickInterval: null,
    init(userSettings) {
        this.config.init(userSettings);
        const validation = this.config.validate();

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.error(err);
            }
            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount());

        this.setEventHandlers();
        this.reset();
    },
    reset() {
        this.stop();
        this.snake.init(this.getStartSnakeBody(), 'up', this.config.getRowsCount(), this.config.getColsCount());
		this.barriers.clear();
		for (let i=0; i < this.config.getBarriersCount(); i++) { 
			this.barriers.addNew(this.getRandomFreeCoordinates()); 
		}
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        this.render();
    },
    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed());
        this.setPlayButton('Стоп');
    },
    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');
    },
    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра закончена', true);
    },    
	congratulate() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Вы выйграли! :-)', true);
    },
    tickHandler() {
        if (!this.canMakeStep()) {
            return this.finish();
        }

        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();
            this.food.setCoordinates(this.getRandomFreeCoordinates());
			this.barriers.addNew(this.getRandomFreeCoordinates());

            if (this.isGameWon()) {
                this.congratulate();
            }
        }
        this.snake.makeStep();
        this.render();
    },
    setPlayButton(textContents, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = textContents;
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },
    getStartSnakeBody() {
        return [{
            x: Math.floor(this.config.getColsCount() / 2),
            y: Math.floor(this.config.getRowsCount() / 2),
        }];
    },
    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', event => {
            this.keyDownHandler(event);
        });
    },
    getRandomFreeCoordinates() {
        const exclude = [...this.snake.getBody(), ...this.barriers.getPlaces(), this.food.getCoordinates()];

		while (true) {
				const rndPoint = {
					x: Math.floor(Math.random() * this.config.getColsCount()),
					y: Math.floor(Math.random() * this.config.getRowsCount()),
				};

				if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
					return rndPoint;
				}
		} 
    },
    render() {
        this.map.render(this.snake.getBody(), this.barriers.getPlaces(), this.food.getCoordinates());
    },
    playClickHandler() {
        if (this.status.isPlaying()) {
            console.log('stop')
            this.stop();
        } else if (this.status.isStopped()) {
            this.play('play');
        }
    },
    newGameClickHandler() {
        this.reset();
    },
    keyDownHandler(event) {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },
    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
            default:
                return '';
        }
    },
    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down'
            || direction === 'right' && lastStepDirection !== 'left'
            || direction === 'down' && lastStepDirection !== 'up'
            || direction === 'left' && lastStepDirection !== 'right';
    },
    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },
    canMakeStep() {
        const nextHeadPoint = this.snake.getNextStepHeadPoint();
        return !this.snake.isOnPoint(nextHeadPoint) && !this.barriers.isOnPoint(nextHeadPoint);
	},
};

window.addEventListener('load', () => game.init({speed: 5}));
