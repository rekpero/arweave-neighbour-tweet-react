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

    likeTweet = async (txnId, walletAddress, wallet) => {
        let like = {
            tweetId: txnId,
            time: currentUnixTime(),
            type: "like"
        }

        const transaction = await arweave.createTransaction({
                data: JSON.stringify(like)
            },
            wallet
        );
        transaction.addTag('Transaction-Type', like.type);
        transaction.addTag('Time', like.time);
        transaction.addTag('Tweet-Id', like.tweetId);
        transaction.addTag('App-Name', getAppName());

        await arweave.transactions.sign(transaction, wallet);
        const response = await arweave.transactions.post(transaction);
        return response;
    }

    commentTweet = async (comment, wallet) => {
        Object.assign(comment, {
            time: currentUnixTime(),
            type: "comment"
        });

        const transaction = await arweave.createTransaction({
                data: JSON.stringify(comment)
            },
            wallet
        );
        transaction.addTag('Transaction-Type', comment.type);
        transaction.addTag('Time', comment.time);
        transaction.addTag('Tweet-Id', comment.tweetId);
        transaction.addTag('App-Name', getAppName());

        await arweave.transactions.sign(transaction, wallet);
        const response = await arweave.transactions.post(transaction);
        return response;
    }

    getLikeByTweetId = async (txnId) => {
        const query = {
            op: 'and',
            expr1: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'Transaction-Type',
                    expr2: 'like'
                },
                expr2: {
                    op: 'equals',
                    expr1: 'Tweet-Id',
                    expr2: txnId
                }
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

        const allTransactions = await Promise.all(
            transactions.map(async (transaction, id) => {
                    let transactionNew = JSON.parse(transaction.get('data', {
                        decode: true,
                        string: true
                    }))
                    Object.assign(transactionNew, {
                        owner: await arweave.wallets.ownerToAddress(transaction.get('owner')),
                        txid: txids[id]
                    })

                    return transactionNew
                }

            )
        );

        // console.log(stringifiedTransactions);
        return allTransactions;
    }

    getCommentByTweetId = async (txnId) => {
        const query = {
            op: 'and',
            expr1: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'Transaction-Type',
                    expr2: 'comment'
                },
                expr2: {
                    op: 'equals',
                    expr1: 'Tweet-Id',
                    expr2: txnId
                }
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

        const allTransactions = await Promise.all(
            transactions.map(async (transaction, id) => {
                    let transactionNew = JSON.parse(transaction.get('data', {
                        decode: true,
                        string: true
                    }))
                    Object.assign(transactionNew, {
                        owner: await arweave.wallets.ownerToAddress(transaction.get('owner')),
                        txid: txids[id]
                    })

                    return transactionNew
                }

            )
        );

        // console.log(stringifiedTransactions);
        return allTransactions;
    }

    // getLikeByTweetIdAndWallet = async (txnId, address) => {
    //     const query = {
    //         op: 'and',
    //         expr1: {
    //             op: 'and',
    //             expr1: {
    //                 op: 'equals',
    //                 expr1: 'Transaction-Type',
    //                 expr2: 'like'
    //             },
    //             expr2: {
    //                 op: 'equals',
    //                 expr1: 'Tweet-Id',
    //                 expr2: txnId
    //             }
    //         },
    //         expr2: {
    //             op: 'and',
    //             expr1: {
    //                 op: 'equals',
    //                 expr1: 'App-Name',
    //                 expr2: getAppName()
    //             },
    //             expr2: {
    //                 op: 'equals',
    //                 expr1: 'from',
    //                 expr2: address
    //             }

    //         }
    //     };

    //     const txids = await arweave.arql(query);

    //     const transactions = await Promise.all(
    //         txids.map(txid => arweave.transactions.get(txid))
    //     );

    //     const allTransactions = await Promise.all(
    //         transactions.map((transaction, id) => {
    //                 let transactionNew = JSON.parse(transaction.get('data', {
    //                     decode: true,
    //                     string: true
    //                 }))
    //                 Object.assign(transactionNew, {
    //                     owner: transaction.get('owner'),
    //                     txid: txids[id]
    //                 })

    //                 return transactionNew
    //             }

    //         )
    //     );

    //     // console.log(stringifiedTransactions);
    //     return allTransactions;
    // }



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

        const allTransactions = await Promise.all(
            transactions.map(async (transaction, id) => {
                    let transactionNew = JSON.parse(transaction.get('data', {
                        decode: true,
                        string: true
                    }))
                    const allLikes = await this.getLikeByTweetId(txids[id]);
                    const allComments = await this.getCommentByTweetId(txids[id])
                    // console.log(await arweave.wallets.ownerToAddress(transaction.get('owner')))
                    Object.assign(transactionNew, {
                        owner: await arweave.wallets.ownerToAddress(transaction.get('owner')),
                        txid: txids[id],
                        likes: allLikes,
                        comments: allComments
                    })

                    return transactionNew
                }

            )
        );

        // console.log(stringifiedTransactions);
        return allTransactions;
    }

    getAllTweetsByWallet = async (address) => {
        const query = {
            op: 'and',
            expr1: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'Transaction-Type',
                    expr2: 'tweet'
                },
                expr2: {
                    op: 'equals',
                    expr1: 'from',
                    expr2: address
                }
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

        const allTransactions = await Promise.all(
            transactions.map(async (transaction, id) => {
                    let transactionNew = JSON.parse(transaction.get('data', {
                        decode: true,
                        string: true
                    }))
                    const allLikes = await this.getLikeByTweetId(txids[id]);
                    const allComments = await this.getCommentByTweetId(txids[id])
                    // console.log(await arweave.wallets.ownerToAddress(transaction.get('owner')))
                    Object.assign(transactionNew, {
                        owner: await arweave.wallets.ownerToAddress(transaction.get('owner')),
                        txid: txids[id],
                        likes: allLikes,
                        comments: allComments
                    })

                    return transactionNew
                }

            )
        );

        // console.log(stringifiedTransactions);
        return allTransactions;
    }

    sendGiftCard = async (toAddress, amount, note, wallet) => {
        note = {
            note: note,
            time: currentUnixTime()
        }

        const transaction = await arweave.createTransaction({
                target: toAddress,
                quantity: arweave.ar.arToWinston(amount),
                data: JSON.stringify(note)
            },
            wallet
        );
        transaction.addTag('Transaction-Type', 'Gift-Card');
        transaction.addTag('Time', note.time);
        transaction.addTag('App-Name', getAppName());

        await arweave.transactions.sign(transaction, wallet);
        const response = await arweave.transactions.post(transaction);
        return response;
    }

    getSentGiftCard = async (address) => {
        const query = {
            op: 'and',
            expr1: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'Transaction-Type',
                    expr2: 'Gift-Card'
                },
                expr2: {
                    op: 'equals',
                    expr1: 'from',
                    expr2: address
                }
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

        const allTransactions = await Promise.all(
            transactions.map(async (transaction, id) => {
                    let transactionNew = JSON.parse(transaction.get('data', {
                        decode: true,
                        string: true
                    }))
                    Object.assign(transactionNew, {
                        owner: await arweave.wallets.ownerToAddress(transaction.get('owner')),
                        target: transaction.get('target'),
                        amount: transaction.get('quantity'),
                        txid: txids[id],
                    })

                    return transactionNew
                }

            )
        );

        return allTransactions;
    }

    getGotGiftCard = async (address) => {
        const query = {
            op: 'and',
            expr1: {
                op: 'and',
                expr1: {
                    op: 'equals',
                    expr1: 'Transaction-Type',
                    expr2: 'Gift-Card'
                },
                expr2: {
                    op: 'equals',
                    expr1: 'to',
                    expr2: address
                }
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

        const allTransactions = await Promise.all(
            transactions.map(async (transaction, id) => {
                    let transactionNew = JSON.parse(transaction.get('data', {
                        decode: true,
                        string: true
                    }))
                    Object.assign(transactionNew, {
                        owner: await arweave.wallets.ownerToAddress(transaction.get('owner')),
                        target: transaction.get('target'),
                        amount: transaction.get('quantity'),
                        txid: txids[id],
                    })

                    return transactionNew
                }

            )
        );

        return allTransactions;
    }

}

export default new ApiService()