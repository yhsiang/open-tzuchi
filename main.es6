import request from "request";
import cheerio from "cheerio";
import async from "async";
import { flatten } from "prelude-ls";


const COUNTS = process.env.COUNTS || 20000;

var query = ["query"];
for(var i= 1; i<= COUNTS; i++) {
  query.push("pageDown");
}

function fetch(query, next) {
  var result = [];
  var url = "https://tcit2.tzuchi.net/DonationCreditInfoWeb/MainServlet";
  request.post(url, {
    headers: {
      "Cookie": "JSESSIONID=0000WOeg4zMlwWdad9FhdWImCPZ:-1"
    },
    form: {
      "year_month_select": "2015/01",
      "date_select": "21",
      "myaction": query
    }}, (err, res, body) => {
    if(err) next(err, null);
    let $ = cheerio.load(body);
    $('.table-record tr td').each( (i, e) => {
      var k = $(e).children().map((i,e) => $(e).text()).toArray();
      result.push(k);
    });
    next(null, result);
  });
}

console.log("序號, 人名, 理由, 捐獻數目");
async.map(query, fetch, (err, results) => {
  results.forEach( (result) => {
    result.forEach( ( [no, name, reason, donation]:row) => {
      console.log(`${no}, ${name}, ${reason}, ${donation}`);
    });
  });
});

