import { useEffect, useState } from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import ProductDetails from "./ProductDetails";
import Checkout from "./Checkout";
import AdminDashboard from "./AdminDashboard";
import Navbar from "./Navbar";
import ProtectedAdmin from "./ProtectedAdmin";
import Orders from "./Orders";
function ShopHome(){

const navigate = useNavigate();


const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const [token,setToken] = useState(
localStorage.getItem("token")
);


const [products,setProducts] = useState([]);

const [cart,setCart] = useState(()=>{

return JSON.parse(
localStorage.getItem("cart")
) || [];

});


const [orders,setOrders] = useState([]);

const [search,setSearch] = useState("");





// LOGIN

const login = ()=>{


fetch(

"http://127.0.0.1:8000/api/users/login/",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

username,
password

})

}

)

.then(res=>res.json())

.then(data=>{


console.log("LOGIN:",data);


if(data.access){


localStorage.setItem(
"token",
data.access
);


setToken(data.access);


}


});


};






// GET PRODUCTS


useEffect(()=>{


if(!token)
return;



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
"PRODUCT DATA:",
data
);



if(Array.isArray(data)){


setProducts(data);


}
else{


setProducts([]);


}



});


},[token]);







// ADD CART


const addToCart=(item)=>{


let updated=[...cart];


let exist = updated.find(
x=>x.id===item.id
);



if(exist){


exist.quantity += 1;


}

else{

updated.push({

...item,

price:Number(item.price),

quantity:1

});

}



setCart(updated);


localStorage.setItem(

"cart",

JSON.stringify(updated)

);


};







// REMOVE CART


const removeFromCart=(id)=>{


let updated = cart.filter(

x=>x.id!==id

);


setCart(updated);


localStorage.setItem(

"cart",

JSON.stringify(updated)

);


};






// QUANTITY


const increaseQty=(id)=>{


let updated = cart.map(item=>


item.id===id

?

{

...item,

quantity:item.quantity+1

}

:

item


);


setCart(updated);


localStorage.setItem(
"cart",
JSON.stringify(updated)
);


};





const decreaseQty=(id)=>{


let updated = cart.map(item=>


item.id===id && item.quantity>1

?

{

...item,

quantity:item.quantity-1

}

:

item


);


setCart(updated);


localStorage.setItem(
"cart",
JSON.stringify(updated)
);


};







// ORDERS


const getMyOrders=()=>{


fetch(

"http://127.0.0.1:8000/api/orders/myorders/",

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
"MY ORDERS:",
data
);


setOrders(data);


});


};







// CANCEL


const cancelOrder=(id)=>{


fetch(

`http://127.0.0.1:8000/api/orders/cancel/${id}/`,

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
"CANCEL:",
data
);


getMyOrders();


});


};







const filteredProducts = products.filter(item=>


item.name
.toLowerCase()
.includes(
search.toLowerCase()
)


);








return(


<div className="App">


<Navbar/>


{


!token

?


<>


<h1>
Login 💎
</h1>


<input

placeholder="username"

onChange={
e=>setUsername(e.target.value)
}

/>


<input

type="password"

placeholder="password"

onChange={
e=>setPassword(e.target.value)
}

/>



<button onClick={login}>
Login
</button>


</>



:


<>



<h1>
Jewelry Shop 💎
</h1>





<button

onClick={()=>{

localStorage.removeItem("token");

setToken(null);

}}

>

Logout

</button>






<h2>
Cart 🛒 {cart.length}
</h2>




<h3>

Total ₹

{

cart.reduce(

(a,b)=>

a+(b.price*b.quantity),

0

)

}

</h3>





<button

onClick={()=>navigate("/checkout")}

>

Checkout

</button>





<button

onClick={getMyOrders}

>

My Orders 📦

</button>







<h2>
My Orders 📦
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

{order.customer || order.user}

</p>




<h4>

Products:

</h4>



{

order.products?.map(product=>(


<p key={product.id}>


💎 {product.name}

<br/>

₹{product.price}


</p>


))


}





<p>

Status:

<span>

{order.status}

</span>


</p>





<div>


{

order.status==="Pending"

&&

"🟡 Waiting for confirmation"

}




{

order.status==="Confirmed"

&&

"🔵 Order confirmed"

}




{

order.status==="Shipped"

&&

"🚚 Product shipped"

}




{

order.status==="Delivered"

&&

"🟢 Delivered"

}




{

order.status==="Cancelled"

&&

"🔴 Cancelled"

}



</div>






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
Customer: {order.user}
</p>


<p>
Status: {order.status}
</p>



{

order.products?.map(product=>(


<p key={product.id}>

💎 {product.name}

<br/>

₹{product.price}

</p>


))

}





{

order.status==="Pending"

&&

<button

onClick={()=>cancelOrder(order.id)}

>

Cancel

</button>


}



</div>


))


}







<h2>
Cart Items
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
Qty: {item.quantity}
</p>



<button onClick={()=>increaseQty(item.id)}>
+
</button>


<button onClick={()=>decreaseQty(item.id)}>
-
</button>


<button onClick={()=>removeFromCart(item.id)}>
Remove
</button>



</div>


))


}








<h2>
Search 🔍
</h2>


<input

placeholder="search jewelry"

onChange={
e=>setSearch(e.target.value)
}

/>







<h2>
Products
</h2>




{

filteredProducts.map(item=>(


<div

className="card"

key={item.id}

>



{

item.image &&




<img

src={
item.image
?
`http://127.0.0.1:8000${item.image}`
:
""
}

alt={item.name}

width="200"

/>

}



<h2>
{item.name}
</h2>


<p>
{item.description}
</p>


<h3>
₹{item.price}
</h3>


<p>
Discount: {item.discount}%
</p>


<p>
Rating ⭐ {item.rating}
</p>




<button

onClick={()=>navigate(

"/product",

{

state:item

}

)}

>

View Details

</button>





<button

onClick={()=>addToCart(item)}

>

Add Cart 🛒

</button>




</div>


))


}



</>

}



</div>


);


}









function App(){


return(


<BrowserRouter>


<Routes>

<Route
path="/"
element={<ShopHome/>}
/>


<Route
path="/checkout"
element={<Checkout/>}
/>


<Route
path="/product"
element={<ProductDetails/>}
/>


<Route

path="/admin"

element={

<ProtectedAdmin>

<AdminDashboard/>

</ProtectedAdmin>

}

/>


<Route
path="*"
element={<ShopHome/>}
/>


</Routes>


</BrowserRouter>


);


}



export default App;