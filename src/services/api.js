import arweave from "./arweave";
import {
    currentUnixTime,
    getAppName
} from './utils';

class ApiService {
    getWalletAddress = (wallet) => {
        return arweave.wallets.jwkToAddress(wallet);
    }

    getWalletAmount = (address) => {
        return arweave.wallets.getBalance(address);
    }

    convertToAr = (amount) => {
        return arweave.ar.winstonToAr(amount);
    }

    postTweet = async (tweet, wallet) => {
        Object.assign(tweet, {
            time: currentUnixTime(),
            type: "tweet"
        });

        const transaction = await arweave.createTransaction({
                data: JSON.stringify(tweet)
            },
            wallet
        );
        transaction.addTag('Transaction-Type', tweet.type);
        transaction.addTag('Time', tweet.time);
        transaction.addTag('App-Name', getAppName());

        await arweave.transactions.sign(transaction, wallet);
        const response = await arweave.transactions.post(transaction);
        return response;
    }

    getAllTweets = async () => {
        const query = {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'Transaction-Type',
                expr2: 'tweet'
            },
            expr2: {
                op: 'equals',
                expr1: 'App-Name',
                expr2: getAppName()
            }
        };

        const txids = await arweave.arql(query);

        const transactions = await Promise.all(
            txids.map(txid => arweave.transactions.get(txid))
        );

        const stringifiedTransactions = await Promise.all(
            transactions.map(transaction =>
                transaction.get('data', {
                    decode: true,
                    string: true
                })
            )
        );
        // console.log(stringifiedTransactions);
        return stringifiedTransactions;
    }
}

export default new ApiService()