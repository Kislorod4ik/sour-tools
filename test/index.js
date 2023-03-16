const {TelegrafTools, Localization, Logger, bases, times } = require('./../index.js');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const timeStart = new Date(); // Записываем время начала инициализации

const logger = new Logger(); 
logger.log("Инициализация");

const bot = new Telegraf(process.env.BOT_TOKEN);
const telegrafTools = new TelegrafTools(bot, {
	logger_settings: {
		time_format: "%h:%m:%s.%S"
	}
});

// Запишем в context: bases, times, чтобы использовать базы в люблом месте
Object.assign(bot.context, {bases, times});

// Создаём базу данных в формате Json, для хранения информации о юзерах
bot.context.users = new bases.JsonBase("users", () => ({}));

// Подгужаем локализацию в context с указанием директории языковых пакетов, в которой они хранятся в формате code.lang: "ru.lang", "en.lang"
bot.context.localization = new Localization("langs");


// Загружаем Middleware, который подтянется из ./mws/testMiddleware.js и повесится на bot.use
telegrafTools.loadMiddleware("testMiddleware"); 
// так же есть возможность загружать список миддлвары: loadMiddleware(["testMiddleware", "testMiddleware2", "testMiddleware3"])

// Загружаем библиотеку, который подтянется из ./libs_2/settings.js и запишется в context.
// Если не указывать вторым аргументом "libs_2", то изначальная директория: "libs". В "loadMiddleware" изначальная директория "mws"
telegrafTools.loadLibrary(["settings", "start"], "libs_2")
// также как и в "loadMiddleware" есть возможность загрузить библиотеки списком


// Создаём комманду "time", которая отправляет в одном сообщение время на двух языках, на русском UTC, на англиском локальное
bot.command("time", async ctx => {
	ctx.reply( ctx.localization.get("message.time", ctx.times.timeFormatUTC("%h:%m:%s") ,"ru") + "\n"
		+ ctx.localization.get("message.time", ctx.times.timeFormat("%h:%m:%s"), "en") )
})



// Класс TelegrafTools, автоматический создаёт класс Logger и записывает в bot.context.logger,
// реализовано это для дальнейшего использования ctx.logger
bot.context.logger.success('Бот запускается, инициализация заняла: &6', times.processingTime( times.differenceTime( timeStart, new Date() ) ).str ) // если timeStart = new Date().getTime() - тоже будет работать

bot
.launch({dropPendingUpdates: true})
.catch((err) => console.error(err));