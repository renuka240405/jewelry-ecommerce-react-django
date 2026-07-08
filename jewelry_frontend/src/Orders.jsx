import {useEffect,useState} from "react";
import "./Orders.css";


function Orders(){


const [orders,setOrders]=useState([]);



const getOrders=()=>{


const token =
localStorage.getItem("token");



fetch(

"https://jewelry-ecommerce-react-django.onrender.com/api/orders/myorders/",

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
"ORDERS:",
data
);


setOrders(data);


});


};



useEffect(()=>{


getOrders();


},[]);






const cancelOrder=(id)=>{


const token =
localStorage.getItem("token");



fetch(

`https://jewelry-ecommerce-react-django.onrender.com/api/orders/cancel/${id}/`,

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


console.log(
data
);


getOrders();


});


};





return(


<div className="orders">


<h1>
My Orders 📦
</h1>



{

orders.map(order=>(


<div

className="order-card"

key={order.id}

>


<h2>

Order #{order.id}

</h2>



<p>

Status :

<span>

{order.status}

</span>

</p>




<h3>
Products
</h3>



{

order.products?.map(product=>(


<div

key={product.id}

>


<p>

💎 {product.name}

</p>


<p>

₹ {product.price}

</p>


</div>


))

}



{


order.status==="Pending"

&&


<button

onClick={()=>cancelOrder(order.id)}

>

Cancel Order

</button>


}



</div>


))


}



</div>


);


}



export default Orders;