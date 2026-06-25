import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Checkout(){


const navigate = useNavigate();


const [address,setAddress] = useState("");

const [phone,setPhone] = useState("");



const cart = JSON.parse(
localStorage.getItem("cart")
) || [];



const token = localStorage.getItem("token");





const placeOrder = ()=>{


if(!address || !phone){

alert("Enter address and phone");

return;

}




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


body:JSON.stringify({

products: cart.map(item=>item.id)

})

}

)



.then(async res=>{


const data = await res.json();


console.log(
"ORDER RESPONSE:",
data
);



if(res.ok){


alert(
"Order Placed Successfully 💎"
);



localStorage.removeItem("cart");



navigate("/");


}

else{


console.log(
"ERROR:",
data
);


alert(
"Order Failed"
);


}


})


.catch(err=>{


console.log(
"ORDER ERROR:",
err
);


});



};







return(


<div className="checkout">



<h1>

Checkout 💎

</h1>





<h2>

Products

</h2>





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

₹{item.price}

</p>


<p>

Quantity :

{item.quantity}

</p>



</div>


))


}







<h2>


Total ₹

{

cart.reduce(

(a,b)=>

a+(b.price*b.quantity),

0

)


}


</h2>







<input

placeholder="Address"

value={address}

onChange={

e=>setAddress(e.target.value)

}

/>





<input

placeholder="Phone Number"

value={phone}

onChange={

e=>setPhone(e.target.value)

}

/>








<button

onClick={placeOrder}

>


Place Order 💎


</button>





</div>


);



}



export default Checkout;