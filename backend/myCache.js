import NodeCache from "node-cache";
const myCache = new NodeCache();        //// No TTL, data will never expire
// const myCache = new NodeCache({stdTTL: 300, checkperiod: 120});       //5 minutes-stdTTL or checkperiod-2 min

export default myCache;
