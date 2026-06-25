import {Link,useNavigate} from "react-router-dom";
import "./Navbar.css";


function Navbar(){


const navigate = useNavigate();


const logout=()=>{


localStorage.removeItem("token");


navigate("/");


window.location.reload();


};




return(

<nav className="navbar">


<h2>
💎 Jewelry Shop
</h2>



<div className="nav-links">


<Link to="/">
Home
</Link>



<Link to="/admin">
Admin
</Link>



<Link to="/checkout">
Cart 🛒
</Link>



<button

onClick={logout}

>

Logout

</button>



</div>


</nav>


);


}


export default Navbar;