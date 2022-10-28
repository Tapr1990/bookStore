const mongoose = require("mongoose");

const User = require("./users");

const orderSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    
    orderDate: {
        type: Date,
        default: Date.now(),
        
    },
    paymentDate: {
        type: Date,
        default: null
    },
    items: [
        {
            item_id: {type: mongoose.Schema.Types.ObjectId, required: true},
            quantity: {type: Number, min: 1, required: true},
            priceEach: {type: Number, min: 1, required: true},
            title: {type: String, min: 1, required: true},
        
        }
    ]
});
        
const Order = mongoose.model("order", orderSchema);
    
module.exports = Order;
 
        
      