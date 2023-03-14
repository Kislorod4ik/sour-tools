module.exports = (baseCtx, bot) => {
	bot.start(async ctx => {
		ctx.reply( ctx.localization.get("message.start", null, "ru") )
		ctx.reply( ctx.localization.get("message.start", null, "en") )
	})
}