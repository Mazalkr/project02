var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class Cache {
    static getInstance() {
        if (!this.instance)
            this.instance = new Cache();
        return this.instance;
    }
    constructor() {
        this.data = []; // = [] --> init data array
        this.timeout = 1000 * 30; // I need to change to 120 to get 2 min, now its 30 sec
    }
    ;
    getData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(key);
            // check if this data already is in CACHE:
            // 1. find the first data in cache array
            const existingData = this.data.find(e => e.key === key); // find the first in array
            // 2a. if there is data in cache & the data created less than 2 min ---> return the data!
            if (existingData) {
                const now = new Date();
                const when = new Date(existingData.when); // the time when the record was pushed to cache
                const diff = now.getTime() - when.getTime(); // diff = difference in milliseconds
                // date. getTime() --> return timestamp, which is the number of milliseconds since the Epoch (1.1.1970)
                if (diff < this.timeout) {
                    // console.log('CACHE HIT');
                    return existingData.content;
                }
            }
            // 2b. if there isn't data in cache ---> fetch from API & return the 'data.content'
            const response = yield fetch(key); // key- URL of API
            const json = yield response.json();
            this.setData(key, json);
            // console.log('CACHE MISS');
            return this.data.find(e => e.key === key).content;
        });
    }
    setData(key, content) {
        const existingDataIndex = this.data.findIndex(e => e.key === key);
        if (existingDataIndex > 0) { // (existingDataIndex > 0) because it can return -1...
            this.data[existingDataIndex] = {
                key,
                content,
                when: new Date()
            };
        }
        else {
            this.data.push({
                key,
                content,
                when: new Date()
            });
        }
    }
}
