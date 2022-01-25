var express = require('express')
var app = express()
const cors = require('cors')
const axios = require('axios')
const db = require('./lib/db')
const cron = require('node-cron');

// (initFunc = async () => {
//   await db.createMyDB("testDB");
//   await db.createMyTBL("test_tbl");
// })();

fetchDataUsingAPI = async () => {
  try {
    // fetch token Info using API in watcher.guru
    const { data } = await axios.get("https://api.watcher.guru/holders/c7d43f2b51f44f09fbb8a691a0451e8ffcf36c0a")
    const totalData = data.data

    // totalSupplyData = await axios.get('https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0xc7d43f2b51f44f09fbb8a691a0451e8ffcf36c0a&apikey=YourApiKeyToken')
    // totalSupplyData = parseFloat(totalSupplyData.data.result)
    const totalSupplyData = 1e15;

    const keys = Object.keys(totalData);
    keys.map(async (k) => {
      try {
        const { rank, tag, quantityCurrent, value }  = totalData[k]
        const res = {
          rank,
          address: tag ? tag : k,
          quantityCurrent: parseFloat(quantityCurrent).toLocaleString(),
          percentage:parseFloat(parseFloat(quantityCurrent * 100 / totalSupplyData).toFixed(2)) + "%",
          value: parseFloat(parseFloat(value).toFixed(2))
        }
  
        const testQuery = `SELECT * FROM everrise WHERE address = '${res.address}'`;
        const testResult = await db.exec(testQuery)

        if( ! testResult.rowCount ) {
          const query = `INSERT INTO everrise (rank, address, current_quantity, previous_quantity, value, percent) VALUES ($1, $2, $3, $4, $5, $6)`;
          const data = [res.rank, res.address, res.quantityCurrent, 0, res.value, res.percentage];
          await db.exec(query, data)
        } else{
          const query = `UPDATE everrise SET \
                            rank = ${res.rank},\
                            current_quantity = '${res.quantityCurrent}', \
                            previous_quantity = '${testResult.rows[0].current_quantity}', \
                            value = ${res.value} \
                          WHERE address = '${res.address}'`
          const data = [res.rank, res.quantityCurrent, testResult.rows[0].current_quantity, res.value, res.address]
          await db.exec(query)
        }
      } catch (error) {
        console.log(error);
      }
    })
  } catch (error) {
    console.log(error)
  }
}

fetchDataUsingAPI();
let task = cron.schedule('* * */12 * * *', () => {
    fetchDataUsingAPI();
});

app.use(cors({
  origin: '*'
}))

app.get('/', function(req, res){
   res.send("Hello Jackie!")
})

app.get('/tokenData', async function(req, res){
  const testQuery = `SELECT * FROM everrise`
  const result = await db.exec(testQuery)
  res.send(result)
})

app.listen(3000)