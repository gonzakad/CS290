const api_key = 'YQR2YVV7S0WG9WW4';
const api_pre_sym = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='
const api_pre_search ='https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='
const api_pre_graph ='https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol='
const api_post = '&apikey=YQR2YVV7S0WG9WW4'
var stock_search;
let api_search;
let api_url;
let symbol;
let api_Weekly;
var date = [];
var money =[];
var myChart;

function clear() {
    date = [];
    money = [];
}

function makeGraph() { 
    const ctx = document.getElementById('graph').getContext('2d');
    ctx.canvas.width = 25;
    ctx.canvas.heigth = 10;
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Price of Stock',
                data: money,
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


function addData(chart, label, values) {
    var i;
    for(i = 0; i < label.length; i++){
    myChart.data.labels.push(label[i]);
    myChart.data.datasets.forEach((dataset) => {
        dataset.data.push(values[i]);
    });

  }

  console.log(myChart.data.labels);
    
}

//arrays to hold money and dates from json

async function get_sym(myChart) {
    const response = await fetch(api_search);
    const stock_data = await response.json();
    symbol = stock_data.bestMatches[0]["1. symbol"]
    api_url = api_pre_search + symbol + api_post;
    console.log(api_search);
    await stock_Weekly();
    console.log(date);
    console.log(money);
    await stock_Data(api_url);
    makeGraph();
    //addData(myChart,date,money);
    //console.log(symbol);
}

function getSearch() {
    clear();
    stock_search = document.getElementById("stockSearch").value;
    api_search = api_pre_sym + stock_search +api_post;
    get_sym();
}



//5 requests per minute and 500 requests a day,
//!!!------------------------------------------!!!
//!!MUST HAVE 12 SECONDS BETWEEN CALLS OR BREAKS!!
//!!!------------------------------------------!!!

async function stock_Data(api_url) {
    console.log("getting data",api_url);
    const response = await fetch(api_url);
    console.log("response",response);
    const stock_data = await response.json();
    console.log("json",stock_data);
    const stock_open = stock_data["Global Quote"]["02. open"]
    const stock_price = stock_data["Global Quote"]["05. price"]
    const stock_vol = stock_data["Global Quote"]["06. volume"]
    document.getElementById('name').textContent = symbol;
    document.getElementById('open').textContent = stock_open;
    document.getElementById('price_stock').textContent = stock_price; 
    document.getElementById('volume').textContent = stock_vol;                    
}


async function stock_Weekly() {
    var i;
    api_Weekly = api_pre_graph + symbol + api_post;
    const response = await fetch(api_Weekly);
    const stock_data = await response.json();
    const dates = Object.keys(stock_data["Weekly Time Series"]);
    for( i = 0; i < 10; i++) {
        date.push(dates[i]);
        money.push(stock_data["Weekly Time Series"][dates[i]]["4. close"]);
    }
}




// attempt at DOM listening, sorta worked, wrong tool needed


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
  //however, this did console log when stock_Data() changed id=name, when mutationObserver.observer(document.getElementbyID) 