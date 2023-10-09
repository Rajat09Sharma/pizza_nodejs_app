const axios  = require("axios");
const moment=require("moment");
const Toastify=require("toastify-js");

async function initAdmin(socket){

    const adminOrderTableBody=document.querySelector("#admin-order-table-body");
    var orders=[];
    // let markup;

    try{
        const result= await axios.get("/admin/orders",{headers: {'X-Requested-With': 'XMLHttpRequest'}});
        console.log(result.data);
        if(result){
            orders=result.data;
            let markup=generateMarkup(orders);
            adminOrderTableBody.innerHTML = markup;
        }
    }catch(err){
        console.log(err);
    }

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p class="m-0">${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
            `
        }).join('');
      }

    function generateMarkup(orders){
        return orders.map(order => {
            return `
                <tr>
                <td class="px-4 py-2 text-success">
                    <p class="m-0">${ order._id }</p>
                    <div>${ renderItems(order.items) }</div>
                </td>
                <td class="px-4 py-2">${ order.customerId.name }</td>
                <td class="px-4 py-2">${ order.address }</td>
                <td class="px-4 py-2">${ order.phone }</td>
                <td class="px-4 py-2">
                    <div class="d-inline-block  w-75">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()" 
                              class="form-select d-block w-100 px-4 py-3 border border-secondary-subtle" aria-label="Floating label select example">
                                <option value="order_placed" ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed
                                </option>
                                <option  value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                Confirmed
                                </option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                Prepared
                                </option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                Completed
                                </option>
                            </select>
                        </form>
                    </div>
                </td>
                <td class="px-4 py-2">
                    ${ moment(order.createdAt).format('MMM Do YYYY, hh:mm A') }
                </td>
            </tr>
        `
        }).join('');
    }

    socket.on("orderPlaced",(order)=>{
        Toastify({
            text: "New order Added!!.",
            className: "info",
            duration:"1000",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)", //green color for success message.
              borderRadius:"50px"
            }
          }).showToast();
          orders.unshift(order);
          adminOrderTableBody.innerHTML ="";
          adminOrderTableBody.innerHTML = generateMarkup(orders);
    });

}

module.exports=initAdmin;