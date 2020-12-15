// import url from "url";
const url = require("url");
const fetch = require("node-fetch");

const rq = async (pathname, query) => {
  const options = {
    protocol: "https",
    hostname: "caihua.jisunauto.com",
    pathname,
    query,
  };
  const addr = url.format(options);
  console.log("---------->", addr);
  const res = await fetch(addr);
  if (!res.ok) {
    throw new Error(`[${res.status}]${res.statusText}`);
  }
  const json = await res.json();
  console.log("<---------", json);
  return json;
};

module.exports.fetchGoogle = (q) => rq("trans/google/auto", { q });
module.exports.fetchBingDict = (q) => rq("trans/bing/dictf", { q });
