import returnsTheLatestUrl from './url_manager';
import crawler from './crawler';

(async () => {
    const protocol = 'https://';
    const domainPrefix = 'funbe';
    const domainPostfix = 215;
    const dot = '.com';
    const path = '웹툰';

    console.log("Run Crawling... Funbe");

    const latestDomainPostfix = await returnsTheLatestUrl(protocol, domainPrefix, domainPostfix, dot);

    if(domainPostfix !== latestDomainPostfix) {
        console.log('URL을 최신화 한다. DB 업데이트....', latestDomainPostfix);
    }

    crawler(`${protocol}${domainPrefix}${domainPostfix}${dot}/${path}`)

})()