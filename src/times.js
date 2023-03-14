const getTime = (obj) => {
	if (obj instanceof Date) return obj.getTime();
	if (typeof(obj) == "number") return obj;
	return new Date().getTime();
}

const getDate = (obj) => {
	if (obj instanceof Date) return obj;
	if (typeof(obj) == "number") return new Date(obj);
	return new Date();
}

const formatting = (obj, string) => {
	for (const i in obj){
		string = string.replaceAll(`%${i}`, obj[i]);
	}
	return string;
}

const padZero = (value) => `${value}`.padStart(2, '0');

module.exports = {
	getTime, getDate,
	differenceTime: (time1, time2) => Math.abs( getTime(time1) - getTime(time2)),
	summTime: (time1, time2) => getTime(time1) + getTime(time2),
	processingTime: (time) => {
		let t = getTime(time);
		const back = {};
		back.years = Math.floor( t / 31536000000 );
		t %= 31536000000;
		back.weeks = Math.floor( t / 604800000 );
		t %= 604800000;
		back.days = Math.floor( t / 86400000 );
		t %= 86400000;
		back.hours = Math.floor( t / 3600000 );
		t %= 3600000;	
		back.minutes = Math.floor( t / 60000 );
		t %= 60000;	
		back.seconds = Math.floor(t / 1000 );

		back.milliseconds = Math.trunc(t);
		back.str = (back.years ? `${back.years}г ` : '') + 
			(back.weeks ? `${back.weeks}н ` : '') + 
			(back.days ? `${back.days}д ` : '') +
			(back.hours ? `${back.hours}ч ` : '') +
			(back.minutes ? `${back.minutes}м ` : '') + 
			(back.seconds ? `${back.seconds}с ` : '') +
			(back.milliseconds ? `${back.milliseconds}мс ` : ''); 
		if (back.str === '') back.str = '0'
		return back;			
	},

	timeFormat: (format, time) => {
		time = getDate(time);
		return formatting({
			t: time.getTime(),
			S: time.getMilliseconds(),
			s: padZero(time.getSeconds()),
			m: padZero(time.getMinutes()),
			d: padZero(time.getDate()),
			h: padZero(time.getHours()),
			M: padZero(time.getMonth() + 1),
			y: time.getFullYear()
		}, format);
	},

	timeFormatUTC: (format, time) => {
		time = getDate(time);
		return formatting({
			t: time.getTime(),
			S: time.getUTCMilliseconds(),
			s: padZero(time.getUTCSeconds()),
			m: padZero(time.getUTCMinutes()),
			d: padZero(time.getUTCDate()),
			h: padZero(time.getUTCHours()),
			M: padZero(time.getUTCMonth() + 1),
			y: time.getUTCFullYear()
		}, format);
	},

	__methods_from__: {S: "Milliseconds", s: "Seconds", m: "Minutes", d: "Date", h: "Hours", M: "Month", y: "FullYear"},

	timeFrom: function(obj){
		const time = new Date();
		for (const m in this.__methods_from__){
			time[`set${this.__methods_from__[m]}`]( obj[m] ? m === "M" ? obj[m] - 1 : obj[m] : 0 )
		}
		return time
	},

	timeUTCFrom: function(obj){
		const time = new Date();
		for (const m in this.__methods_from__){
			time[`setUTC${this.__methods_from__[m]}`]( obj[m] ? m === "M" ? obj[m] - 1 : obj[m] : 0 )
		}
		return time
	}
}

