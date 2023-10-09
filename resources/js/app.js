const axios =require("axios");

const Toastify=require("toastify-js");
const initAdmin = require("./admin");
const moment=require("moment");

let addToCart=document.querySelectorAll(".add-to-cart");

addToCart.forEach((btn)=>{
    btn.addEventListener("click",function (e){
        let userClickedPizza=JSON.parse( btn.dataset.pizza);
        updateCart(userClickedPizza)
        // console.log(userClickedPizza);
    })
});

async function updateCart(userClickedPizza){
    // create post request using axios to update cart session
    try{
        const result=await axios.post("/update-cart" ,userClickedPizza);
        Toastify({
            text: "Pizza added to cart successfully!!.",
            className: "info",
            duration:"1000",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)", //green color for success message.
              borderRadius:"50px"
            }
          }).showToast();
        document.querySelector("#count").innerText=result.data.totalQty
    }catch(err){
        Toastify({
            text: "Something went wrong.",
            className: "info",
            style: {
              background: "linear-gradient(to right,rgb(255,95,109),rgb(255,195,113))", //red colour for error message
              borderRadius:"50px"
            }
          }).showToast();
        console.log(err);
    }
}

// remove order page success alert message 
const messageAlert=document.querySelector("#success-alert");
setTimeout(function (){
  if(messageAlert){
    messageAlert.remove();
  }
},2000);




// change statuses
var hiddenInput=document.querySelector("#hidden-input");
var order= hiddenInput ? hiddenInput.value : null;
order=JSON.parse(order)

var orderStatuses=document.querySelectorAll("#order-status");
var time= document.createElement("small")

function upadateStatus(order){
  orderStatuses.forEach((status)=>{
    status.classList.remove("current","step-completed", "status-line");
  });
  var stepCompleted=true;
  orderStatuses.forEach((status)=>{
    var dataValue=status.dataset.status;
    if(stepCompleted){
      status.classList.add("step-completed", "status-line");
    }
    if(dataValue===order.status){
      stepCompleted=false;
      time.innerText=moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if(status.nextElementSibling){
        status.nextElementSibling.classList.add("current")
      }
    }
  })

}

upadateStatus(order);

// socket
const socket = io();



//admin socket 
const onAdminPage=window.location.pathname;
// console.log(onAdminPage);
if(onAdminPage.includes("admin")){
  // admin function
  initAdmin(socket);
  socket.emit("join","adminRoom");
}



// customer 
// join private room on socket at server to update order status of customer in real time
if(order){
  socket.emit("join","order_"+order._id);
}

socket.on("orderUpdated",(data)=>{
  const updatedOrder={...order};
  // updatedOrder.updatedAt=moment().format();
  updatedOrder.status=data.status;
  upadateStatus(updatedOrder);
  Toastify({
    text: "order upadated!!.",
    className: "info",
    duration:"1000",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)", //green color for success message.
      borderRadius:"50px"
    }
  }).showToast();
  // console.log(data);
})