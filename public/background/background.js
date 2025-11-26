chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, price, url, title } = message;

  const saveToList = (key) => {
  chrome.storage.local.get([key], (res) => {
    const list = res[key] || [];

    // Find the index of the existing item
    const index = list.findIndex(item => item.url === url);
    console.log("llllllllllllllllll")
    if (index === -1) {
      list.push({
        price,
        url,
        title: title || "",
        triggered: "",
        addedAt: Date.now(),
      });

      chrome.storage.local.set({ [key]: list }, () => {
        console.log("UPDATED STORAGE:", key, list);
        chrome.alarms.create(url, { delayInMinutes: 1 });
      });
    } 
    else {
  if (list[index].price && typeof list[index].price === "object") {
    const existingSymbol = list[index].price.symbol;
    list[index].price = {
      price: price,
      symbol: existingSymbol
    };
  }
  chrome.storage.local.set({ [key]: list }, () => {
    console.log("Updated price for existing entry:", list[index]);
  });
}

  });

  sendResponse({ success: true });
};



  if (action === "ADD_PRODUCT_FROM_AMAZON") saveToList("amazon_watchList");
  if (action === "ADD_PRODUCT_FROM_DARAZ") saveToList("daraz_watchList");
  if (action === "ADD_EBAY_OPTION") saveToList("ebay_watchList");
  if (action === "ADD_DHGATE_OPTION") saveToList("dhgate_watchList");

  return true;

});
 
async function handleProductAlarm(productUrl) {
  const storeKeys = ["amazon_watchList", "daraz_watchList", "ebay_watchList", "dhgate_watchList"];

  chrome.storage.local.get(storeKeys, async (res) => {
    for (const key of storeKeys) {
      const list = res[key] || [];
      for (let item of list) {
        if (item.url === productUrl) {
          try {
            getAmazonPrice(productUrl, key, item.price.price)
          } catch (error) {
            console.error("Error fetching product:", error);
          }
          return;
        }
      }
    }
    console.log("Product not found in any store:", productUrl);
  });
}

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  handleProductAlarm(alarm.name); 
});

async function getPrice(url) {
  const res = await fetch(url);
  const htmlText = await res.text();

  const tabs = await new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, resolve);
  });
  if (!tabs || tabs.length === 0) return;

  const activeTab = tabs[0];

  const contentResponse = await new Promise((resolve) => {
    chrome.tabs.sendMessage(activeTab.id, {
      action: "ADD_PRODUCT_PRICE",
      htmlText: htmlText,
      url:url,
      price:'3572',
      key:'daraz'
    }, resolve);
  });
  return contentResponse;
}

// Usage
const url = 'https://www.daraz.pk/products/-i781863272-s3635736749.html?pvid=8d36b223-3825-47db-a026-ad73e37a246e&search=jfy&scm=1007.51705.446532.0&spm=a2a0e.tm80335142.just4u.d_781863272'
setInterval(async () => {
  const response = await getPrice(url);
  console.log("Got data:", response);
}, 5000);
