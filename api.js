// import url from "url";
const url = require("url");
const fetch = require("node-fetch");

const rq = async (pathname, query) => {
  const options = {
    protocol: "https",
    hostname: "trans.rayjar.com",
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

module.exports.fetchGoogle = (q) => rq("google/auto", { q });

module.exports.fetchDict = (q) => rq("smart/dict", { q });

module.exports.fetchBingDict = (q) => rq("bing/dictf", { q });

module.exports.fetchTrans = (q, tl) =>
  rq("smart/translate", { q, tl, exc: true });
