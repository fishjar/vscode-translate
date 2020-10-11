// import url from "url";
const url = require("url");
const fetch = require("node-fetch");

module.exports.fetchDict = async function (word, dict = "google") {
  const options = {
    protocol: "https",
    hostname: "caihua.jisunauto.com",
    pathname: `/dict/${dict}/dict`,
  };
  dict === "google" &&
    Object.assign(options, {
      query: {
        client: "gtx",
        sl: "auto",
        tl: "zh-CN",
        dj: "1",
        ie: "UTF-8",
        oe: "UTF-8",
        dt: "t",
        tl: "zh-CN",
        q: word,
      },
    });
  dict === "bing" &&
    Object.assign(options, {
      query: {
        word,
        simple: true,
      },
    });
  const response = await fetch(url.format(options));
  const json = await response.json();
  console.log(`${dict} data`, json);

  return json;
};
