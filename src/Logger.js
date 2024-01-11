const fs = require('fs');
const times = require('./times');


const ansiCodes = {
	"0":  "\x1b[30m", // Черный
	"1":  "\x1b[34m", // Темно-синий
	"2":  "\x1b[32m", // Темно-зеленый
	"3":  "\x1b[36m", // Темно-бирюзовый
	"4":  "\x1b[31m", // Темно-красный
	"5":  "\x1b[35m", // Темно-фиолетовый
	"6":  "\x1b[33m", // Золотой
	"7":  "\x1b[37m", // Серый
	"8":  "\x1b[90m", // Темно-серый
	"9":  "\x1b[94m", // Синий
	"a":  "\x1b[92m", // Зеленый
	"b":  "\x1b[96m", // Бирюзовый
	"c":  "\x1b[91m", // Красный
	"d":  "\x1b[95m", // Фиолетовый
	"e":  "\x1b[93m", // Желтый
	"f":  "\x1b[97m", // Белый
	"r":  "\x1b[0m",  // Сброс форматирования
	"k":  "\x1b[5m",  // Мерцание
	"l":  "\x1b[1m",  // Жирный
	"m":  "\x1b[9m",  // Зачеркнутый
	"n":  "\x1b[4m",  // Подчеркнутый
	"o":  "\x1b[3m",  // Курсивный
};

const arrayCodes = Object.entries(ansiCodes).reduce((result, [code, value]) => [
  ...result,
  [new RegExp(`(§|&)${code}`, 'gi'), value],
], []);


module.exports = class Logger {
	constructor(extra = {}){

		extra.to_file ??= true;
		extra.dirpath ??= "logs";
		extra.time_format ??= "%h:%m:%s.%S";
		extra.date_format ??= "%d-%M-%y";

		this.onLogFunction = null;
		this.extra = extra;
		if(extra.to_file && !fs.existsSync(extra.dirpath)) {
			fs.mkdirSync(extra.dirpath);
		}
	}

	toStringValue(value) {
		if (typeof(value) === 'object') {
			try {
				return JSON.stringify(value);
			}
			catch {}
		}
		return `${value}`;
	}

	processColor(value){
		if (typeof(value) !== "string") value = `${value}`
		for (const [codes, code] of arrayCodes){
			value = value.replace(codes, code)
		}
		return value;
	}

	processClearColor(value){
		if (typeof(value) !== "string") value = this.toStringValue(value);
		for (const [codes, code] of arrayCodes){
			value = value.replace(codes, '')
		}
		return value;
	}
	

	write(prefix, args, prefixColor) {
		const line = `&r&8[&${prefixColor}${prefix}&8][&f${times.timeFormatUTC(this.extra.time_format)}&8] &f${args.map(e => this.toStringValue(e)).join(' ')}`;
		console.log(this.processColor(line))
		if (this.extra.to_file) {
			const logFileName = times.timeFormatUTC(`${this.extra.date_format}.log`);
			fs.appendFileSync(`${this.extra.dirpath}/${logFileName}`, `${this.processClearColor(line)}\n`);
		}
		if (this.onLogFunction) {
			this.onLogFunction(line)
		}
	}

	log(...args) {
		this.write('LOG', args, 'f')
	}

	success(...args) {
		this.write('SUCCESS', args, 'a')
	}

	warn(...args) {
		this.write('WARN', args, 'e')
	}

	debug(...args) {
		this.write('DEBUG', args, 'b')
	}

	info(...args) {
		this.write('INFO', args, '6')
	}

	error(...args) {
		this.write('ERROR', args, 'c')
	}

}
