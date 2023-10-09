function cartController(){
    return {
        index(req,res){
            return  res.render("customer/cart")
        },
        update(req,res){
            // console.log(req.body);
            // for the first time creating cart and adding basic structure of cart into sessionn.
            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
            }
            // check if item does not exit in cart
            let cart=req.session.cart;
            if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item:req.body,
                    qty:1
                };
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }else{
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }
            return res.json({totalQty:req.session.cart.totalQty})
        }
    }
}

module.exports=cartController;

// basic struture of cart 
// cart ={
//     items:{
//         pizzaId:{item:pizzaObject,qty:0}
//     },
//     totalQty:0,
//     totalPrice:0
// }