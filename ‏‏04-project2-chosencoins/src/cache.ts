export default class Cache {
    data: {
        key: string;
        content: object;
        when: Date;  // when the data created
    }[] = [];   // = [] --> init data array
    
    timeout: number = 1000 * 30; // I need to change to 120 to get 2 min, now its 30 sec

    // SINGLETON - I don't want that someone else will create a new cache.
    // a. I need to define the class Cache as private (I did that on the constructor).
    // b. I need to define the new cache as static.
    static instance: Cache;
    public static getInstance(): Cache {
        if(!this.instance) this.instance = new Cache();
        return this.instance;
    }

    private constructor() {};

    public async getData(key: string) {
        // console.log(key);
        // check if this data already is in CACHE:
        // 1. find the first data in cache array
        const existingData = this.data.find(e => e.key === key);  // find the first in array
        
        // 2a. if there is data in cache & the data created less than 2 min ---> return the data!
        if(existingData) {
            const now = new Date();
            const when = new Date(existingData.when);  // the time when the record was pushed to cache

            const diff = now.getTime() - when.getTime();  // diff = difference in milliseconds
            // date. getTime() --> return timestamp, which is the number of milliseconds since the Epoch (1.1.1970)
            if(diff < this.timeout){
                // console.log('CACHE HIT');
                return existingData.content;
            }
        } 
        
        // 2b. if there isn't data in cache ---> fetch from API & return the 'data.content'
        const response = await fetch(key);  // key- URL of API
        const json = await response.json();
        this.setData(key, json);
        // console.log('CACHE MISS');
        return this.data.find(e => e.key === key).content;
    }

    public setData(key: string, content: object) {
        const existingDataIndex = this.data.findIndex(e => e.key === key);  
        if(existingDataIndex > 0) {  // (existingDataIndex > 0) because it can return -1...
            this.data[existingDataIndex] = {
                key,
                content,
                when: new Date()
            }
        } else {
            this.data.push({
                key,
                content,
                when: new Date()
            })
        }
    }
}