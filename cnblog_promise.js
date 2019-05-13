const https = require("https");
const cheerio = require("cheerio");
const { URLSearchParams } = require('url');

const params = new URLSearchParams({
  CategoryType: "SiteHome", 
  ParentCategoryId: 0, 
  CategoryId: 808, 
  PageIndex: 1, 
  TotalPostCount: 4000, 
  ItemListActionName: "PostList"
});

function get_title_url_priomise(pageIndex, titleUrlList) {
  return new Promise(function(resolve, reject) {
    params.set('PageIndex', pageIndex);
    const myURL = new URL('https://www.cnblogs.com/');
    myURL.search = params;
    
    https.get(myURL, (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        reject({statusCode, pageIndex});
        return;
      }
      
      let rawData = '';
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        // console.log(rawData);
        let $ = cheerio.load(rawData);
        let titleLink = $(".titlelnk");
        for (let index = 0; index < titleLink.length; index++) {
          let url = titleLink.eq(index).attr('href');
          // let txt = titleLink.eq(index).text();
          // console.log(url + " => " + txt);
          titleUrlList.push(url);
        }
        console.log(titleUrlList.length);
        resolve(pageIndex);
      });
      
    });
  })
}
console.time('time');
console.log('t1');

let title_urls = new Array();
let title_url_promises = new Array();
for (let index = 1; index <= 5; index++) {
  title_url_promises.push(get_title_url_priomise(index, title_urls));
}

console.log('t2');
Promise.all(title_url_promises).then(function(pageIndexs) {
  console.log(`size:${pageIndexs.length}, url_size:${title_urls.length}`);
  //title_urls.forEach((url)=>console.log(url));
  console.timeEnd('time');
}, function({statusCode, pageIndex}) {
  console.error(`failed, statuscode = ${statusCode}`);
});
console.log('t3');
