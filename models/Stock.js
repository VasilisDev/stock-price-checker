/*
*
*
*       @Author:Vasileios Tsakiris
*
*
*/

const mongoose = require("mongoose");
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

const StockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true
    },
    likes: {
        type: Number,
        default: 0
    },
    ips:{ type:[String],
         default: []
    },price: {
        type: SchemaTypes.Double,
        default: 0
    }
});

const Stock = mongoose.model("stock", StockSchema);

module.exports = { Stock };
