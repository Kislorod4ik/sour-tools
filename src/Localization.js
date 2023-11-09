const fs = require("fs");
const Logger = require("./Logger");

module.exports = class Localization {
	constructor(dirpath, extra={}){
		this.logger = new Logger();
		this.dirpath = dirpath ?? "langs";
		this.extra = extra;
		this.langs = [];
		this.body = {};
		if (!fs.existsSync(this.dirpath)) fs.mkdirSync(this.dirpath)
		this.load()
	}

	loadFile(filename) {
		const obj = {};
		const content = fs.readFileSync(`${this.dirpath}/${filename}` , {encoding: 'utf-8'}); 
		content.split('\n').forEach( (line, i) => {
			if (!line) return;
			const match = line.match(/([^=]+)=(.+)/);
			if (!match) return this.logger.warn("[LOCALIZATION]", `Ошибка считвание файла-локализации (${this.dirpath}/${filename}). Строка №${i}, полная строка: "${line}".`, "Строка была пропущена!");
			const [, id, body] = match;
			if (obj[id]) return this.logger.warn("[LOCALIZATION]", `Повторяется локализация (${this.dirpath}/${filename}). Строка №${i}, индификатор: "${id}".`, "Строка была перезаписана!");
			obj[id] = body;
		})
		return obj;		
	}

	load(){
		fs.readdirSync(this.dirpath).forEach(filename => {
			const match = filename.match(/(\w+)\.lang/);
			if (!match) return;
			this.langs.push(match[1])
			this.body[match[1]] = this.loadFile(filename);
		});
		if (this.langs.length){
			this.extra.default_lang ??= this.langs[0]
		}
		else {
			this.logger.error('[LOCALIZATION]', `Не найдено ни одного файла .lang в директории: "${this.dirpath}"`)
			throw new Error(`Не найдено ни одного файла .lang в директории: "${this.dirpath}"`)
		}
		
	}

	get(id, args, lang){
		lang ??= this.extra.default_lang;
		if (!this.body[lang] || !this.body[lang][id]) return id;
		let str = this.body[lang][id].replaceAll("\\n", '\n');
		if (args?.length){
			for (const arg of args){
				str = str.replace('*', this.get(arg, null, lang));
			}
		}
		return str;
	}

	getTexts(id, args) {
		return this.langs.reduce( (body, lang) => [...body, this.get(id, args, lang)], [] )
	}

}
