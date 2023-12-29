import CoinData from "../interfaces/coin-data.js";
import Coin from "../interfaces/coin.js";

// REDUCE ALL coins into card's div's:
export function reduceCoins(coins: Coin[]): string {
  return coins
        .map(coin => `
            <div class="col-sm-6 col-md-3">
                <div class="card" >
                    <div class="card-body">

                        <div class="form-check form-switch">
                            <label class="form-check-label" for="flexSwitchCheckDefault"><h5 class="card-title">${coin.name}</h5></label>
                            <input class="form-check-input" type="checkbox" role="switch" id="switch-${coin.id}">
                        </div>
                        
                        <p class="card-text">${coin.symbol}</p>
                        <a href="#" id="more-info-${coin.id}" class="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#collapse-${coin.id}">More Info</a>
                        <div class="collapse" id="collapse-${coin.id}">
                            <div class="card card-body" id="data-container-${coin.id}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).reduce((acc, curr) => acc + curr, '');
}


// REDUCE single searched coin into a card & return anchor  ----> DO YOU NEED THAT? I CAN USE THE FUNCTION reduceCoins():
// export function reduceSingleCoin(coin: Coin): string {
//     return `
//     <div class="col-sm-6 col-md-3">
//             <div class="card">
//                 <div class="card-body">

//                     <div class="form-check form-switch">
//                         <label class="form-check-label" for="flexSwitchCheckDefault"><h5 class="card-title">${coin.name}</h5></label>
//                         <input class="form-check-input" type="checkbox" role="switch" id="switch-${coin.id}">
//                     </div>

//                     <p class="card-text">${coin.symbol}</p>
//                     <a href="#" id="more-info-${coin.id}" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#collapse-${coin.id}">More Info</a>
//                     <div class="collapse" id="collapse-${coin.id}">
//                         <div class="card card-body" id="data-container-${coin.id}">
                            
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <a href="index.html">return</a>
//     `
// }


// REDUCE chosen coins into modal box with switch button:
export function reduceModal(chosenCoins: Coin[]): string {
    return chosenCoins
        .map(coin => `
            <div id="chosen-coin-${coin.id}">
                <div class="form-check form-switch">
                    <input name="chosenCoins" type="radio" class="form-check-input" role="switch" id="switch-modal-${coin.id}" value="switch-modal-${coin.id}">
                    <label for="switch-modal-${coin.id}">${coin.symbol}</label>
                </div>
            </div>
        `).reduce((acc, curr) => acc + curr, '');
}

// NOTE TO SELF (vow to limit checkbox):
// to limit the choices I replace the type "checkbox" to "radio"
// and add a name. when all the radio get the same name ---> it will limit to 1 choice

// REDUCE "more info" of specific coin:
export function reduceMoreInfo(coinData: CoinData): string {
     return `
        <img src="${coinData.image.thumb}"/>
        <div><span>USD [&#36;]: </span>${coinData.market_data.current_price.usd}</div>
        <div><span>EUR [&#8364;]: </span>${coinData.market_data.current_price.eur}</div>
        <div><span>ILS [&#8362;]: </span>${coinData.market_data.current_price.ils}</div>
    `
}