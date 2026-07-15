import {useState} from "react";
import {useNavigate} from "react-router-dom";


function Register(){


const navigate = useNavigate();



const [username,setUsername]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [error,setError]=useState("");





const register=()=>{


if(!username || !email || !password){


setError(

"All fields required ❌"

);


return;


}




fetch(

"https://jewelry-ecommerce-react-django-5.onrender.com/api/users/register/",

{


method:"POST",


headers:{


"Content-Type":"application/json"

},


body:JSON.stringify({


username,

email,

password


})


}

)


.then(res=>res.json())


.then(data=>{


console.log(

"REGISTER",

data

);



if(data.username || data.email){


setError(

"Username or Email already exists ❌"

);


}


else{


alert(

"Account Created 🎉"

);


navigate("/login");


}



});


};






return(


<div className="auth-box">


<h1>

Create Account 💎

</h1>




<input

placeholder="Username"

onChange={e=>

setUsername(e.target.value)

}

/>





<input

placeholder="Email"

onChange={e=>

setEmail(e.target.value)

}

/>





<input

type="password"

placeholder="Password"

onChange={e=>

setPassword(e.target.value)

}

/>





{

error &&

<p className="error">

{error}

</p>

}





<button

onClick={register}

>

Register

</button>



</div>


);


}


export default Register;