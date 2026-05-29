const https = require("https");
const query =
  '*[_type == "category"] | order(titre asc) { _id, titre, description, "slug": slug.current, image, range, "productCount": count(*[_type == "product" && references(^._id)]) }';
const encoded = encodeURIComponent(query);
const url = `https://c6gi98th.apicdn.sanity.io/v2026-04-24/data/query/production?query=${encoded}&returnQuery=false`;
console.log("URL:", url);
https
  .get(url, (res) => {
    console.log("status", res.statusCode, res.statusMessage);
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("body snippet:", data.slice(0, 2000));
    });
  })
  .on("error", (err) => {
    console.error("err", err.message);
  });
