import {useLocation,useNavigate} from "react-router-dom";
import "./ProductDetails.css";


function ProductDetails(){

const location = useLocation();

const navigate = useNavigate();


const product = location.state;



if(!product){

return(

<div>

<h2>
No Product Selected
</h2>

<button onClick={()=>navigate("/")}>
Back Shop
</button>

</div>

)

}




const addCart=()=>{


let cart = JSON.parse(
localStorage.getItem("cart")
)||[];


let exist = cart.find(
item=>item.id===product.id
);



if(exist){


exist.quantity +=1;


}

else{


cart.push({

...product,

quantity:1

});


}



localStorage.setItem(

"cart",

JSON.stringify(cart)

);



alert("Added to Cart 🛒");


};




return(

<div className="product-details">


{

product.image &&

<img

src={product.image}

alt={product.name}

className="detail-image"

/>

}



<h1>

{product.name}

</h1>



<p>

{product.description}

</p>



<h2>

₹{product.price}

</h2>



<p>

Discount : {product.discount}%

</p>



<p>

Rating ⭐ {product.rating}

</p>




<button

onClick={addCart}

>

Add To Cart 🛒

</button>




<button

onClick={()=>navigate("/")}

>

Back

</button>



</div>


)


}


export default ProductDetails;