import returnsTheLatestUrl from './url_manager';
import crawler from './crawler';

(async () => {
    const protocol = 'https://';
    const domainPrefix = 'funbe';
    const domainPostfix = 219;
    const dot = '.com';

    console.log("♥♥♥ Run Crawling... Webtton ♥♥♥");

    const latestDomainPostfix = await returnsTheLatestUrl(protocol, domainPrefix, domainPostfix, dot);

    if(domainPostfix !== latestDomainPostfix) {
        console.log('URL을 최신화 한다. DB 업데이트....', latestDomainPostfix);
    }

    crawler(`${protocol}${domainPrefix}${domainPostfix}${dot}`)

})()