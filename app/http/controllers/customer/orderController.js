
const Order=require("../../../models/order");
const moment=require("moment");

function orderController(){
    return {
        async store(req,res){
            console.log(req.body);

            const{phone,address}=req.body;

            // validate request
            if(!phone || !address){
                req.flash("error","All fields are required");
                return res.redirect("/cart");
            }

            const userOrder= new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone:phone,
                address:address
            });

            try{
                const result = await userOrder.save();
                if(result){
                    const order=await Order.populate(result,{path:"customerId"});
                    if(order){
                        req.flash("success","order placed successfully");
                        delete req.session.cart;
                        // event emiiter
                        const eventEmitter=req.app.get("eventEmitter");
                        eventEmitter.emit("orderPlaced",order);
                        return res.redirect("/customer/orders");
                    }
                   
                }
            }catch(err){
                console.log(err);
                return res.redirect("/cart");
            }
        },
        async index(req,res){

            try{
                const orders=await Order.find({customerId:req.user._id}).sort({createdAt:"descending"});
                // console.log(orders);
                res.header('Cache-Control', 'no-store');
                return res.render("customer/order",{orders:orders,moment:moment});
                
            }catch(err){
                console.log(err);
                return res.redirect("/cart");
            }

        },
        async show(req,res){
            
            try{
                const order= await Order.findById(req.params.id);
                
                // autherised user
                if(JSON.stringify(req.user._id)==JSON.stringify(order.customerId)){
                    return res.render("customer/singleOrder",{order:order});
                }else{
                    return res.redirect("/");
                }
            }catch(err){
                console.log(err);
                return res.redirect("/customer/orders");
            }
        }
    }
}

module.exports=orderController;