"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["index.html","2b23ffd3d695cd946ac59009070fa6d1"],["static/css/main.fac69ae8.css","c5ed1d0ca6b5c7a075cfbf44d00b25d1"],["static/js/main.4c1dc179.js","b5fa351655c102f314f36c54cadce044"],["static/media/sticker0.0d36a467.png","0d36a467760bd4191b0238a30f9fa658"],["static/media/sticker1.655cbe79.png","655cbe794fcfcc6aa089b78db7336b7c"],["static/media/sticker10.2ee1e34e.png","2ee1e34e267ddf77f59c0024fb3ab475"],["static/media/sticker11.4da24325.png","4da24325d7f2c737dfeb4f3633817dfe"],["static/media/sticker12.aceeb1cb.png","aceeb1cb98986ba225737b08cb79d948"],["static/media/sticker13.796e00cb.png","796e00cb94da46e1c66bb41697273b1e"],["static/media/sticker14.c40c3b9b.png","c40c3b9b3b63a526151a49c45b517f9f"],["static/media/sticker15.71bc6b52.png","71bc6b52fc54ed3dceeb27fd6ee00daa"],["static/media/sticker16.99d1fe34.png","99d1fe3499f49d109905e7888cec4fa8"],["static/media/sticker17.5c8c3c3c.png","5c8c3c3cd679e4e6d5b7422893c85515"],["static/media/sticker18.f47f9318.png","f47f9318e0aa28f91222565ef459913f"],["static/media/sticker19.f68d35cf.png","f68d35cf5e84e82b1e0673b903a3ff59"],["static/media/sticker2.2ed3dce5.png","2ed3dce5a14801f38f5426f5cde30c30"],["static/media/sticker20.8a2feb4b.png","8a2feb4b10c03f4a9366b5fab4171061"],["static/media/sticker21.f94669af.png","f94669afb63c6487f5319944d45d9f32"],["static/media/sticker22.4397176e.png","4397176e8f2e0802a51426025e4e6e96"],["static/media/sticker23.dbbaff18.png","dbbaff18c04f98cd979b786ad414dbe4"],["static/media/sticker24.25dba288.png","25dba2886cdfbdab97b6f61b00ed8312"],["static/media/sticker25.f33291cb.png","f33291cbaebb055f588bb173539fde37"],["static/media/sticker26.116b03b9.png","116b03b9c9c7eca2b198a486bc387029"],["static/media/sticker27.a0ea0aca.png","a0ea0aca1366512c3cb2934195dc4d61"],["static/media/sticker28.6b64fb6d.png","6b64fb6d5cc51600b20d8b377255c7a7"],["static/media/sticker29.075118e5.png","075118e5c721db6861620aab16f0a190"],["static/media/sticker3.8107d998.png","8107d998a682557510d22b81ca63ad06"],["static/media/sticker30.8650f96e.png","8650f96ef801fdafeaeb05e83d90fd76"],["static/media/sticker31.bb23a302.png","bb23a30234d63bfc60ca17d144349b2c"],["static/media/sticker32.787caaa0.png","787caaa084337df5cb37f67066a0ae9e"],["static/media/sticker33.f5b3a0ce.png","f5b3a0ce689d59477b55cdbd9ba70d27"],["static/media/sticker34.3c4a5dc1.png","3c4a5dc12ce5d3091d585f8a5476d610"],["static/media/sticker35.1fb122d5.png","1fb122d5a0916ac386c5246910544f58"],["static/media/sticker36.caae3bd7.png","caae3bd71d601dfbc678f95c812efa62"],["static/media/sticker37.7576efde.png","7576efde14026795d80f6b88d7c1226d"],["static/media/sticker38.3a8d38ec.png","3a8d38ece0303b02085e361b53b09dab"],["static/media/sticker39.3f567bc5.png","3f567bc5f81c506f1631a93a98bbbefe"],["static/media/sticker4.cd3fb721.png","cd3fb721645cc986e05505f321d57c47"],["static/media/sticker40.04b725b8.png","04b725b8c341383de2594d7be0b64f76"],["static/media/sticker41.3303f64d.png","3303f64d21ec3f4372e88d6a6d2645ca"],["static/media/sticker42.52298a39.png","52298a3965a93ec94ab3db1720e59d83"],["static/media/sticker5.887b2123.png","887b212302370e07b625fa62b2b6e78c"],["static/media/sticker6.0e1c640f.png","0e1c640f5466c5a76a80cea224e5bff5"],["static/media/sticker7.7e7bb062.png","7e7bb062475c97770385750e0db832f4"],["static/media/sticker8.e62d986a.png","e62d986a2b1b25f87d41e40b2559e9db"],["static/media/sticker9.09594272.png","095942727e7be81ba738e81afdf3adae"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(a){return new Response(a,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,a,t,c){var i=new URL(e);return c&&i.pathname.match(c)||(i.search+=(i.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),i.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return a.every(function(a){return!a.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],c=new URL(a,self.location),i=createCacheKey(c,hashParamName,t,/\.\w{8}\./);return[c.toString(),i]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var c=new Request(t,{credentials:"same-origin"});return fetch(c).then(function(a){if(!a.ok)throw new Error("Request for "+t+" returned a response with status "+a.status);return cleanResponse(a).then(function(a){return e.put(t,a)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!a.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var a,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);a=urlsToCacheKeys.has(t);a||(t=addDirectoryIndex(t,"index.html"),a=urlsToCacheKeys.has(t));!a&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(t=new URL("/chitchat-react-app/index.html",self.location).toString(),a=urlsToCacheKeys.has(t)),a&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(a){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,a),fetch(e.request)}))}});