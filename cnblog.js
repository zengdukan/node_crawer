const https = require("https");
const cheerio = require("cheerio");
const { URLSearchParams } = require('url');
const sa = require('superagent');

const params = {
  CategoryType: "SiteHome", 
  ParentCategoryId: 0, 
  CategoryId: 808, 
  PageIndex: 1, 
  TotalPostCount: 4000, 
  ItemListActionName: "PostList"
};

console.time('time');

function get_title_url(pageIndex, titleUrlList) {
  params.PageIndex = pageIndex;
  sa.get('https://www.cnblogs.com/').query(params).end(function(err, res) {
      let $ = cheerio.load(res.text);
      let titleLink = $(".titlelnk");
      for (let index = 0; index < titleLink.length; index++) {
        let url = titleLink.eq(index).attr('href');
        let txt = titleLink.eq(index).text();
        console.log(`${pageIndex}: ` + url + " => " + txt);
        titleUrlList.push(url);
      }
      // console.log(titleUrlList.length);
      // if (titleUrlList.length >= 100)
      //   console.timeEnd('time')
    });


  
}
console.log('t1');

let title_urls = new Array();
for (let index = 1; index <= 200; index++) {
  get_title_url(index, title_urls);
}

console.log('t2');
console.log(`url_size:${title_urls.length}`);
console.log('t3');
// console.timeEnd('time');
