const https = require("https");
const cheerio = require("cheerio");
const { URLSearchParams } = require('url');
const sa = require('superagent');

const params = {
  CategoryTypape: "SiteHome", 
  ParentCategoryId: 0, 
  CategoryId: 808, 
  PageIndex: 1, 
  TotalPostCount: 4000, 
  ItemListActionName: "PostList"
};

function get_title_url_priomise(pageIndex, titleUrlList) {
  return new Promise(function(resolve, reject) {
    params.PageIndex = pageIndex;
    sa.get('https://www.cnblogs.com/').query(params).retry(2)
      // .timeout({response:10000})
      .then((res)=>{
      let $ = cheerio.load(res.text);
      let titleLink = $(".titlelnk");
      for (let index = 0; index < titleLink.length; index++) {
        let url = titleLink.eq(index).attr('href');
        // let txt = titleLink.eq(index).text();
        // console.log(pageIndex + ": " + url + " => " + txt);
        titleUrlList.push(url);
      }
      console.log(titleUrlList.length);
      resolve(pageIndex);
    }).catch((reason)=>{
      console.error(`err, ${pageIndex}, ${reason}`);
      reject(pageIndex);
    });
  })
}
console.time('time');
console.log('t1');

let title_urls = new Array();
let title_url_promises = new Array();
for (let index = 1; index <= 200; index++) {
  title_url_promises.push(get_title_url_priomise(index, title_urls));
}

console.log('t2');
Promise.all(title_url_promises).then(function(pageIndexs) {
  console.log(`size:${pageIndexs.length}, url_size:${title_urls.length}`);
  //title_urls.forEach((url)=>console.log(url));
  console.timeEnd('time');
}, function(pageIndex) {
  console.error(`failed, pageIndex = ${pageIndex}`);
});
console.log('t3');
