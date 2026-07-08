import {useState} from "react";
import {useNavigate} from "react-router-dom";


function Checkout(){


const navigate = useNavigate();


const token = localStorage.getItem("token");



const [cart,setCart]=useState(()=>{


return JSON.parse(

localStorage.getItem("cart")

)||[];


});





const total = cart.reduce(

(sum,item)=>

sum + item.price * item.quantity,

0

);





const placeOrder=()=>{


const productIds = cart.map(

item=>item.id

);




fetch(

"http://127.0.0.1:8000/api/orders/create/",

{

method:"POST",


headers:{


"Content-Type":"application/json",


Authorization:

`Bearer ${token}`


},


body: JSON.stringify({
    products: productIds,
    payment_method: paymentMethod
})


}

)


.then(res=>res.json())

.then(data=>{


console.log(

"ORDER CREATED",

data

);



alert(

"Order Placed 🎉"

);



localStorage.removeItem(

"cart"

);



navigate("/orders");



});


};





return(


<div>


<h1>

Checkout 💳

</h1>




{

cart.map(item=>(


<div

className="cart-item"

key={item.id}

>


<h3>

{item.name}

</h3>



<p>

Qty : {item.quantity}

</p>



<p>

₹{item.price}

</p>



</div>


))


}





<h2>

Total : ₹{total}

</h2>

<h3>Select Payment Method</h3>

<select
    value={paymentMethod}
    onChange={(e)=>setPaymentMethod(e.target.value)}
>

    <option value="COD">
        Cash On Delivery
    </option>

    <option value="UPI">
        UPI
    </option>

    <option value="Card">
        Credit / Debit Card
    </option>

</select>



<button

className="cart-btn"

onClick={placeOrder}

>


Place Order 📦


</button>




</div>


);


}


export default Checkout;