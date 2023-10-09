
const User=require("../../models/user");
const passport=require("passport");

function authController(){
    return {
        login(req,res){
            return res.render("customer/login")
        },
        register(req,res){
            return res.render("customer/register")
        },
        async postRegister(req,res){
            const{name,email,password}=req.body;
            console.log(req.body);

            // validity check!!
            if(!name||!email||!password){
                req.flash("error","All feilds are required");
                req.flash("name",name);
                req.flash("email",email);
                return res.redirect("/register");
            }

            // checking email already exist or not 
            try{
                const userFind = await User.exists({email:email});
                if(userFind){
                    req.flash("error","Email address already taken");
                    req.flash("name",name);
                    req.flash("email",email);
                    return res.redirect("/register");
                }
            }catch(error){
                console.log(err);
            }

            User.register(new User({
                email:email,
                name:name}),password,function(err){
                if(err){
                    console.log(err);
                    return res.redirect("/register");
                }else{
                    passport.authenticate("local",{keepSessionInfo: true})(req,res,function(){
                        return res.redirect("/");
                    });
                }
            });

        },
        postLogin(req,res){
            const user = new User({
                email:req.body.email,
                password:req.body.password
            });
            req.logIn(user,{session:false},function(err){
                if(err){
                    console.log(err);
                    req.flash("error","Something went wrong");
                    return res.redirect("/login");
                }else{
                    passport.authenticate("local",{failureRedirect: '/login-failure',keepSessionInfo: true})(req,res,function(){
                        if(req.user.role==="admin"){
                            return res.redirect("/admin/orders");
                        }else{
                            return res.redirect("/customer/orders");
                        }se 
                        
                    });
                }
            })
        },
        loginFailure(req,res){
            req.flash("error","Wrong username or password");
            return res.redirect("/login")
        },
        logout(req,res){
            req.logout(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/");
                }
            });
        }
    }
}

module.exports=authController;