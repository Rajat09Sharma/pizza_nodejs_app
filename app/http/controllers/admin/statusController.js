const Order = require("../../../models/order");

function statusController(){

    return{
        async update(req,res){
            // console.log(req.body);
            const { orderId, status }=req.body;
            try{
                const result= await Order.updateOne({_id:orderId},{status:status});
                if(result){
                    // console.log(result);
                    // Emit event
                    const eventEmitter=req.app.get("eventEmitter");
                    eventEmitter.emit("orderUpdated",{id:req.body.orderId,status:req.body.status});
                    return res.redirect("/admin/orders");
                }
            }catch(err){
                console.log(err);
                return res.redirect("/admin/orders");
            }
        }
    }
}

module.exports=statusController;