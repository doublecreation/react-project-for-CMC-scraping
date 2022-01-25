import React, { useState, useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import DataTable, { createTheme } from "react-data-table-component";
import Card from "@material-ui/core/Card";
import SortIcon from "@material-ui/icons/ArrowDownward";
import axios from "axios";
import FormData from 'form-data';

import { columns, darkTheme, customStyles } from "./tableSettings";
import "./styles.css";

createTheme('solarized', {
  text: {
    primary: 'white',
    secondary: 'white',
  },
  background: {
    default: '#223',
  },
  divider: {
    default: '#79f',
  },
});

function Table() {
  let [totalSupplyData, setTotalSupplyData] = useState({});
  const [loading, setLoading] = useState("Loading");
  let trackingResult = [];

  const tracking = async (page) => {

    try {
      let url = "https://api.nomics.com/v1/currencies/ticker",
        qString = "?key=" + "4d6309bd25541bc203a94472a080638a3d3d1b24" + "&interval=1d&convert=USD&per-page=100&page=" + page;

      await axios.get(url + qString, { mode: "no-cors" })
        .then(data => {
          data.data.map((n) => {
            if (n["1d"] && n["1d"].volume_change_pct != undefined && Math.abs(n["1d"].volume_change_pct) < 14) {
              let obj = n;

              obj.rank = parseFloat(obj.rank)
              obj.price = parseFloat(obj.price)
              obj["1d"].volume_change_pct = parseFloat(obj["1d"].volume_change_pct);
              obj["1d"].volumn = parseFloat(obj["1d"].volumn)

              trackingResult.push(obj);
            }
          })
        }).catch(err => {
          console.log(err)
        });
    } catch (error) {
      console.log(error)
    }
  };

  let intervalGet;

  const getData = async () => {
    let page = 1
    trackingResult = [];
    intervalGet = setInterval(() => {
      tracking(page);
      page++;
      if (page == 100) {
        clearGetData();
      }
    }, 1500);
  }

  const clearGetData = () => {
    clearInterval(intervalGet);
    setLoading("")
    setTotalSupplyData(trackingResult);
  }


  useEffect(() => {
    setLoading("Loading...");
    const updata = setInterval(() => {
      getData();
    }, 600000);
    getData();
  }, [])

  const num = [10, 25, 50, 100]

  return (
    <div className="App">
      <Card>
        <h2 id="loading">{loading}</h2>
        <DataTable
          title="CoinMarketCap"
          columns={columns}
          data={totalSupplyData}
          defaultSortFieldId={1}
          sortIcon={<SortIcon />}
          pagination
          theme="solarized"
          customStyles={customStyles}
          paginationRowsPerPageOptions={num}
        />
      </Card>
    </div >
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Table />, rootElement);




