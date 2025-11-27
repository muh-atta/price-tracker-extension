console.log("Price Monitor :: product page script loaded");

const siteHandlers =  {
  amazon: {
    match: () => window.location.hostname.includes("amazon"),
    getPrice: () => {
      const wholeEl = document.querySelector(".a-price-whole");
      const fractionEl = document.querySelector(".a-price-fraction");
      const symbolEl = document.querySelector(".a-price-symbol");

      if (!wholeEl) return null;

      const whole = wholeEl.textContent.replace(/\D/g, "");
      const fraction = fractionEl
        ? fractionEl.textContent.replace(/\D/g, "") || "00"
        : "00";
      const symbol = symbolEl ? symbolEl.textContent.trim() : "$";

      const price = parseFloat(`${whole}.${fraction}`);

      return { price, symbol };
    },
    injectButton: async (price) => {
      if (document.querySelector(".pm-watch-btn-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "pm-watch-btn-wrapper";
      wrapper.style.cssText = "margin-top:12px; width:100%;";
      
      const watchBtn = document.createElement("button");
      watchBtn.className = "pm-watch-btn a-button a-button-primary a-button-icon";
      watchBtn.type = "button";
      watchBtn.innerHTML = `<span class="a-button-inner"><span class="a-button-text">Watch Price</span></span>`;
      watchBtn.style.cssText = "width:100%; font-size:14px; cursor:pointer; margin-top:-5px;";

      const url = window.location.href;
      const titleEl = document.querySelector('#productTitle')
      const title = titleEl ? titleEl.textContent.trim() : "";
      watchBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({
          action: "ADD_PRODUCT_FROM_AMAZON",
          price,
          url,
          title,
        });

        watchBtn.innerHTML = `<span class="a-button-inner"><span class="a-button-text" style="color:white;">Added!</span></span>`;
        watchBtn.style.backgroundColor = "#0057ffed";
        watchBtn.style.color = "white";
      });
      wrapper.appendChild(watchBtn);

      const buyNowDiv = document.querySelector("#buyNow_feature_div");
      if (buyNowDiv) buyNowDiv.insertAdjacentElement("afterend", wrapper);
      const exist = await checkAndSetButton("amazon_watchList", watchBtn, price, url, title);
      if(exist) { 
        watchBtn.innerHTML = `<span class="a-button-inner"><span class="a-button-text" style="color:white;">Added!</span></span>`;
        watchBtn.style.backgroundColor = "#0057ffed";
        watchBtn.style.border = "none";
        watchBtn.style.color = "white"; 
      }
    },
  },
  daraz: {
    match: () => window.location.hostname.includes("daraz"),
    getPrice: () => {
  const priceEl = document.querySelector(
    "#module_product_price_1 > div > div.pdp-product-price > span"
  );
  if (!priceEl) return null;
  let raw = priceEl.textContent.trim();
  const match = raw.match(/^([^\d]+)?([\d,\.]+)/);
  if (!match) return null;

  const symbol = match[1] ? match[1].trim() : "";
  let amountStr = match[2];
  amountStr = amountStr.replace(/,/g, "");
  const price = parseFloat(amountStr);
  return { price, symbol };
},
  injectButton: async (price) => {
  if (document.querySelector(".pm-watch-btn")) return;

  const url = window.location.href;
  const titleEl = document.querySelector('#module_product_title_1 > div > div > h1')
  const title = titleEl ? titleEl.textContent.trim() : "";
  const watchBtn = document.createElement("button");
  watchBtn.className = "pm-watch-btn pdp-button pdp-button_type_text pdp-button_theme_yellow pdp-button_size_xl";
  watchBtn.type = "button";
  watchBtn.innerHTML = `<span class="pdp-button-text"><span>Watch Price</span></span>`;
  watchBtn.style.cssText = `
    background-color: green;
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 0 12px;
    height: 44px;
    font-size: 14px;
    width: 80%;
    box-sizing: border-box;
    margin-top: 6px;
  `;

  watchBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "ADD_PRODUCT_FROM_DARAZ",
      price,
      url,
      title
    });

    watchBtn.innerHTML = `<span class="pdp-button-text"><span>Added!</span></span>`;
    watchBtn.style.backgroundColor = "#0057ff";
    watchBtn.style.color = "white";
  });

  const container = document.querySelector("#module_add_to_cart .pdp-cart-concern");
  if (container) {
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "stretch";

    const existingButtons = container.querySelectorAll("button");
    existingButtons.forEach(btn => {
      btn.style.width = "80%";
      btn.style.boxSizing = "border-box";
      btn.style.marginTop = "6px";
    });

    container.appendChild(watchBtn);
    const exist = await checkAndSetButton("daraz_watchList", watchBtn, price, url, title);
      if(exist) { 
      watchBtn.innerHTML = `<span class="pdp-button-text"><span>Added!</span></span>`;
      watchBtn.style.backgroundColor = "#0057ff";
      watchBtn.style.color = "white";
      }
  }
}
  },
  ebay: {
  match: () => window.location.hostname.includes("ebay"),
  
  getPrice: () => {
  const priceEl = document.querySelector(
    "#mainContent > div > div.vim.x-price-section.mar-t-20 > div.vim.x-bin-price > div > div.x-price-primary > span"
  );
  if (!priceEl) return null;

  const rawText = priceEl.textContent.trim();

  const match = rawText.match(/^([^\d]+)?([\d,.]+)/);
  if (!match) return null;

  const symbol = match[1] ? match[1].trim() : "";
  let amountStr = match[2];
  amountStr = amountStr.replace(/,/g, "");
  const price = parseFloat(amountStr);

  return { price, symbol };
  },
  injectButton: async (price) => {
    const ulContainer = document.querySelector(".x-buybox-cta");
    if (!ulContainer || ulContainer.querySelector(".pm-watch-li")) return;
     const titleEl = document.querySelector(
    "#mainContent > div > div.vim.x-item-title > h1 > span"
  );
  const title = titleEl ? titleEl.textContent.trim() : "";
    const url = window.location.href;

    const watchlistLi = ulContainer.querySelector(".x-watch-action");
    if (!watchlistLi) return;

    const li = document.createElement("li");
    li.className = "pm-watch-li";
    li.style.marginTop = "6px";

    const btn = document.createElement("a");
    btn.className = "ux-call-to-action fake-btn fake-btn--fluid fake-btn--large fake-btn--primary";
    btn.href = "#";
    btn.innerHTML = `<span class="ux-call-to-action__cell"><span class="ux-call-to-action__text">Watch Price</span></span>`;
    btn.style.backgroundColor = "white";
    btn.style.color = "#0968f6";
    btn.style.textAlign = "center";
    btn.style.display = "block";
    btn.style.fontWeight = 100;
    btn.style.padding = "10px 16px";
    btn.style.borderRadius = "999px";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.2s ease";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      chrome.runtime.sendMessage({
        action: "ADD_EBAY_OPTION",
        price,
        url,
        title
      });
      btn.innerHTML = `<span class="ux-call-to-action__cell"><span class="ux-call-to-action__text">Added!</span></span>`;
      btn.style.backgroundColor = "#0057ff";
      btn.style.color = "#fff";
    });

    li.appendChild(btn);

    watchlistLi.insertAdjacentElement("afterend", li);
    const exist = await checkAndSetButton("ebay_watchList", watchlistLi, price, url, title);
      if(exist) { 
      btn.innerHTML = `<span class="ux-call-to-action__cell"><span class="ux-call-to-action__text">Added!</span></span>`;
      btn.style.backgroundColor = "#0057ff";
      btn.style.color = "#fff";
      }
}
  },
  dhgate: {
  match: () => window.location.hostname.includes("dhgate"),
  getPrice: () => {
  const priceEl = document.querySelector(
    "#productContent > div > div:nth-child(3) > div > div.productMain_productMain__AVkr2 > div.productMain_productMainRight__ZVyY1 > div > div.prodTotal_prodTotalWrap__igF18 > div > div.prodTotal_prodTotal___vdH_ > div.prodTotal_total__dSPWE"
  );
  if(!priceEl) return;
  const rawText = priceEl.textContent.trim();
  const match = rawText.match(/^([^\d]+)?([\d,.]+)/);
  const symbol = match[1] ? match[1].trim() : "";
  let amountStr = match[2];
  amountStr = amountStr.replace(/,/g, "");
  const price = parseFloat(amountStr);

  console.log( { price, symbol });
  return { price, symbol };
  },
  injectButton: async (price) => {
      const container = document.querySelector(".productInfo_buyBtnWarp__s6tkt");
      if (!container || container.querySelector(".pm-watch-btn")) return;
     console.log("injecting ...............")
    const url = window.location.href;
    const title = document.querySelector(
    "#productContent > div > div:nth-child(4) > div > div.productMain_productMain__AVkr2 > div.productMain_productMainRight__ZVyY1 > div > div.productInfo_productInfo__V8sBz > div.productInfo_productInfoTitle__5sgml > h1"
    );
    const watchlistBtn = document.createElement("button");
    watchlistBtn.className = "pm-watch-btn";
    watchlistBtn.type = "button";
    watchlistBtn.innerText = "Add to Watchlist";
    watchlistBtn.style.cssText = `
        background-color: rgb(254, 214, 0);
        color: #000;
        font-weight: 100;
        padding: 10px 16px;
        border-radius: 999px;
        cursor: pointer;
        display: block;
        width: 100%;
        margin-top: 6px;
        text-align: center;
        font-weight: bold;
        transition: all 0.2s ease;
        margin-left: 18px;
    `;
    watchlistBtn.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.runtime.sendMessage({
            action: "ADD_DHGATE_OPTION",
            price,
            url,
            title
        });
        watchlistBtn.innerText = "Added!";
        watchlistBtn.style.backgroundColor = "#0057ff";
        watchlistBtn.style.color = "#fff";
    });
    container.appendChild(watchlistBtn);
    const exist = await checkAndSetButton("dhgate_watchList", watchlistBtn, price, url, title);
      if(exist) { 
      watchlistBtn.innerText = "Added!";
      watchlistBtn.style.backgroundColor = "#0057ff";
      watchlistBtn.style.color = "#fff";
    }
    }
    }
    };

