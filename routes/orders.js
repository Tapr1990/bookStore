const Order = require("../models/order");
const Book = require("../models/book");
const auth = require("../middleware/auth");


const joi = require("joi");

const express = require("express");
const router = express.Router();





//* joi
const validationSchema = joi.object({
    //user_id: joi.string().alphanum().min(24).max(24).required(),
    items: joi.array().items(
        joi.object({
            //item_id: joi.number().integer().min(1).required(),
            item_id: joi.string().alphanum().min(24).max(24).required(),
            quantity: joi.number().integer().min(1).required()
        })
    )
  
}); 







router.get("/", async (req, res) => {
    const orders = await Order.find().select("user_id orderDate").sort({
        orderDate: -1//* ordenar de forma descendente
    });
    res.send(orders);
    
});

router.get("/:id", auth,async (req, res) => {



    try {
        const order =  await Order
        .findById(req.params.id)
        .populate("user_id", "_id name email phone");
            

        if(!order) {
            return res.status(404).send({"message":"not found"});
        }

        if(order.user_id != req.userPayload._id && !req.userPayload.isAdmin) {
            return res.status(403).send({"message":"forbidden"});
        }

        return res.status(200).send(order);
    }
    catch(err) {
        return res.status(400).send({"message":"Invalid ID"});
    }
    

   



  
});


router.post("/", auth, async (req, res) => {

    const order = req.body;

    try {

        await validationSchema.validateAsync(order).error;
    }

    catch(error) {
        return res.status(400).send({"message": error.details[0].message});
    }

    //* para guardar o id do user que está a fazer a encomenda
    order.user_id = req.userPayload._id;
    //!
    //order.delivery = await User.findById(request.userPayload._id).select("name street_address").lean();


    
    try {
        const confirmedList = [];

        for(let item of order.items){
            const book = await Book.findById(item.item_id);
            if(book) {

                item.title = book.title;
                item.priceEach = book.price;
                
                confirmedList.push(item);
            }

        }

        order.items = confirmedList;


        const createdOrder = new Order(order);
        await createdOrder.save();

        return res.status(200).send(createdOrder);
    }
    catch(err) {
        return res.status(400).send({"message": "Bad Request"});
    }
    
});



router.put("/:id", auth, async (req, res) => {


    const existingOrder = await Order.findById(req.params.id);
    if(!existingOrder) {
        return res.status(404).send({"message":"Invalid ID"});    
    }

    if(existingOrder.paymentDate) {
        return res.status(403).send({
            "message": "Order already paid and cannot be changed"
        });
        //return res.status(404).send({"message":"Invalid ID"});    
    }


    if(existingOrder.user_id != req.userPayload._id && !req.userPayload.isAdmin) {
        return res.status(403).send({"message":"forbidden"});
    }



    const order = req.body;

    try {

        await validationSchema.validateAsync(order).error;
    }
    catch(error) {
        return res.status(400).send({"message": error.details[0].message});
    }




    try {
        const confirmedList = [];

        for(let item of order.items){
            const book = await Book.findById(item.item_id);
            if(book) {

                item.title = book.title;
                item.priceEach = book.price;
                
                confirmedList.push(item);
            }

        }

        order.items = confirmedList;
        
        const updateOrder = await Order.findByIdAndUpdate(
            req.params.id, order, {new: true}
        );

      

        return res.status(202).send(updateOrder);
    }
    catch(err) {
        return res.status(400).send({"message":"Invalid ID"});
    }


});


router.delete("/:id", auth, async (req, res) => {

  
    try {
        const order = await Order.findById(req.params.id);
        if(!order) {
            return res.status(404).send({"message":"Invalid ID"});    
        }

        if(order.user_id != req.userPayload._id && !req.userPayload.isAdmin) {
            return res.status(403).send({"message":"forbidden"});
        }
        
        await Order.findByIdAndDelete(req.params.id);


        return res.status(202).send({"message":"Delete ID " + req.params.id});
        
    }
    catch(err) {
        return res.status(400).send({"message":"Invalid ID"});
    }

});

module.exports = router;