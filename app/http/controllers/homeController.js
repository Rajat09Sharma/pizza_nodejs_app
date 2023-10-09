
const Menu=require("../../models/menu");

function homeController(){
    return {
        async index(req,res){
            try{
                const result=await Menu.find({});
                if(result) return res.render("home",{pizzas:result}); 
            }catch(err){
                console.log(err);
            }
        }
    }
}

module.exports=homeController;