const checkAndSetButton = async (key, btn, price, url, title) => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (res) => {
      const list = res[key] || [];
      const exists = list.some((item) => item.url === url);
      resolve(exists);
    });
  });
};



function injectWatchButton() {
  for (const siteKey in siteHandlers) {
    const handler = siteHandlers[siteKey];
    if (handler.match()) {
      const price = handler.getPrice();
      if (price) handler.injectButton(price);
    }
  }
}

// ---------- Load & Mutation Observer ----------
window.addEventListener("load", () => setTimeout(injectWatchButton, 1000));

const observer = new MutationObserver(() => injectWatchButton());
observer.observe(document.body, { childList: true, subtree: true });


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "ADD_PRODUCT_PRICE") {
    console.log("Received in content script:", message);
    if(message.key === 'ADD_DHGATE_OPTION'){
    const res = await getDhGatePrice(message)
    console.log("res........", res)
    sendResponse({ res });
    return true;
    }

    if(message.key === 'ADD_PRODUCT_FROM_AMAZON'){
    const res = await getAmazonPrice(message)
    console.log("res........", res)
    sendResponse({ res });
    return true;
    }

    if(message.key === 'ADD_PRODUCT_FROM_DARAZ'){
    const res = await getDarazPrice(message)
    console.log("res........", res)
    sendResponse({ res });
    return true;
    }

    if(message.key === 'ADD_EBAY_OPTION'){
    const res = await getEbayPrice(message)
    console.log("res........", res)
    sendResponse({ res });
    return true;
    }
    
    return true;
  }
});

