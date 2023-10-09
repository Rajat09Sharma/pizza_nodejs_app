
const homeController=require("../app/http/controllers/homeController");
const authController=require("../app/http/controllers/authController");
const cartController=require("../app/http/controllers/customer/cartcontroller");
const orderController=require("../app/http/controllers/customer/orderController")
const guestMiddleware=require("../app/http/midlewares/guest");
const authMiddleware = require("../app/http/midlewares/auth");
const adminOrderController = require("../app/http/controllers/admin/orderController");
const adminMinddleware = require("../app/http/midlewares/admin");
const statusController = require("../app/http/controllers/admin/statusController");



function initRoutes(app){

 
    app.get("/",homeController().index);

    
    app.get("/login", guestMiddleware ,authController().login);
    app.post("/login",authController().postLogin);
    app.get("/login-failure",authController().loginFailure);
    app.get("/logout",authController().logout)
    
    app.get("/register", guestMiddleware ,authController().register);
    app.post("/register",authController().postRegister);

    app.get("/cart",cartController().index);
    app.post("/update-cart",cartController().update);

    app.post("/order", authMiddleware ,orderController().store);
    app.get("/customer/orders", authMiddleware ,orderController().index);
    app.get("/customer/order/:id",authMiddleware ,orderController().show)

    // adim routes
    app.get("/admin/orders", adminMinddleware ,adminOrderController().index);
    app.post("/admin/order/status", adminMinddleware, statusController().update);
    
}

module.exports=initRoutes;