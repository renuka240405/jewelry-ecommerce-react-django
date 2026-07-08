import {useNavigate} from "react-router-dom";


function OrderSuccess(){


const navigate = useNavigate();



return(


<div className="success-page">



<h1>

🎉 Order Placed Successfully

</h1>




<h2>

Thank you for shopping with Jewelry Shop 💎

</h2>




<p>

Your order has been received.

</p>




<button

onClick={()=>navigate("/")}

>

Continue Shopping 🛒

</button>






<button

onClick={()=>navigate("/orders")}

>

View Orders 📦

</button>




</div>


);


}



export default OrderSuccess;