function parseHTML(html) {
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

async function getAmazonPrice(message) {  
  const url = message.url;
  const doc = parseHTML(message.htmlText);
  console.log("doc.......", doc);
  const wholeEl = doc.querySelector(".a-price-whole");
  const fractionEl = doc.querySelector(".a-price-fraction");
  const symbolEl = doc.querySelector(".a-price-symbol");
  console.log("wholeEl", wholeEl)
  if (!wholeEl) return null;

  const whole = wholeEl.textContent.replace(/\D/g, "");
  const fraction = fractionEl ? fractionEl.textContent.replace(/\D/g, "") || "00" : "00";
  const symbol = symbolEl ? symbolEl.textContent.trim() : "$";
  const price = parseFloat(`${whole}.${fraction}`)
  console.log("message.price < price", message.price < price, "data..................")
   if(message.price < price){
      chrome.runtime.sendMessage({
      action: "ADD_PRODUCT_FROM_AMAZON",
      url, price:'24', title:''
    })
  }
    return {price, symbol }
}

async function getDarazPrice(message) {
  const document = parseHTML(message.htmlText);
  const url = message.url;
  const priceEl = document.querySelector(
    "#module_product_price_1 > div > div.pdp-product-price > span"
  );
  console.log("document", document)
  // let raw = priceEl.textContent.trim();
  //  const match = raw.match(/^([^\d]+)?([\d,\.]+)/);
  // if (!match) return null;

  let triggered = '3300';
  // if (!priceEl) return null;
   if(triggered > message.price ){
      chrome.runtime.sendMessage({
      action: "ADD_PRODUCT_FROM_DARAZ",
      price:3300, url, title:''
    })
  }
    return {action:'', price:'', url, title:'', triggered}
}

async function getDhGatePrice(message) {
  const doc = parseHTML(message.htmlText);
  console.log("getDhGatePrice doc.......")
   const priceEl = doc.querySelector(
    "#productContent > div > div:nth-child(4) > div > div.productMain_productMain__AVkr2 > div.productMain_productMainRight__ZVyY1 > div > div.productInfo_productInfo__V8sBz > div.productPrice_priceWarp__rWYY7 > div > b"
  );
  const rawText = priceEl.textContent.trim();
  const match = rawText.match(/^([^\d]+)?([\d,.]+)/);
  let price = match[2];

  console.log("getDhGatePrice    message.price < price", message.price < price, "data..................")


   if(message.price < price){
      chrome.runtime.sendMessage({
      action: "ADD_DHGATE_OPTION",
      price, url, title:''
    })
  }
    return {price, symbol }
}

async function getEbayPrice(message) {
  const document = parseHTML(message.htmlText);
  const url = message.url;
  const priceEl = document.querySelector(
      "#mainContent > div > div.vim.x-price-section.mar-t-20 > div.vim.x-bin-price > div > div.x-price-primary > span"
    );
    console.log("getEbayPrice............", priceEl)
  if (!priceEl) return null;

  const rawText = priceEl.textContent.trim();

  const match = rawText.match(/^([^\d]+)?([\d,.]+)/);
  if (!match) return null;

  let amountStr = match[2];
  amountStr = amountStr.replace(/,/g, "");
  const price = parseFloat(amountStr);
  console.log("price.....", price, "message.price", message.price, "price < message.price", message.price > price )
   if( price < message.price){
      chrome.runtime.sendMessage({
      action: "ADD_EBAY_OPTION",
      price, url, title:''
    })
  }
    return {action:'', price:'', url, title:''}
}
