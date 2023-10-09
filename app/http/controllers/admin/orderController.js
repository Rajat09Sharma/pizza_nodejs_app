const Order = require("../../../models/order");

function orderController(){
    return{
        async index(req,res){
            try{
                const order=await Order.find({status:{$ne:"completed"}}).sort({createdAt:"descending"})
                .populate("customerId","-password").exec();
                    if(req.xhr){
                        return res.json(order);
                    }else{
                        return res.render("admin/orders");
                    }
            }catch(err){
                console.log(err);
            }

        }
    }
}

module.exports=orderController;
