import {useEffect,useState} from "react";
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
import Wishlist from "./Wishlist";
import MyOrders from "./MyOrders";
import Register from "./Register";
import Profile from "./Profile";
import OrderSuccess from "./OrderSuccess";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";



function ShopHome(){


const navigate=useNavigate();



const [username,setUsername]=useState("");
const [password,setPassword]=useState("");



const [token,setToken]=useState(
localStorage.getItem("token")
);

useEffect(() => {

    const refresh = localStorage.getItem("refresh");

    if (!refresh) return;

    fetch("https://jewelry-ecommerce-react-django-5.onrender.com/api/users/token/refresh/", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            refresh: refresh
        })

    })

    .then(res => res.json())

    .then(data => {

        if (data.access) {

            localStorage.setItem("token", data.access);

            setToken(data.access);

        }

    });

}, []);


const [products,setProducts]=useState([]);
const [categories,setCategories]=useState([]);

const [search,setSearch]=useState("");
const [selectedCategory,setSelectedCategory]=useState("");
const [minPrice,setMinPrice]=useState("");

const [maxPrice,setMaxPrice]=useState("");

const [metal,setMetal]=useState("");

const [sort,setSort]=useState("");



const [cart,setCart]=useState(()=>{

return JSON.parse(
localStorage.getItem("cart")
)||[];

});



const [wishlist,setWishlist]=useState(()=>{

return JSON.parse(
localStorage.getItem("wishlist")
)||[];

});





// LOGIN


const login=()=>{


fetch(

"https://jewelry-ecommerce-react-django-5.onrender.com/api/users/login/",

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

.then(data => {

    if (data.access) {

        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);

        setToken(data.access);

        window.location.reload();

    } else {
        alert("Invalid username or password");
    }

});

};







// PRODUCTS LOAD


useEffect(()=>{


if(!token)
return;



let url=
"https://jewelry-ecommerce-react-django-5.onrender.com/api/products/products/";


let params=new URLSearchParams();



if(minPrice)
params.append(
"min_price",
minPrice
);



if(maxPrice)
params.append(
"max_price",
maxPrice
);



if(metal)
params.append(
"metal",
metal
);



if(sort)
params.append(
"sort",
sort
);




if(params.toString()){

url += "?"+params.toString();

}





fetch(

url,

{

headers:{

Authorization:

`Bearer ${token}`

}

}

)


.then(res=>res.json())

.then(data=>{


setProducts(data);


});



},[
token,
minPrice,
maxPrice,
metal,
sort
]);

useEffect(()=>{


fetch(

"https://jewelry-ecommerce-react-django-5.onrender.com/api/products/categories/",

{

headers:{

Authorization:

`Bearer ${token}`

}

}

)


.then(res=>res.json())

.then(data=>{


setCategories(data);


});


},[token]);


useEffect(() => {

  if (!token) return;

  fetch(
    "https://jewelry-ecommerce-react-django-5.onrender.com/api/products/wishlist/",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(res => res.json())
    .then(data => {

      setWishlist(data);

    });

}, [token]);




// CART


const addToCart=(item)=>{


let updated=[...cart];


let exist=updated.find(
x=>x.id===item.id
);



if(exist){

exist.quantity++;

}

else{


updated.push({

...item,

quantity:1

});


}



setCart(updated);


localStorage.setItem(

"cart",

JSON.stringify(updated)

);

window.dispatchEvent(
new Event("storage")
);

};






const increaseQty=(id)=>{


let updated=cart.map(item=>

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


let updated=cart.map(item=>

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






const removeCart=(id)=>{


let updated=cart.filter(

x=>x.id!==id

);


setCart(updated);


localStorage.setItem(

"cart",

JSON.stringify(updated)

);



};








// WISHLIST

const addWishlist = (item) => {

    fetch(
        "https://jewelry-ecommerce-react-django-5.onrender.com/api/products/wishlist/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                product: item.id
            })
        }
    )
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    });

};






const filteredProducts = products.filter(item=>{


const searchMatch =


item.name

.toLowerCase()

.includes(

search.toLowerCase()

);



const categoryMatch =


selectedCategory


?


item.category === selectedCategory


:


true;



return searchMatch && categoryMatch;



});






