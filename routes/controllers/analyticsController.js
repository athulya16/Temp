const express = require('express');
const router = express.Router();
const btcTrades = require('../../db/models/btcTrades');
const verifyToken = require('../middlewares/verifyToken');
module.exports = router;


router.post('/profit', async (req, res) => {
    try {
        var totalBtcProfit = 0;
        var minBtcProfit = 100000000;
        var maxBtcProfit = -100000000;
        var averageBtcProfit = 0;
        var btcProfitPercentage = 0;
        var totalBtcFundsInvested = 0;
        var averageBtcProfitPercentage = 0
        let btcuser = await btcTrades.find({ email: req.body.email, status: 2, pair_type: "BTC" });
        for (data of btcuser) {
            if (data.sell_price !== null && data.buy_price !== null && data.quantity !== null) {
                var profit = parseFloat(data.sell_price) - parseFloat(data.buy_price);
                if (profit <= minBtcProfit) {
                    minBtcProfit = profit;
                }
                if (profit >= maxBtcProfit) {
                    maxBtcProfit = profit;
                }
                totalBtcFundsInvested += (parseFloat(data.buy_price) * parseFloat(data.quantity));
                totalBtcProfit += profit * parseFloat(data.quantity);

            }
        }
        averageBtcProfit = totalBtcProfit / btcuser.length;
        btcProfitPercentage = (totalBtcProfit / totalBtcFundsInvested) * 100;
        averageBtcProfitPercentage = btcProfitPercentage / btcuser.length;
        let btcResult = {
            BTC: totalBtcProfit,
            minBtcProfit: minBtcProfit,
            maxBtcProfit: maxBtcProfit,
            averageBtcProfit: averageBtcProfit,
            totalBtcFundsInvested: totalBtcFundsInvested,
            btcProfitPercentage: btcProfitPercentage,
            btcNumberOfTrades: btcuser.length,
            averageBtcProfitPercentage: averageBtcProfitPercentage
        }

        var totalUSDTProfit = 0;
        var minUsdtProfit = 100000000;
        var maxUsdtProfit = -100000000;
        var averageUsdtProfit = 0;
        var usdtProfitPercentage = 0;
        var totalUsdtFundsInvested = 0;
        var averageUsdtProfitPercentage = 0;
        let ussdtuser = await btcTrades.find({ email: req.body.email, status: 2, pair_type: "USDT" });
        for (data of ussdtuser) {
            if (data.sell_price !== null && data.buy_price !== null && data.quantity !== null) {
                var profit = parseFloat(data.sell_price) - parseFloat(data.buy_price);
                if (profit <= minUsdtProfit) {
                    minUsdtProfit = profit;
                }
                if (profit >= maxUsdtProfit) {
                    maxUsdtProfit = profit;
                }
                totalUSDTProfit += profit * parseFloat(data.quantity);
                totalUsdtFundsInvested += (parseFloat(data.buy_price) * parseFloat(data.quantity));
            }
        }
        averageUsdtProfit = totalUSDTProfit / ussdtuser.length;
        usdtProfitPercentage = (totalUSDTProfit / totalUsdtFundsInvested) * 100;
        averageUsdtProfitPercentage = btcProfitPercentage / btcuser.length;
        let usdtResult = {
            USDT: totalUSDTProfit,
            minUsdtProfit: minUsdtProfit,
            maxUsdtProfit: maxUsdtProfit,
            averageUsdtProfit: averageUsdtProfit,
            totalUsdtFundsInvested: totalUsdtFundsInvested,
            usdtProfitPercentage: usdtProfitPercentage,
            usdtNumberOfTrades: ussdtuser.length,
            averageUsdtProfitPercentage: averageUsdtProfitPercentage
        }
        let result = {
            BTC: btcResult,
            USDT: usdtResult
        }
        return res.json({ status: 200, message: 'Total !', result: result });
    } catch (err) {
        return res.json({ status: 400, message: 'Something went wrong, Try again later !' + err });
    }
});