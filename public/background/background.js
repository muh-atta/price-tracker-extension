chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ADD_PRODUCT_FROM_AMAZON") {
    console.log("Received product from content script", message);

    const { action, price, url } = message;
    console.log("asin, title, url", action, price, url)
    chrome.storage.local.get(["amazon_watchList"], (res) => {
      const list = res.watchList || [];

      const exists = list.some((item) => item.url === url);
      if (!exists) {
        list.push({
          price,
          url,
          addedAt: Date.now(),
        });
      }
    });
    sendResponse({ success: true });
  }
   if (message.action === "ADD_PRODUCT_FROM_DARAZ") {
    console.log("Received product from content script", message);
    const { action, price, url } = message;
    console.log("asin, title, url", action, price, url)
    chrome.storage.local.get(["daraz_watchList"], (res) => {
      const list = res.watchList || [];

      const exists = list.some((item) => item.url === url);
      if (!exists) {
        list.push({
          price,
          url,
          addedAt: Date.now(),
        });
      }
    });
    sendResponse({ success: true });
  }
  if (message.action === "ADD_EBAY_OPTION") {
    console.log("Received product from content script", message);
    const { action, price, url } = message;
    console.log("asin, title, url", action, price, url)
    chrome.storage.local.get(["daraz_watchList"], (res) => {
      const list = res.watchList || [];

      const exists = list.some((item) => item.url === url);
      if (!exists) {
        list.push({
          price,
          url,
          addedAt: Date.now(),
        });
      }
    });
    sendResponse({ success: true });
  }
  if (message.action === "ADD_DHGATE_OPTION") {
    console.log("Received product from content script", message);
    const { action, price, url } = message;
    console.log("asin, title, url", action, price, url)
    chrome.storage.local.get(["daraz_watchList"], (res) => {
      const list = res.watchList || [];

      const exists = list.some((item) => item.url === url);
      if (!exists) {
        list.push({
          price,
          url,
          addedAt: Date.now(),
        });
      }
    });
    sendResponse({ success: true });
  }
});