return(


<div>


<Navbar/>




{

!token ?



<>


<h1>
Login 💎
</h1>


<input

placeholder="username"

onChange={e=>
setUsername(e.target.value)
}

/>


<input

type="password"

placeholder="password"

onChange={e=>
setPassword(e.target.value)
}

/>



<button onClick={login}>

Login

</button>


<button

onClick={()=>navigate("/register")}

>

Create Account

</button>

</>



:



<>



<h1>
Jewelry Shop 💎
</h1>

<div className="hero">


<h1>
Premium Jewelry Collection 💎
</h1>


<p>
Elegant designs for every occasion ✨
</p>



<button

onClick={()=>{

document
.getElementById("collection")
.scrollIntoView();

}}

>

Shop Now

</button>


</div>



<h2>🛒 Cart ({cart.length})</h2>

<div className="top-buttons">

  <button onClick={() => navigate("/checkout")}>
    Checkout
  </button>

  <button onClick={() => navigate("/wishlist")}>
    ❤️ Wishlist ({wishlist.length})
  </button>

  <button onClick={() => navigate("/orders")}>
    📦 My Orders
  </button>

  <button onClick={() => navigate("/profile")}>
    👤 Profile
  </button>

</div>





<h2>
Search 🔍
</h2>


<input

className="search-box"

placeholder="🔍 Search jewelry..."

value={search}

onChange={e=>

setSearch(e.target.value)



}

/>


<select

value={selectedCategory}

onChange={e=>

setSelectedCategory(e.target.value)

}

>


<option value="">

All Category

</option>


<option value="ring">

Ring

</option>



<option value="necklace">

Necklace

</option>



<option value="diamond">

Diamond

</option>



</select>



<h2>
Categories 💎
</h2>

<div className="categories">

<button
onClick={() => setSelectedCategory("")}
>
All
</button>

{
categories.map(cat => (

<button
key={cat.id}
onClick={() => setSelectedCategory(cat.name)}
>

{cat.name}

</button>

))
}

</div>




<h2>
Filters 🔍
</h2>



<input
    type="number"
    placeholder="Min Price"
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
/>

<input
    type="number"
    placeholder="Max Price"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
/>



<select

onChange={e=>
setMetal(e.target.value)
}

>


<option value="">
All Metal
</option>


<option value="Gold">
Gold
</option>


<option value="Silver">
Silver
</option>


<option value="Diamond">
Diamond
</option>



</select>






<select

onChange={e=>
setSort(e.target.value)
}

>


<option value="">
Sort
</option>


<option value="price_low">
Price Low
</option>


<option value="price_high">
Price High
</option>


<option value="latest">
Latest
</option>


</select>







<h2 id="collection">

Jewelry Collection 💎

</h2>




<div className="shop-grid">



{

filteredProducts.map(item=>(



<div

className="shop-card"


key={item.id}

>

{

item.discount>0 &&

<span className="discount">

-{item.discount}% OFF

</span>

}

{

item.image &&

<img

src={item.image}

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

⭐ Rating {item.rating}

</p>




<button

onClick={() =>
    navigate(`/product/${item.id}`)
}

>

View Details

</button>





<button

className="cart-btn"

onClick={()=>addToCart(item)}

>

🛒 Add Cart

</button>





<button

className="wish-btn"

onClick={()=>addWishlist(item)}

>

❤️ Wishlist

</button>




</div>



))


}



</div>







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


₹{item.price}


<p>
Qty {item.quantity}
</p>



<button onClick={()=>increaseQty(item.id)}>
+
</button>


<button onClick={()=>decreaseQty(item.id)}>
-
</button>


<button onClick={()=>removeCart(item.id)}>
Remove
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

path="/register"

element={<Register/>}

/>

<Route
    path="/profile"
    element={<Profile />}
/>

<Route

path="/success"

element={<OrderSuccess/>}

/>

<Route

path="/"

element={<ShopHome/>}

/>


<Route

path="/login"

element={<Login/>}

/>



<Route

path="/checkout"

element={

<ProtectedRoute>

<Checkout/>

</ProtectedRoute>

}

/>



<Route path="/product/:id" element={<ProductDetails />} />



<Route

path="/wishlist"

element={<Wishlist/>}

/>




<Route

path="/orders"

element={

<ProtectedRoute>

<MyOrders/>

</ProtectedRoute>

}

/>


<Route

path="/admin"

element={

<ProtectedAdmin>

<AdminDashboard/>

</ProtectedAdmin>

}

/>



</Routes>



</BrowserRouter>


);



}



export default App;