import {Document} from 'cheerio';

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const crawler = async (crawl_object: any) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(crawl_object.href);

        const content = await page.content();
        await page.close();
        await browser.close();

        const $ = cheerio.load(content);
        const result: any[] = [];
        $(crawl_object.select_path).each(function (idx: number, element: Document) {
            const $data = cheerio.load(element);
            const return_data = {};
            crawl_object.items.forEach((item: any) => {
                if (item.text === true) {
                    return_data[item.name] = $data(item.path).text();
                }

                if (item.href === true) {
                    return_data[item.name] = $data(item.path).attr('href');
                }
            });

            // -> 여기부터는 내부 로직
        });
        //console.log(result);
        return Promise.resolve(result);
    } catch (err) {
        return Promise.reject([]);
    }
};

module.exports = {
    crawler,
};