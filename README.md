<div align="center">

  <p>
    <img src="https://cdn-icons-png.flaticon.com/512/1046/1046566.png" alt="icon" width="128" height="128">
  </p>

  <h1>Sour-tools</h1>


  <p>Пакет содержащий многие инструменты и ультилиты, способные ускорить и упростить работу с кодом. Присуствует TelegrafTools, способный удобнее работать с библиотекой Telegraf</p>

</div>


## Установка

Установка через npm:

```shell
$ npm i sour-tools
```

Импортируйте модуль:

```js
const sourTools = require('sour-tools');
```
<div align="center">
  <h3>В директории проекта "test" находятся примеры использования инструментов</h3>
</div>

<h2>Список инструментов</h2>

- [bases](#bases)
  - [Общие методы](#bases-methods)
  - [JsonBase()](#JsonBase)
  - [JsonBases()](#JsonBases)
  - [ClassesBase()](#ClassesBase)
  - [MapBase()](#MapBase)
+ [times](#times)
  + [Операции](#mathtime)
  + [Форматирование](#formatting)
  + [Считывание](#fromtime)
- [Logger](#Logger)
- [Localization](#Localization)
- [TelegrafTools](#TelegrafTools)

<h1 id="bases">bases</h1>

<h2 id="bases-methods">Методы любой базы</h2>

```js
delete() // удаление бд 
copy(filename) // Копирование бд (Кроме ClassesBase)
transfer(filename) // Перенос бд (Кроме ClassesBase)
```

<h2 id="JsonBase">JsonBase()</h2>
Пример использования JsonBase:

```js
const { bases } = require("sour-tools");
/* JsonBase( filename, pattern, ?dirpath="database", extra = {
  ?beautiful=true (красивый JSON в файле)
} )*/

const users = new bases.JsonBase("users", () => ({}) );
console.log(users.toString());

const chats = new bases.JsonBase("chats", () => [123,1234], "files");
chats.body.push(321);
chats.save();
// chats.body = [123, 1234, 321]

const settings = new bases.JsonBase("settings", () => ({
    admins: [1234, 5678]
  }), null, { beautiful: false });
console.log(settings.body["admins"]) // -> [1234, 5678]

```
<h2 id="JsonBases">JsonBases()</h2>
Пример использования JsonBases:

```js
const { bases } = require("sour-tools");
// JsonBases( ?dirpath="database" )
const form = {
  id: 123,
  username: "@Kislorod4ik",
  first_name: "Никита"
};

// Плюсы испльзования JsonBases заключается в том, что он имеет свой кэш, что позволяет не считывать файл, а создать/считать его один раз и использовать из кэша, за счет чего если попытаться одновременно в двух местах использовать users.get одного и того же человека, не произойдет рассинхронизации данных, так как класс JsonBase будет один и тот же
const users = new bases.JsonBases("users");

console.log(users.has(form.id)) // false
const user = users.get(form.id, () => form); // create file: "users/123.json"
console.log(users.has(form.id)) // true

user.body.first_name = "Nikita";
user.save();

```

<h2 id="ClassesBase">ClassesBase()</h2>
Пример использования ClassesBase:

```js
const { bases } = require("sour-tools");
// ClassesBase( filename, baseclass, ?dirpath="database" )

class User {
  constructor(form){
    this.id = form.id;
    this.username = form.username;
    this.first_name = form.first_name;
  }
  toJSON(){
    return {
      id: this.id,
      username: this.username,
      first_name: this.first_name
    }
  }
}

const users = new bases.ClassesBase("users", User);

users.add(new User({id: 123, username: "@Kislorod4ik", first_name: "Никита"}))
users.save()

for (const user of users.body){
  if (user.id === 123){
    const deleted_user = users.delete(user);
    break;
  }
}

console.log(users.body);

```
<h2 id="MapBase">MapBase()</h2>
Пример использования MapBase:

```js
const { bases } = require("sour-tools");
// MapBase( filename, ?pattern=()=>({}), ?dirpath="database" )

const usernames = new bases.MapBase("usernames");

usernames.set(123, "@Kislorod4ik");
console.log(usernames.get("123")) // @Kislorod4ik
console.log(usernames.find("@Kislorod4ik")) // 123
console.log(usernames.find("@NotFound"), usernames.get("404")) // null, null

/*
Плюс MapBase в отличии от JsonBase, это скорость сохранения.
При базе +500000, JsonBase намного дольше сохраняет файл. MapBase же в свою очередь использует дозапись в файл, и во время запуск программы считывает файл один раз
*/

```

<h1 id="times">times</h1>

<h2 id="mathtime">Операции со временем</h2>
Примеры операций:

```js
const { times } = require("sour-tools");
// differenceTime( ?val_1=new Date(), ?val_2=new Date() )
console.log(times.differenceTime( new Date() - 1000 )); // -> 1000 (Без второго аргумента, расчет идёт от текущего времени)
console.log(times.differenceTime( new Date().getTime() + 10000, new Date())); // -> 10000

// summTime( ?val_1=new Date(), ?val_2=new Date() )
console.log(times.summTime( new Date(), 3 * 60 * 60 * 1000)); // -> Время сейчас + 3ч 

// processingTime (val)
console.log(times.processingTime(times.differenceTime(
  new Date(),
  new Date().getTime() - 30 * 24 * 60 * 60 * 1000
)));
/*
Расчет разницы во времени, с дальшейним преобразованием
---> {
  years: 0,
  weeks: 4,
  days: 2,
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
  str: '4н 2д '
}
*/

```

<h2 id="formatting">Форматирование</h2>
Примеры форматирований:

```js
const { times } = require("sour-tools");
// timeFormat( format, ?val=new Date() )
console.log(times.timeFormat("%d-%M-%y")); // -> 14-03-2023
console.log(times.timeFormat("%h:%m:%s.%S", new Date().getTime())); // -> 06:13:15.35
console.log(times.timeFormat("%y.%M.%d", new Date(2020, 5, 9))); // -> 2020.06.09

// timeFormatUTC( format, ?val=new Date() )
console.log(times.timeFormatUTC("%h:%m:%s.%S", new Date().getTime())); // -> 02:13:15.35

```
Таблица форматов
| Символ | Тип  |
|----------|----------|
| %y    | FullYear   | 
| %M    | Month   | 
| %d    | Date   | 
| %h    | Hours   | 
| %m    | Minutes   | 
| %s    | Seconds   | 
| %S    | Milliseconds   | 
| %t    | Timestamp   | 


<h2 id="fromtime">Считывание времени</h2>
Примеры считывания:

```js
const { times } = require("sour-tools");
// timeFrom( obj )
// timeUTCFrom( obj )
const text = '14.03.2023 21:01';
const [, d, M, y, h, m] = text.match(/(\d{2}).(\d{2}).(\d{4})\s(\d{2}):(\d{2})/);

const date = times.timeFrom({d, M, y, h, m}),
  dateUTC = times.timeUTCFrom({d, M, y, h, m});

console.log(date.toLocaleString(), dateUTC.toLocaleString()); 
// -> 14.03.2023, 21:01:00   15.03.2023, 01:01:00


console.log( times.timeFrom({y: 2020, d: 15, M: 7 }).toLocaleString() );
// -> 15.07.2020, 00:00:00

```


<h2 id="Logger">Logger()</h2>
Примеры использования:

```js
const { Logger } = require("sour-tools");
/* new Logger({
    ?to_file=true, (записывание логов в файлы)
    ?dirpath="logs", (директория логов)
    ?time_format="%h:%m:%s.%S", (формат времени)
    ?date_format="%d-%M-%y", // (формат даты, название файлов)
})*/
const logger = new Logger();
const logger2 = new Logger({time_format: "%t"});

logger.log("log");
logger2.success("&9Этот текст будет синий в консоле");
logger.warn("&cР&6а&eд&aу&bж&9н&5ы&cй");
logger2.debug("Object:", {test: "123"});
logger.info("Info", "информация", "§6§l§nинформация2");
logger2.error("error");

```
Результат выполнения:

![image](https://user-images.githubusercontent.com/69964743/224957982-cc99a4e3-ba29-4594-89d3-d52a5cb2ca48.png)

Файл лога в папке logs, файл: "%d-%M-%y.log":

![image](https://user-images.githubusercontent.com/69964743/224957242-ac6e2c88-3745-4ba4-b458-9a4562245ca6.png)

Таблица кодов
| Ключ | Значение  |
|----------|----------|
| 0 | Черный |
| 1 | Темно-синий |
| 2 | Темно-зеленый |
| 3 | Темно-бирюзовый |
| 4 | Темно-красный |
| 5 | Темно-фиолетовый |
| 6 | Золотой |
| 7 | Серый |
| 8 | Темно-серый |
| 9 | Синий |
| a | Зеленый |
| b | Бирюзовый |
| c | Красный |
| d | Фиолетовый |
| e | Желтый |
| f | Белый |
| r | Сброс форматирования |
| k | Мерцание |
| l | Жирный |
| m | Зачеркнутый |
| n | Подчеркнутый |
| o | Курсивный |

<h2 id="Localization">Localization()</h2>
Примеры использования:

```js
const { Localization } = require("sour-tools");
/* new Localization(dirpath, ?extra={
  default_lang ??= (Первый подгруженый .lang файл из dirpatch)
})*/

// Создание локализации с указанием директории языковых пакетов, в которой они хранятся в формате code.lang: "ru.lang", "en.lang"
const localization = new Localization("langs");
console.log(localization.langs); // -> ["en", "ru"]
console.log(localization.extra.default_lang); // -> "en"

// get( key, ?args=null, ?lang=default_lang )
console.log(localization.get("message.start")); // -> Hello
console.log(localization.get("message.start", null, "ru")); // -> Привет
localization.extra.default_lang = "ru";
console.log(localization.get("message.start")); // -> Привет
console.log(localization.get("message.time", [new Date().toLocaleString()], "en")); // -> Time: 14.03.2023, 13:52:41
console.log(localization.get("message.time", [new Date().toLocaleString()])); // -> Время: 14.03.2023, 13:52:41
console.log(localization.get("message.time", ["message.start"], "en")); // -> Time: Hello


// getTexts( key, ?args=null ) - получение текста на всех языках. 
console.log(localization.getTexts("message.test", [123, "@Kislorod4ik"])); 
// -> [ 'Val_1: 123\nVal_2: @Kislorod4ik', 'Переменая_1: 123\nПеременая_2: @Kislorod4ik' ]


```
Пример файла ru.lang:
```
message.start=Привет
message.time=Время: *
message.test=Переменая_1: *\nПеременая_2: *
```
Пример файла en.lang:
```
message.start=Hello
message.time=Time: *
message.test=Val_1: *\nVal_2: *
```

<h2 id="TelegrafTools">TelegrafTools()</h2>
Примеры использования TelegrafTools:

```js
const {TelegrafTools } = require('sour-tools');
const { Telegraf, Markup} = require('telegraf');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

/* TelegrafTools( bot, ?exrta={
  ?loging=true, (логирование загрузки библиотек/модулей)
  ?logger_settings={}, (настройки для класс Logger)
}) */
const telegrafTools = new TelegrafTools(bot);
bot.context.logger.success("TelegrafTools был инициализирован");

// loadLibrary( nameS, ?dirpath="/libs", ?extra={ ?file_extension="js" } )
telegrafTools.loadLibrary("testLib"); 
console.log(bot.context.testLib.info); // -> "info testLib"
console.log(bot.context.testLib.customGetInfo()); // -> "info testLib"

// loadMiddleware( nameS,  ?dirpath="/mws", ?extra={ ?file_extension="js" } )
telegrafTools.loadMiddleware(["testMw"/*, "testMw2"*/]); // Применяет файл на bot.use

bot.start(async ctx => {
  ctx.logger.info("start", ctx.from.id);
  ctx.send("Тестовое сообщение", Markup.inlineKeyboard([
    [Markup.button.callback("Кнопка", "test")],
    [Markup.button.callback("Кнопка2", "test2")]
  ]));
})

bot.action("test", async ctx => ctx.alert("Вы нажали на первую кнопку"));

bot.action("test2", async ctx => {
  ctx.logger.info("Юзер:", ctx.from.id, "нажал на 2ю кнопку");
  return ctx.alert("Вы нажали на вторую кнопку", {show_alert: true});
});

bot.launch({dropPendingUpdates: true});

```

Файл "testLibs.js" в директории "./libs"
```js 
module.exports = (baseCtx, bot) => {
  const basic_options = { parse_mode: 'HTML', disable_web_page_preview: true };
  Object.assign(bot.context, {
    send: async function(text, extra = {}) { 
      const chat_id = extra.chat_id || this.chat.id;
      delete extra.chat_id;
      this.logger.info('sendMessage', chat_id, text);
      return this.telegram.sendMessage(chat_id, text, Object.assign(extra, basic_options));
    },
    alert: async function(text, extra = {}) { 
      return this.answerCbQuery(text, extra).catch(e => {})
    }
  })
  return {
    info: "info testLib",
    customGetInfo: function() {return this.info}
  }
}
```

Файл "testMw.js" в директории "./mws"
```js 
module.exports = (baseCtx, bot) => {
  return async (ctx, next) => {
    if (ctx.message) ctx.logger.log('&6input message&f: &b', ctx.message);
    return next();
  }
}
```