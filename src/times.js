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
	processingTime: (time, extra = {}) => {
		extra.body ??= ["years", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
		extra.sep ??= " ";
		extra.skip_zero ??= true;
		extra.formatting ??= {};
		extra.formatting.years ??= "г";
		extra.formatting.weeks ??= "н";
		extra.formatting.days ??= "д";
		extra.formatting.hours ??= "ч";
		extra.formatting.minutes ??= "м";
		extra.formatting.seconds ??= "с";
		extra.formatting.milliseconds ??= "мс";

		const methods = new Set(extra.body);
		let t = getTime(time);
		const back = {};
		if (methods.has("years")){
			back.years = Math.floor( t / 31536000000 );
			t %= 31536000000;			
		}	
		if (methods.has("weeks")){
			back.weeks = Math.floor( t / 604800000 );
			t %= 604800000;			
		}			
		if (methods.has("days")){
			back.days = Math.floor( t / 86400000 );
			t %= 86400000;			
		}
		if (methods.has("hours")){
			back.hours = Math.floor( t / 3600000 );
			t %= 3600000;			
		}	
		if (methods.has("minutes")){
			back.minutes = Math.floor( t / 60000 );
			t %= 60000;			
		}	
		if (methods.has("seconds")){
			back.seconds = Math.floor( t / 1000 );
			t %= 1000;			
		}	
		if (methods.has("milliseconds")){
			back.milliseconds = t;		
		}	
		
		back.str = extra.body.reduce((result, key) => {
			if (back[key] || !extra.skip_zero) result.push(back[key] + extra.formatting[key]);
			return result
		}, []).join(extra.sep)

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

