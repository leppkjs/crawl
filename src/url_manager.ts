import axios from 'axios';

const MAX_RETRY = 10;
let retryCount: number = 0;
const returnsTheLatestUrl = async (protocol: string, domainPrefix: string, domainPostfix: number, dot: string) => {

    try {
        await callUrl(`${protocol}${domainPrefix}${domainPostfix}${dot}`);
        return domainPostfix

    } catch (error) {
        // @ts-ignore
        if (isItRetryable(++retryCount, error.code)) {
            let ruri = `${protocol}${domainPrefix}${domainPostfix}${dot}`;
            console.log(retryCount, ruri)
            await returnsTheLatestUrl(protocol, domainPrefix, ++domainPostfix, dot);
        } else
            throw error;
    }

}

const callUrl = async (url: string) => await axios.get(url);

const isItRetryable = (retryCount: number, errorCode: String) => retryCount < MAX_RETRY && errorCode == 'ECONNRESET';

export default returnsTheLatestUrl;