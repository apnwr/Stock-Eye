const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const port = 8010;

app.use(express.json());

let CompCode = "TCS";

app.listen(port, () => {
    console.log(`The application is running successfully on port :  ${port}`);
});




app.post("/search", (req, res) => {
    try {
        // console.log("Request.body :" + JSON.stringify(req.body));
        // CompCode = req.body.code;
        // res.status(200).json({
        //     Code : req.body.code,
        //     message: "Code Sent",
        //     CompCode
        // })
        
    }
    catch (err) {
        console.log(err);
        res.send(500);

    }
})

const siteUrl =
  "https://www.screener.in/company/" + CompCode + "/consolidated/";

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};


// Web Scrapping 
const getResults = async () => {
  const $ = await fetchData();
  const ratios = [];
  $(
    ".flex-column > .container > .card > .company-info > .company-ratios >#top-ratios > .flex > span.name"
  ).each(function () {
    ratios.push($(this).text().replace(/\s+/g, " ").trim());
  });

  const val = [];
  $(
    ".flex-column > .container > .card > .company-info > .company-ratios >#top-ratios > .flex > span.value  "
  ).each(function () {
    val.push($(this).text().replace(/\s+/g, " ").trim());
  });

  const kval = {};

  for (let i = 0; i < val.length; i++) {
    kval[ratios[i]] = val[i];
  }

  console.log(kval);
  return kval;
};

app.get("/", async (req, res) => {
  const result = await getResults();
  res.send(result);
});





