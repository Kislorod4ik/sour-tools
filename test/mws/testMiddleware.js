module.exports = (baseCtx, bot) => {
	return async (ctx, next) => {
		if (!ctx.from) return; // Если нету .form, выходит

		const index = `${ctx.from.id}`

		if (!ctx.users.body[index]){ // Если в базе нету пользователя, добавляем его и сохраняем БД
			ctx.users.body[index] = ctx.from;
			ctx.users.save();
			ctx.logger.info('Добавлен новый юзер')
		}

		next();
	}
}