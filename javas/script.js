const api_key = 'YQR2YVV7S0WG9WW4';
const api_pre_sym = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='
const api_pre_search ='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='
const api_pre_graph ='https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol='
const api_post = '&apikey=YQR2YVV7S0WG9WW4'
var stock_search;
let api_search;
let api_url;
let symbol;
let api_graph;



function makeGraph() {
    var ctx = document.getElementById('graph').getContext('2d');
    ctx.canvas.width = 25;
    ctx.canvas.heigth = 10;
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Price of Stock',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(128, 80, 90, .8)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: ['white'],
                pointBackgroundColor:["white"],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 15
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: "#FFFFFF"
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: "#FFFFFF"
                    }
                }]
            }
        }
    });
}

async function get_sym() {
    const response = await fetch(api_search);
    const stock_data = await response.json();
    symbol = stock_data.bestMatches[0]["1. symbol"]
    api_url = api_pre_search + symbol + api_post;
    stock_graph();
    //stock_Data(api_url);
    //console.log(symbol);
    
}

function getSearch() {
    stock_search = document.getElementById("stockSearch").value;
    api_search = api_pre_sym + stock_search +api_post;
    get_sym();
}



//5 requests per minute and 500 requests a day
async function stock_Data(api_url) {
    const response = await fetch(api_url);
    const stock_data = await response.json();
    const stock_open = stock_data["Global Quote"]["02. open"]
    const stock_price = stock_data["Global Quote"]["05. price"]
    const stock_vol = stock_data["Global Quote"]["06. volume"]
    document.getElementById('name').textContent = symbol;
    document.getElementById('open').textContent = stock_open;
    document.getElementById('price_stock').textContent = stock_price; 
    document.getElementById('volume').textContent = stock_vol;                    
}
 let key_pre;
async function stock_graph() {
    api_graph = api_pre_graph + symbol + api_post;
    const response = await fetch(api_graph);
    const stock_data = await response.json();
    const data = stock_data;
    var array = ["test"];
    Object.keys(stock_data["Weekly Time Series"]["2020-03-19"]).forEach(function(key) {
        key_pre ='"' + key +'"';
        array.push(key_pre);
        console.table('Key : ' + key );
      })

      console.log(array[1]);
     
     /* Object.keys(data[Weekly]).forEach(function(key) {
        key_pre ='"' + key +'"';
        console.table('Key : ' + key );
      })

      */
    //const stock_graph = stock_data["Weekly Time Series"]["2020-03-19"];
    

}

//attempt to modify id= "name" <STOCK> when it loads, but couldnt get it to work properly.
// Wanted to decrease time seen by user of swithcing text when API data is recieved.
/*var mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      //console.log(mutation);
    
    });
  });

  mutationObserver.observe(document.documentElement,{
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
    
  });
  */
  //however, this did console log when stock_Data() changed id=name, when mutationObserver.observer(document.getElementbyID) was set.


//functions calls to get API data and change HTML
//5 requests per minute and 500 requests a day


makeGraph();



