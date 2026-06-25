import {useEffect,useState} from "react";


function AdminDashboard(){


const token = localStorage.getItem("token");



const [products,setProducts] = useState([]);

const [orders,setOrders] = useState([]);




// LOAD PRODUCTS

const loadProducts = ()=>{


fetch(

"http://127.0.0.1:8000/api/products/products/",

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
"ADMIN PRODUCTS:",
data
);


setProducts(data);


});


};






// LOAD ORDERS

const loadOrders = ()=>{


fetch(

"http://127.0.0.1:8000/api/orders/allorders/",

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

"ADMIN ORDERS:",

data

);


setOrders(data);


});


};






useEffect(()=>{


loadProducts();

loadOrders();


},[]);








// UPDATE STATUS

const updateStatus=(id,status)=>{


fetch(


`http://127.0.0.1:8000/api/orders/update-status/${id}/`,


{


method:"POST",


headers:{


"Content-Type":"application/json",


Authorization:

`Bearer ${token}`


},


body:JSON.stringify({


status:status


})


}


)



.then(res=>res.json())


.then(data=>{


console.log(

"STATUS UPDATED:",

data

);



loadOrders();


});



};








return(


<div>



<h1>

Admin Dashboard 💎

</h1>







<h2>

Products

</h2>






{


products.map(product=>(


<div

className="cart-item"

key={product.id}

>


<h3>

{product.name}

</h3>


<p>

₹{product.price}

</p>



</div>


))


}







<hr/>








<h2>

Customer Orders 📦

</h2>







{


orders.map(order=>(



<div

className="cart-item"

key={order.id}

>



<h3>

Order #{order.id}

</h3>






<p>

👤 Customer:

{order.customer}

</p>






<h4>

Products:

</h4>






{


order.products && order.products.length > 0

?


order.products.map(product=>(



<div

key={product.id}

>


<p>

💎 {product.name}

</p>


<p>

₹{product.price}

</p>



</div>


))


:



<p>

No Products

</p>



}








<p>

Status:

<b>

{order.status}

</b>

</p>








<select


value={order.status}



onChange={

e=>

updateStatus(

order.id,

e.target.value

)

}


>


<option value="Pending">

Pending

</option>


<option value="Confirmed">

Confirmed

</option>


<option value="Shipped">

Shipped

</option>


<option value="Delivered">

Delivered

</option>


<option value="Cancelled">

Cancelled

</option>



</select>






</div>



))


}






</div>


);


}



export default AdminDashboard;