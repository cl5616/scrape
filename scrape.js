const puppeteer = require('puppeteer');
// const hotel_id = 'countryinn';
// const checkin = '2019-06-16';
// const checkout = '2019-07-01';
// const selected_currency = 'GBP';

function scrape(hotel_id, checkin, checkout, selected_currency) {
    let x = (async () => {
        const browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 250 // slow down by 250ms
            defaultViewport: null,
            // devtools: true
        });
        let page = await browser.newPage();
        const url = "https://www.booking.com/hotel/gb/" + hotel_id + ".en-gb.html?checkin=" + checkin
             + ";checkout=" + checkout + ";selected_currency=" + selected_currency;
        // const url = "https://www.booking.com/hotel/gb/royal-eagle-hotel.en-gb.html?checkin=2019-06-03;checkout=2019-06-04;selected_currency=GBP";
        console.log(url);
        try {
            await page.goto(url, {timeout: 0});
        }
        catch (e) {
            console.log("goto error", e);
            browser.close();
        }
        page.on("error", function (err) {
            let theTempValue = err.toString();
            console.log("Error: " + theTempValue);
        });
    
        try {
            await page.waitForSelector(".full_hotel", {timeout:250});
            console.log("Hotel is full for the date interval.");
            process.exit(0);
        }
        catch (e) {
            console.log("Obtaining hotel prices...");
        }
        try {
            const prices = await page.evaluate(() => {
                debugger;    
                let priceTable = document.getElementsByClassName("hprt-table");
    
                if (!priceTable.length) {
                    throw new Error("Element does not exist!");
                }
    
                let tbody = document.getElementsByClassName("hprt-table")[0].tBodies[0];
                let tableElements = tbody.getElementsByTagName('tr');
                let res = {};
                let tempRoomType = "";
    
                //initialize room dict
                 Array.from(document.querySelectorAll(".hprt-roomtype-link"))
                    .map(x => res[x.textContent.trim()] = []);
    
                for (let i = 0; i < tableElements.length; i++) {
                    let element = tableElements[i];
                    if (element.childElementCount >= 4) {
                        if (element.childElementCount > 4) {
                            tempRoomType = element.querySelector(".hprt-roomtype-link").textContent.trim();
                        }
                        let priceBlock = element.querySelector(".hprt-price-price-standard");
                        if (!priceBlock) {
                            priceBlock = element.querySelector(".hprt-price-block");
                        }
                        let price = priceBlock.textContent;
                        let personCount = element.querySelector(".hprt-table-cell-occupancy").textContent;
                        let conditions = element.querySelector(".hprt-conditions").textContent;
                        let infos = {
                            "price": parseFloat(price.replace(/[,£a-zA-Z]/g, "")),
                            "personCount": parseInt(personCount.replace(/[a-zA-Z:]/g, "")),
                            "breakfastIncluded": conditions.includes("breakfast included"),
                            "refundable": !conditions.includes("Non-refundable")
                        };
                        res[tempRoomType].push(infos);
                    }
    
                }
                return res;
            });
            await browser.close();
            return prices;
        }
        catch (e) {
            console.log('an exception on page.evaluate ', e);
        }
        await browser.close();
    })();

    return x;
}
// let x = scrape(hotel_id, checkin, checkout, selected_currency);
// x.then((value) => {
//     console.log(value);
// })
// // console.log("x is", x);
export default scrape;
