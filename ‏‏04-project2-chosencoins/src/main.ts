import CoinData from "./interfaces/coin-data.js";
import Coin from "./interfaces/coin.js";
import Cache from "./cache.js";
import { reduceCoins, reduceModal, reduceMoreInfo } from "./reducers/coins.js";
import { displayLoader, hideLoader } from "./loader.js";

// init MODAL bootstrap
declare const bootstrap: any;
const coinsModal = new bootstrap.Modal('#modal-chosen-coins');

// INIT cache
const cache = Cache.getInstance();
// console.log(cache);

// INIT chosenCoins array (relate to switch buttons):
let chosenCoins: Coin[] = [];  


// GET all coins data:
async function getCoins(): Promise<Coin[]> {
    // displayLoader();
    // NOTE TO SELF: do you need to use cache or you can fetch the data in regular way?

    // Using cache:
    // const cacheResponse = await cache.getData('https://api.coingecko.com/api/v3/coins/list'); //getData(key)
    const cacheResponse = await cache.getData('coins.json');
    hideLoader();
    const coins: Coin[] = (cacheResponse) as Coin[];  
    return coins;
}

// GET "more info" on specific coin:
async function getCoinData(coinId: string): Promise<CoinData> {
    // displayLoader();
    // Using cache:
    const cacheResponse = await cache.getData(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    hideLoader();
    const coinData: CoinData = (cacheResponse) as CoinData;
    return coinData;
}

// "More info" button clicked:
async function showMoreInfo(element: HTMLElement): Promise<void> {
    const coinId = element.id.substring('more-info-'.length);  
    // substring() will cut off the string 'more-info-' --> the ID will remain
    // 'more-info-'.length --> the .length for cut off those  string's chars length
    // console.log(`coin id is ${coinId}`);
    const coinData = await getCoinData(coinId);
    // console.log(coinData);
    const moreInfoHtml = reduceMoreInfo(coinData);
    hideLoader();
    document.getElementById(`data-container-${coinId}`).innerHTML = moreInfoHtml;
}


// "Switch" button clicked - NEW VERSION:
async function switchButtonClicked(element: HTMLElement): Promise<void>{
    let coinId = element.id.substring('switch-'.length);
    // console.log(coinId);  // id of selected coin
    const coins = await getCoins();
    hideLoader();
    let index = coins.findIndex(coin => coin.id === coinId);
    // console.log(coins[index]); // data on selected coin in object

    let selectedCheckBox = document.getElementById(`switch-${coinId}`) as HTMLInputElement;
    // console.log(selectedCheckBox.checked);  // true / false
    // let chosenCoinsIndex = chosenCoins.findIndex(coin => coin.id === coinId);
    if(selectedCheckBox.checked) {
        if(chosenCoins.length < 5) {
            // if(chosenCoinsIndex > -1) {
                // coins[index].switch = true;
                const checkArray = chosenCoins.some(coin => coin.id === coinId);  // prevent to enter the same coin to chosenCoins array
                if(!checkArray) {
                    chosenCoins.push(coins[index]);  // add selected coins to chosenCoins array
                    console.log(chosenCoins);
                }
            // }
        } else {
            loadCoinsModal(coins, index, chosenCoins, selectedCheckBox);
        }
    } else {
        // coins[index].switch = false;  
        let chosenCoinsIndex = chosenCoins.findIndex(coin => coin.id === coinId);
        if(chosenCoinsIndex > -1) {  // only splice when item is found
            chosenCoins.splice(chosenCoinsIndex, 1); // splice(index, how many items to remove)
            console.log(chosenCoins);
        }
    }
}

async function loadCoinsModal(coins: Coin[], index: number, chosenCoins: Coin[], selectedCheckBox: HTMLInputElement) {
    displayLoader();
    // PREPARE data:
    const htmlModal = reduceModal(chosenCoins);

    // DISPLAY data:
    document.querySelector('.modal-body').innerHTML = htmlModal;
    hideLoader();
    coinsModal.show();

    // "DISMISS" button in modal box:
    document.getElementById('dismiss-modal-button').addEventListener('click', () => {
        // coins[index].switch = false; 
        displayLoader(); 
        selectedCheckBox.checked = false;
        hideLoader();
    });

    // "SAVE changes" button in modal box:
    document.getElementById('save-modal-button').addEventListener('click', (e) => {
        e.preventDefault();
        displayLoader();
        saveModalClicked(coins, index, chosenCoins);
        hideLoader();
    });
}

async function saveModalClicked(coins: Coin[], index: number, chosenCoins: Coin[]) {
    let checkBoxModal = (document.querySelector('input[name="chosenCoins"]:checked') as HTMLInputElement).value;
    console.log(checkBoxModal); // switch-modal-coin.id

    let coinIdSelected = checkBoxModal.substring('switch-modal-'.length);
    console.log(coinIdSelected);  // coin.id

    let coinIndexSelected = chosenCoins.findIndex(coin => coin.id === coinIdSelected); // index of coin that selected in MODAL
    console.log(` index in chosenCoin array: ${coinIndexSelected}`);

    // replace the unnecessary coin with the one that selected in modal in chosenCoins array: 
    if(coinIndexSelected !== -1) {
        console.log('unnecessary coin');
        console.log(chosenCoins[coinIndexSelected]);  // unnecessary coin
        chosenCoins[coinIndexSelected] = coins[index];
        console.log('chosen coin');
        console.log(chosenCoins[coinIndexSelected]);  // chosen coin
        console.log(chosenCoins);
    }

    // unchecked the unnecessary coin in "home":
    (document.getElementById(`switch-${coinIdSelected}`) as HTMLInputElement).checked = false;

    coinsModal.hide();
}



// "More info" or "Switch" button clicked:
async function coinsContainerClicked(e: MouseEvent) {
    if(e.target instanceof HTMLElement) {
        const element = e.target as HTMLElement;
        
        // "More info" button clicked:
        if(element.id.startsWith('more-info-')) {
            displayLoader();
            showMoreInfo(element);
        }

        // "Switch" button clicked:
        if(element.id.startsWith('switch-')) {
            switchButtonClicked(element);
        }
    }
}



// Search specific coin:
async function searchCoinClicked(e: MouseEvent) {
    e.preventDefault();
    const userInput = (document.getElementById('user-input-search') as HTMLInputElement).value;
    
    // get data:
    const coins = await getCoins();
    displayLoader();
    
    if(coins.find(coin => coin.symbol === userInput)) {
        const index = coins.findIndex(coin => coin.symbol === userInput);
        const searchedCoin = coins[index];
        // console.log(searchedCoin);
        // console.log(coins[index]);

        // prepare data:
        // const html = reduceSingleCoin(searchedCoin);  // I can use the function reduceCoins()....
        const html = reduceCoins([ searchedCoin ]);
        hideLoader();
        
        // display data:
        document.getElementById('coins-container').innerHTML = html;
        
    } else {
        hideLoader();
        alert(`SORRY! No data available`);
    }

    // Clear search input after search button have been clicked:
    (document.getElementById('user-input-search') as HTMLInputElement).value = '';
    // (document.querySelector('form') as HTMLFormElement).reset(); // not work!
}



(async () => {
    // INIT
    window.addEventListener('load', hideLoader);
    document.getElementById('coins-container').addEventListener('click', coinsContainerClicked);  // "More info" button & switch button
    document.getElementById('search-coin-button').addEventListener('click', searchCoinClicked);   // search button

    // 1. GET data
    const coins = await getCoins();
    displayLoader();
    // console.log(coins);
    
    // 2. PREPARE data
    // 2a. cut list to 100 coins
    const shortList = coins.slice(0, 100);
    // console.log(shortList);
    
    // 2b. reduce to create the html string of the cards
    const html = reduceCoins(shortList);

    // 3. DISPLAY prepared data
    document.getElementById('coins-container').innerHTML = html;
})();
