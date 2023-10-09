
const User= require("../models/user");
function init(passport){

  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


}

module.exports=init;