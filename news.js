let formatTime = d3.timeFormat("%Y-%m-%d");

let company_news = {
  "Amazon": {},
  "Microsoft": {},
  "Google": {},
  "Apple": {},
  "Netflix": {},
  "Facebook": {}
};

const newsRequestData = async () => {
  const news = await d3.json("company_news.json");
  company_news = news;


}

const newsRequestData2 = async () => {
  const news = await d3.csv("articles1.csv");
  console.log(news);

  news.forEach(function (data) {
    for (var company in company_news) {
      let title = data["title"];
      let content = data["content"];
      if (title.includes(company)) {
        let date = new Date(data["date"]);
        date = formatTime(date);
        if (company_news[company][date] == undefined) {
          company_news[company][date] =
            {
              "headline": title,
              "short description": content,
              "link": data["url"]
            };
        }
      }
    }
  });
  console.log(JSON.stringify(company_news));

}

newsRequestData();
newsRequestData2();
console.log(JSON.stringify(company_news));
