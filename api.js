// import url from "url";
const url = require("url");
const fetch = require("node-fetch");

module.exports.fetchDict = async function (word) {
  const googleUrl = url.format({
    protocol: "https",
    hostname: "caihua.jisunauto.com",
    pathname: `/dict/google/dict`,
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

  const googleRes = await fetch(googleUrl);
  const googleJson = await googleRes.json();

  const hasBlank = /\n|\r/.test(word);
  if (googleJson.src !== "en" || hasBlank) {
    return {
      google: googleJson,
    };
  }

  const bingUrl = url.format({
    protocol: "https",
    hostname: "caihua.jisunauto.com",
    pathname: `/dict/bing/dict`,
    query: {
      word,
      simple: true,
    },
  });

  const bingRes = await fetch(bingUrl);
  const bingJson = await bingRes.json();

  return {
    google: googleJson,
    bing: bingJson,
  };
};
