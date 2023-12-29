var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getCoinData, getCoins } from "../API/rest.js";
import { reduceModal, reduceSingleCoin } from "../reducers/coins.js";
const coinsModal = new bootstrap.Modal('#modal-chosen-coins');
// Some button clicked:
export function coinsContainerClicked(e) {
    return __awaiter(this, void 0, void 0, function* () {
        // INIT chosenCoins array (relate to switch buttons):
        let chosenCoins = [];
        if (e.target instanceof HTMLElement) {
            const element = e.target;
            // "More info" button clicked:
            if (element.id.startsWith('more-info-')) {
                const coinId = element.id.substring('more-info-'.length);
                // substring() will cut off the string 'more-info-' --> the ID will remain
                // 'more-info-'.length --> the .length for cut off those  string's chars length
                console.log(`coin id is ${coinId}`);
                const coinData = yield getCoinData(coinId);
                console.log(coinData);
                document.getElementById(`data-container-${coinId}`).innerHTML = `
                <img src="${coinData.image.thumb}"/><br>
                USD [&#36;]: ${coinData.market_data.current_price.usd}<br>
                EUR [&#8364;]: ${coinData.market_data.current_price.eur}<br>
                ILS [&#8362;]: ${coinData.market_data.current_price.ils}
            `;
            }
            // "Switch" button clicked:
            if (element.id.startsWith('switch-')) {
                const coinId = element.id.substring('switch-'.length);
                // console.log(`coinId: ${coinId}`);
                // console.log(`element: ${element}`);
                const coins = yield getCoins();
                const index = coins.findIndex(coin => coin.id === coinId);
                // console.log(index);
                // console.log(coins[index]);
                // console.log(chosenCoins);
                // define checkBox as HTMLInputElement so I can get value: checked/ not checked
                const checkBox = document.getElementById(`switch-${coinId}`);
                if (checkBox.checked === true) {
                    // if(checkBox.checked) {  // shorter way 
                    console.log('v on checkBox');
                    coins[index].switch = true;
                    // console.log(coins[index].switch);
                    if (chosenCoins.length < 5) {
                        chosenCoins.push(coins[index]);
                        console.log(chosenCoins);
                    }
                    else {
                        // PREPARE data:
                        const htmlModal = reduceModal(chosenCoins);
                        // DISPLAY data:
                        document.querySelector('.modal-body').innerHTML = htmlModal;
                        coinsModal.show();
                        // "SAVE changes" button in modal box:
                        document.getElementById('save-modal-button').addEventListener('click', (e) => {
                            e.preventDefault();
                            let checkBoxModal = document.querySelector('input[name="chosenCoins"]:checked').value;
                            console.log(checkBoxModal); // switch-modal-coin.id
                            let coinIdSelected = checkBoxModal.substring('switch-modal-'.length);
                            console.log(coinIdSelected); // coin.id
                            let coinSelectedIndex = coins.findIndex(coin => coin.id === coinIdSelected); // index of coin that selected in MODAL
                            console.log(coinSelectedIndex);
                            console.log(coins[coinSelectedIndex]);
                            // remove the coin that selected in modal:
                            coins[coinSelectedIndex].switch = false;
                            console.log(coins[coinSelectedIndex]);
                            // let checkBoxSelectedCoin = document.getElementById(`switch-${coinIdSelected}`) as HTMLInputElement; 
                            // checkBoxSelectedCoin.checked = false;
                            //shorter way:
                            document.getElementById(`switch-${coinIdSelected}`).checked = false;
                            // let chosenCoinsIndex = chosenCoins.findIndex(coin => coin.id === coinIdSelected);
                            // if(chosenCoinsIndex > -1) {  // only splice when item is found
                            // chosenCoins.splice(chosenCoinsIndex, 1); // splice(index, how many items to remove)
                            // console.log(chosenCoins);
                            // }
                            // another way:
                            chosenCoins = chosenCoins.filter(coin => coin.id !== coinIdSelected); // remove the coin from chosenCoins array
                            console.log(chosenCoins);
                            // mark the 6th coin that selected, push to chosenCoins array & remove the one that selected in modal:
                            coins[index].switch = true;
                            // checkBox.checked = true;  // not accurate
                            chosenCoins.push(coins[index]); // push 6th coin to chosenCoins array
                            console.log(chosenCoins);
                            coinsModal.hide();
                        });
                        // "DISMISS" button in modal box:
                        document.getElementById('dismiss-modal-button').addEventListener('click', () => {
                            coins[index].switch = false;
                            checkBox.checked = false;
                        });
                    }
                }
                else {
                    console.log('x on checkBox');
                    coins[index].switch = false;
                    let chosenCoinsIndex = chosenCoins.findIndex(coin => coin.id === coinId);
                    if (chosenCoinsIndex > -1) { // only splice when item is found
                        chosenCoins.splice(chosenCoinsIndex, 1); // splice(index, how many items to remove)
                        console.log(chosenCoins);
                    }
                }
            }
        }
    });
}
// Search specific coin:
export function searchCoinClicked(e) {
    return __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const userInput = document.getElementById('user-input-search').value;
        // get data:
        const coins = yield getCoins();
        if (coins.find(coin => coin.symbol === userInput)) {
            const index = coins.findIndex(coin => coin.symbol === userInput);
            const searchedCoin = coins[index];
            // console.log(searchedCoin);
            // console.log(coins[index]);
            // prepare data:
            const html = reduceSingleCoin(searchedCoin);
            // display data:
            document.getElementById('coins-container').innerHTML = html;
        }
        else {
            alert(`SORRY! No data available`);
        }
        // Clear search input after search button have been clicked:
        document.getElementById('user-input-search').value = '';
    });
}
