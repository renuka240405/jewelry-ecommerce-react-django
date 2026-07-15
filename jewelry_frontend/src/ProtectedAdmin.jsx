import {Navigate} from "react-router-dom";
import {useEffect,useState} from "react";


function ProtectedAdmin({children}){


const [admin,setAdmin]=useState(null);


const token = localStorage.getItem("token");



useEffect(()=>{


fetch(

"https://jewelry-ecommerce-react-django-5.onrender.com/api/users/profile/",

{

headers:{


Authorization:

`Bearer ${token}`


}

}

)


.then(res=>res.json())


.then(data=>{


setAdmin(data.is_admin);


});


},[token]);





if(admin===null){


return <h2>Loading...</h2>


}




if(!token || !admin){


return <Navigate to="/"/>


}



return children;


}



export default ProtectedAdmin;