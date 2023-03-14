const fs = require('fs');

class BaseConstructor {
    constructor(filename, dirpath) {
        this.dirpath = dirpath ?? "database";
        this.pathfile = `${this.dirpath}/${filename}`;  
        if (!fs.existsSync(this.dirpath)) fs.mkdirSync(this.dirpath);
    }
    exists() {
        return fs.existsSync( this.pathfile );
    }   
    read() {
        return fs.readFileSync( this.pathfile , {encoding: 'utf-8'});
    }
    save(content){
        fs.writeFileSync( this.pathfile , content);
    }
    delete(){
        fs.unlinkSync(this.pathfile);
    }
    copy(filename){
        return new this.constructor(filename, () => JSON.parse(this.toJSON()), this.dirpath);
    }
    transfer(filename){
        this.delete();
        return this.copy(filename);
    } 
    toString(){
        return JSON.stringify(this.body);
    }
    toJSON(){
        return this.toString();
    }
}

class JsonBase extends BaseConstructor {
    constructor( filename, pattern, dirpath, extra = {} ){
        super(`${filename}.json`, dirpath);  
        extra.beautiful ??= true;
        this.extra = extra;  
        if (this.exists()) this.read()
        else {
            this.body = pattern();
            this.save()
        }
    }
    toString(){
    	return this.extra.beautiful ? JSON.stringify(this.body, null, 4) : JSON.stringify(this.body);
    }
    read() {
        this.body = JSON.parse(super.read());
    }
    save(){
        super.save(this.toJSON());
    }
}

class JsonBases {
    constructor(dirpath) {
        this.cache = {};
        this.dirpath = dirpath ?? "database";
    }
    has(dbname){
        dbname = `${dbname}`;
    	return this.cache[dbname] !== undefined || fs.existsSync(`${this.dirpath}/${dbname}.json`);
    }
    get(dbname, pattern, extra) {
        dbname = `${dbname}`;
    	return this.cache[dbname] ?? (this.cache[dbname] = new JsonBase(dbname, pattern, this.dirpath, extra))
    }
}

class ClassesBase extends BaseConstructor{
    constructor(filename, baseclass, dirpath) {
        super(`${filename}_classes.json`, dirpath);
        this.baseclass = baseclass;
        if ( this.exists() ) this.read();
        else{
            this.body = [];
            this.save();
        }
    }
    read() {
        this.body = [];
        JSON.parse( super.read()).forEach(obj => {
            this.body.push(new this.baseclass(obj));
        })
    }
    save() {
        super.save(JSON.stringify( this.body, null, 4))
    }    
    add(class_) {
        this.body.push(class_);
        this.save();
        return class_;
    }
    delete(class_) {
        const [back] = this.body.splice(this.body.indexOf(class_), 1);
        this.save();
        return back;
    }
}

class MapBase extends BaseConstructor{
    constructor(filename, pattern, dirpath) {
        super(`${filename}.txt`, dirpath);
        if (this.exists()) this.read();
        else {
        	this.body = pattern ? pattern() : {};
        	this.save();
        }
    }

    read(){
        this.body = {};
        let need_resave = false;
        super.read().split('\n').forEach(e => {
            if (!e) return;
            const [key, body] = JSON.parse(e);
            if (this.body[key]) need_resave = true;
            this.body[key] = body;
        });
        if (need_resave) this.save();
    }

    shapeToString(key, body){
        return `${JSON.stringify([key, body])}\n`
    }

    save(){
        let content = '';
        for(const key in this.body){
            content += this.shapeToString(key, this.body[key])
        }
        super.save(content);
    }


    set(key, body) {
        key = `${key}`;
        this.body[key] = body;
        fs.appendFileSync(this.pathfile, this.shapeToString(key, body));
        return body
    }

    get(key) {
        key = `${key}`;
        return this.body[key] ?? null;
    }

    find(body) {
        for (const key in this.body){
            if (this.body[key] === body){
                return key;
            }
        }
        return null;
    }
}

module.exports = {
	JsonBase, 
	ClassesBase, 
	MapBase, 
	JsonBases, 
	BaseConstructor
}
