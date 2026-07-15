import {useEffect,useState} from "react";


function MyOrders(){


const [orders,setOrders]=useState([]);


const token = localStorage.getItem("token");




const loadOrders=()=>{


fetch(

"https://jewelry-ecommerce-react-django-5.onrender.com/api/orders/myorders/",

{

headers:{


Authorization:

`Bearer ${token}`

}

}

)


.then(res=>res.json())

.then(data=>{


console.log(

"MY ORDERS",

data

);


setOrders(data);


});


};





useEffect(()=>{


loadOrders();


},[]);







const cancelOrder=(id)=>{


fetch(

`https://jewelry-ecommerce-react-django-5.onrender.com/api/orders/cancel/${id}/`,

{

method:"POST",

headers:{


Authorization:

`Bearer ${token}`

}

}

)


.then(res=>res.json())

.then(data=>{


alert(

"Order Cancelled"

);


loadOrders();


});


};







return(


<div>


<h1>

My Orders 📦

</h1>





{

orders.length===0 ?


<h2>

No Orders Yet 😔

</h2>


:


orders.map(order=>(



<div

className="order-card"

key={order.id}

>



<h2>

Order #{order.id}

</h2>



<p>

Customer:
{order.user || "You"}

</p>




<p>
Status:
<span
className={
"status " + order.status.toLowerCase()
}
>
{order.status}
</span>
</p>

<p>Payment : {order.payment_method}</p>

<p>Payment Status : {order.payment_status}</p>

<p>Total : ₹{order.total_price}</p>

<p>
Ordered On :
{new Date(order.created_at).toLocaleString()}
</p>





<h3>

Products 💎

</h3>



{

order.products?.map(product=>(


<p key={product.id}>


💎 {product.name}

₹{product.price}


</p>


))


}




{

order.total_price &&


<h2>

Total ₹{order.total_price}

</h2>


}







{

order.status==="Pending"

&&


<button

onClick={()=>cancelOrder(order.id)}

>

❌ Cancel Order

</button>


}





</div>



))


}





</div>


);


}


export default MyOrders;