// company_news.json created from 

let reviews = [];
let reviews_by_date_total = {};
let reviews_by_date_avg = {};

let yearMax = 0;
let yearMin = 0;

let company_news = {};
const substring_length = 500;

let categories = ["Overall", "Balance", "Culture", "Compensation", "Opportunities"]
let companies = ["amazon", "microsoft", "apple", "facebook", "netflix", "google"]

const newsRequestData = async () => {
  company_news = await d3.json("company_news.json");
  console.log(company_news);
}

const employeeRequestData = async () => {
  const employee_reviews = await d3.csv("employee_reviews.csv");
  let formatTime = d3.timeFormat("%Y-%m-%d");
  let formatYear = d3.timeFormat("%Y");

  employee_reviews.forEach(function (review) {
    // -1 means not positive review
    let company = review["company"];
    let overall_rating = Number(review["overall-ratings"]);
    let balance_rating = Number(review["work-balance-stars"]);
    let culture_rating = Number(review["culture-values-stars"]);
    let comp_rating = Number(review["comp-benefit-stars"]);
    let opp_rating = Number(review["carrer-opportunities-stars"]);
    let man_rating = Number(review["senior-mangemnet-stars"]);
    let date = new Date(review["dates"]);

    if (isNaN(date.getTime()))
      return;

    let year = Number(formatYear(date));
    date = formatTime(date);

    if (year > yearMax || yearMax == 0) {
      yearMax = year;
    }

    if (year < yearMax || yearMin == 0) {
      yearMin = year;
    }

    if (reviews_by_date_total[company] == undefined) {
      reviews_by_date_total[company] = {};
      reviews_by_date_avg[company] = {};
    }

    if (reviews_by_date_total[company][date] == undefined) {
      reviews_by_date_total[company][date] = {
        "Overall Total": 0,
        "Balance Total": 0,
        "Culture Total": 0,
        "Compensation Total": 0,
        "Opportunities Total": 0,
        "Management Total": 0,

        "Overall Count": 0,
        "Balance Count": 0,
        "Culture Count": 0,
        "Compensation Count": 0,
        "Opportunities Count": 0,
        "Management Count": 0,
      };

      reviews_by_date_avg[company][date] = {
        "Overall Average": 0,
        "Balance Average": 0,
        "Culture Average": 0,
        "Compensation Average": 0,
        "Opportunities Average": 0,
        "Management Average": 0,
      };
    }

    reviews_by_date_total[company][date]["Overall Count"] += !isNaN(overall_rating) ? 1 : 0;
    reviews_by_date_total[company][date]["Overall Total"] += !isNaN(overall_rating) ? overall_rating : 0;

    reviews_by_date_total[company][date]["Balance Count"] += !isNaN(balance_rating) ? 1 : 0;
    reviews_by_date_total[company][date]["Balance Total"] += !isNaN(balance_rating) ? balance_rating : 0;

    reviews_by_date_total[company][date]["Culture Count"] += !isNaN(culture_rating) ? 1 : 0;
    reviews_by_date_total[company][date]["Culture Total"] += !isNaN(culture_rating) ? culture_rating : 0;

    reviews_by_date_total[company][date]["Compensation Count"] += !isNaN(comp_rating) ? 1 : 0;
    reviews_by_date_total[company][date]["Compensation Total"] += !isNaN(comp_rating) ? comp_rating : 0;

    reviews_by_date_total[company][date]["Opportunities Count"] += !isNaN(opp_rating) ? 1 : 0;
    reviews_by_date_total[company][date]["Opportunities Total"] += !isNaN(opp_rating) ? opp_rating : 0;

    reviews_by_date_total[company][date]["Management Count"] += !isNaN(man_rating) ? 1 : 0;
    reviews_by_date_total[company][date]["Management Total"] += !isNaN(man_rating) ? man_rating : 0;;

    let overall_avg = reviews_by_date_total[company][date]["Overall Total"] / reviews_by_date_total[company][date]["Overall Count"];
    reviews_by_date_avg[company][date]["Overall Average"] = !isNaN(overall_avg) ? overall_avg : 0;

    let balance_avg = reviews_by_date_total[company][date]["Balance Total"] / reviews_by_date_total[company][date]["Balance Count"];
    reviews_by_date_avg[company][date]["Balance Average"] = !isNaN(balance_avg) ? balance_avg : 0;

    let culture_avg = reviews_by_date_total[company][date]["Culture Total"] / reviews_by_date_total[company][date]["Culture Count"];
    reviews_by_date_avg[company][date]["Culture Average"] = !isNaN(culture_avg) ? culture_avg : 0;

    let comp_avg = reviews_by_date_total[company][date]["Compensation Total"] / reviews_by_date_total[company][date]["Compensation Count"];
    reviews_by_date_avg[company][date]["Compensation Average"] = !isNaN(comp_avg) ? comp_avg : 0;

    let opp_avg = reviews_by_date_total[company][date]["Opportunities Total"] / reviews_by_date_total[company][date]["Opportunities Count"];
    reviews_by_date_avg[company][date]["Opportunities Average"] = !isNaN(opp_avg) ? opp_avg : 0;

    let man_avg = reviews_by_date_total[company][date]["Management Total"] / reviews_by_date_total[company][date]["Management Count"];
    reviews_by_date_avg[company][date]["Management Average"] = !isNaN(man_avg) ? man_avg : 0;

    let data = {
      "Company": company,
      "Rating": overall_rating,
      "Date": date,
      "Balance Rating": balance_rating,
      "Culture Rating": culture_rating,
      "Opportunities Rating": opp_rating,
      "Comp Benefit Rating": comp_rating,
      "Senior Management Rating": man_rating,
    }
    reviews.push(data);

  });

  let chart = d3.select("#chart")
    .append("svg")
    .attr("id", companies[0] + " " + categories[0]);

  updateYear(reviews_by_date_avg, 2018);
  makeButtons(reviews_by_date_avg, yearMin, yearMax);

}

newsRequestData();
employeeRequestData();


