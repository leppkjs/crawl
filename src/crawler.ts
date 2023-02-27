import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const week = ['일', '월', '화', '수', '목', '금', '토'];
const bookmark = ['약빨이 신선함', '투신전생기']
const weekBookmark: {week: string, bookmark: Array<string>} = {
    week: '일',
    bookmark: ['약빨이 신선함', '투신전생기']
}

const crawler = async (crawlUr: string) => {
    try {
        // $에 cheerio를 로드한다.
        const $ = cheerio.load(await searchPage(`${crawlUr}/${week[0]}`));

        // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
        const lists = $("div.section-item-inner");

        // 모든 리스트를 순환한다.
        lists.each((index, list) => {
            const title = $(list).find('div.section-item-title > a > h3').text()

            if (bookmark.find((it) => it === title)) {
                console.log(index, $(list).find('div.section-item-photo > img').attr('src'));
                console.log(index, $(list).find('div.section-item-title > a').attr('href'));
            }
        });


        return Promise.resolve( []); // result);

    } catch (err) {

        return Promise.reject([]);

    }

};

const searchPage = async (url: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    // 페이지의 HTML을 가져온다.
    const content = await page.content();
    await page.close();
    // 브라우저를 종료한다.
    await browser.close();

    return content
}

export default crawler;