const mongoose = require('mongoose');

var btctradeSchema = mongoose.Schema({
    email: {
        type: String,
        default: null,
    },
    pair: {
        type: String,
        default: null,
    },
    status: {
        type: Number,
        default: null,
    },
    buy_price: {
        type: String,
        default: null,
    },
    sell_price: {
        type: String,
        default: null,
    },
    quantity: {
        type: String,
        default: null,
    },
    stop_loss: {
        type: String,
        default: null,
    },
    fund: {
        type: String,
        default: null,
    },
    order_type: {
        type: String,
        default: "0",
    },
    pair_type: {
        type: String,
        default: null,
    },
    sell_stop: {
        type: String,
        default: null,
    },
    order_id: {
        type: String,
        default: null,
    },
    profit_percentage: {
        type: String,
        default: '0',
    },
    trade_type: {
        type: String,
        default: null,
    },
    signal_type: {
        type: String,
        default: null,
    },
    signal_time: {
        type: Date,
        default: null,
    },
    pause_time: {
        type: Date,
        default: Date.now(),
    },
    duration: {
        type: String,
        default: null,
    },
    buy_chase: {
        type: String,
        default: null,
    },
    sell_chase: {
        type: String,
        default: null,
    },
    trail_buy: {
        type: String,
        default: null,
    },
    trail_sell: {
        type: String,
        default: null,
    },
    fixed_sell: {
        type: String,
        default: '0',
    },
    fixed_profit: {
        type: String,
        default: null,
    },
    signal: {
        type: Boolean,
        default: false,
    },
    bot_status: {
        type: Boolean,
        default: true,
    },
    autosell: {
        type: Boolean,
        default: true,
    },
    chase_status: {
        type: String,
        default: null,
    },
    price_change: {
        type: String,
        default: null,
    },
    signal_id: {
        type: String,
        default: null,
    },
    chase_updated_at: {
        type: Date,
        default: null,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    }
});


var btctrade = mongoose.model('btctrade', btctradeSchema);

module.exports = btctrade;