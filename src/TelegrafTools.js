const Logger = require("./Logger");

module.exports = class TelegrafTools {

	constructor(bot, extra = {}){
		extra.loging ??= true;
		extra.logger_settings ??= {};
		this.extra = extra;

		this.logger = new Logger(extra.logger_settings)
		bot.context.logger = this.logger;
		this.bot = bot;

	}

	loadComponent(name, dirpath, extra = {}){
		extra.file_extension ??= "js";
		return require(`${process.cwd()}/${dirpath ?? ''}/${name}.${extra.file_extension}`)(this.bot.context, this.bot);
	}

	loadLibrary(nameS, dirpath = "libs", extra = {}){
		if (typeof(nameS) === "string") nameS = [nameS]
		nameS.forEach(name => {
			if(this.extra.loging) this.logger.info("Загрузка билиотеки: ", `${dirpath}/${name}`);
			const result = this.loadComponent(name, dirpath, extra)
			if (result) this.bot.context[name] = result;			
		})
	}

	loadMiddleware(nameS, dirpath = "mws", extra = {}) {
		if (typeof(nameS) === "string") nameS = [nameS]
		nameS.forEach(name => {
			if(this.extra.loging) this.logger.info("Загрузка миддлвара: ", `${dirpath}/${name}`);
			const result = this.loadComponent(name, dirpath, extra)
			this.bot.use(result);;			
		})		
	}

}