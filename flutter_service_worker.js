'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.json": "3e8d496ef5f1a6973773d51bc48aca05",
"assets/AssetManifest.smcbin": "a928c86cf76113f805e030146d34e347",
"assets/assets/fonts/Comfortaa-Bold.ttf": "2df2dd0ee326686649aadb345e25c32c",
"assets/assets/fonts/Comfortaa-Light.ttf": "a32b6e45c316fd976351f29fedd25de8",
"assets/assets/fonts/Comfortaa-Medium.ttf": "cca5f204199167bb2048b1550d4bba8e",
"assets/assets/fonts/Comfortaa-Regular.ttf": "26795cfa08319b4e939b9c26dfc59311",
"assets/assets/fonts/Comfortaa-SemiBold.ttf": "170d22d9ab52b04a17ac34a3935815e6",
"assets/assets/Icons/Bag.png": "5c04b86ce328df41bdf88700fbfc67a1",
"assets/assets/Icons/choose.png": "37e233ebb4376e65befa7c005b393aa5",
"assets/assets/Icons/S1.png": "f2f8d5ed83a62477887bda1512588e4b",
"assets/assets/Icons/S2.png": "aef665e3a7cb7cbb76f39df7291cd1f9",
"assets/assets/Icons/S3.png": "40e09fffce4a3265f603a7fa871f2e34",
"assets/assets/Icons/S4.png": "f17a363d41214d2d8aed9a09576e500f",
"assets/assets/Icons/S5.png": "48963c023f3aadc9b9114d4d7cdba71b",
"assets/assets/Icons/S6.png": "d5dd63388dd39dc98f3ef126ae16e4a3",
"assets/assets/Icons/S7.png": "936aefff230f1c1e70b47dab927b5e4b",
"assets/assets/Icons/Tono.png": "6af223cd4cf23860ee6823c89a20f0ef",
"assets/assets/Images/amico.svg": "e4249650adb379bc51c38f88e9105b3b",
"assets/assets/Images/borg.png": "cf126e95b6b518de05662bcfbae568c9",
"assets/assets/Images/cairo.jpeg": "771351c6e5fbcc22561b0c391f196729",
"assets/assets/Images/doctor.svg": "0960401a85afa8f7a071442fa9dab90c",
"assets/assets/Images/khaber.png": "3bb502ae869bc26cf4277c4c6089f0c7",
"assets/assets/Images/logo.svg": "4d801703050835674e3bf441b70e9749",
"assets/assets/Images/moktaber.png": "faa9d98617346db6dfa7c694389a89a8",
"assets/assets/Images/scan.png": "c2db7756a9410899dcb7268aee543f88",
"assets/assets/Images/security.png": "b4999cb4b89ec0fd7ac71622068f5fc2",
"assets/assets/Images/speed.png": "e4774472ba5b53510c6f4dc783c1cb5f",
"assets/assets/Images/yamama.png": "913b0c83c598bca109d6547914437948",
"assets/FontManifest.json": "2c986b65a02c0f8a2fbae26db8f62418",
"assets/fonts/MaterialIcons-Regular.otf": "2c3b9e8821c1cf981edd93b060c54ccc",
"assets/NOTICES": "074939aceb0035be7f53942e0f489bf0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "21f74e08e0cd8c92bdda58312974a204",
"/": "21f74e08e0cd8c92bdda58312974a204",
"logo.svg": "a527abe7cee5e9b493e2d5e710761d88",
"main.dart.js": "29353198bb31680a336319e5ec52c372",
"manifest.json": "b0f3d707ac4bb5f3b3bae142f9df5bec",
"version.json": "158420e5ac495d34bde3f88879306eb7"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
