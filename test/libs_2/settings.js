module.exports = (baseCtx, bot) => {
	// Создаём базу данных, с деффолтным значением { admins: [1234,5678] }
	const db = new baseCtx.bases.JsonBase("settings", () => ({ admins: [1234,5678]} ))
	return {
		get: (key) => db.body[key],
		set: (key, body) => {
			db.body[key] = body;
			db.save();
			return db;
		}
	}
}