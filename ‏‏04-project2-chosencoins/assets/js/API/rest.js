var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cache from "../cache.js";
// GET all coins data:
export function getCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        // NOTE TO SELF: do you need to use cache or you can fetch the data in regular way?
        // Using cache:
        // const cacheResponse = await cache.getData('https://api.coingecko.com/api/v3/coins/list'); //getData(key)
        const cacheResponse = yield cache.getData('coins.json');
        const coins = (cacheResponse); // NOTE TO SELF: unknown - I CAN REMOVE THAT?
        return coins;
    });
}
// GET more info on specific coin:
export function getCoinData(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Using cache:
        const cacheResponse = yield cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = (cacheResponse); // NOTE TO SELF: unknown - I CAN REMOVE THAT?
        return coinData;
    });
}
