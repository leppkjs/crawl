import puppeteer, {Page} from 'puppeteer';
import cheerio from 'cheerio';
import Collect from './dto/Collect';
import Detail from './dto/Detail';


const path = '웹툰';
const week = ['일', '월', '화', '수', '목', '금', '토'];
// const bookmark = ['약빨이 신선함', '투신전생기']
const bookmark = ['약빨이 신선함']
const weekBookmark: { week: string, bookmark: Array<string> } = {
    week: '일',
    bookmark: ['약빨이 신선함', '투신전생기']
}

const crawler = async (crawlUr: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {

        let weekUrl = `${crawlUr}/${path}/${week[0]}`;

        const lists = await getListOfFavoritesForDayOfTheWeek(page, weekUrl);

        const details = [];
        for (let index = 0; index < lists.length; index++) {
            details.push(...await getOneOfFavoritesForDayOfTheWeek(page, `${crawlUr}${lists[index].link}`));
        }

        for (let index = 0; index < details.length; index++) {
            details[index].html = await getContent(page, `${crawlUr}${details[index].link}`);
        }

        // TODO DB 저장

        return Promise.resolve([]); // result);

    } catch (err) {

        return Promise.reject([]);

    } finally {
        // 브라우저를 종료한다.
        await browser.close();
    }

};

const getListOfFavoritesForDayOfTheWeek = async (page: Page, url: string) => {
    // $에 cheerio를 로드한다.
    const $ = cheerio.load(await searchPage(page, url));

    // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
    const lists = $("div.section-item-inner");

    const collects: Array<Collect> = [];

    // 모든 리스트를 순환한다.
    lists.each(async (index, list) => {
        const title = $(list).find('div.section-item-title > a > h3').text()

        if (bookmark.find((it) => it === title)) {
            const collect: Collect = {link: '', thumbnail: undefined, title: ''};

            collect.title = title;
            collect.thumbnail = $(list).find('div.section-item-photo > img').attr('src');
            collect.link = $(list).find('div.section-item-title > a').attr('href');

            collects.push(collect)
        }


    });

    return collects
}

const getOneOfFavoritesForDayOfTheWeek = async (page: Page, url: string) => {
    // $에 cheerio를 로드한다.
    const $ = cheerio.load(await searchPage(page, url));

    const detailLink = $('#fboardlist > .web_list > tbody > tr.tborder');

    const detailList: Array<Detail> = []
    detailLink.each((index, list) => {
        const detail: Detail = {html: null, link: undefined, title: ''};
        detail.title = $(list).find('.content__title').text();
        detail.link = $(list).find('.content__title').attr('data-role');

        if (checkExist(url, detail.title)) {
            detailList.push(detail)
        }

    });

    return detailList;

}

const getContent = async (page: Page, url: string) => {
    // $에 cheerio를 로드한다.
    const $ = cheerio.load(await searchPage(page, url));
    return $('#toon_img').html();
}

const checkExist = (dbId: string, title: string) => {
    // TODO 최신 링크가 이미 수집된건지 확인
    // if(DBList.find(title)) {
    //     return;
    // }
    return true;
}

const searchPage = async (page: Page, url: string) => {
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    // 페이지의 HTML을 가져온다.
    return await page.content();
}

export default crawler;