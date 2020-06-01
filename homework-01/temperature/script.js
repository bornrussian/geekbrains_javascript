'use strict';

function convertTemperatureCelsius2Fahrenheit (tC) {
	if (Number (tC) == tC) {
		return (9 / 5) * tC + 32;
	} else {
		return NaN;
	}
}

let tC = prompt('Введите значение температуры в цельсиях и мы посчитаем, сколько это будет в фаренгейтах:');

alert (`${tC} градусов Цельсия = ${convertTemperatureCelsius2Fahrenheit(tC)} градусов по Фаренгейту`);
