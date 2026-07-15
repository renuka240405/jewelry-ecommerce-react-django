import {useState} from "react";
import {useNavigate} from "react-router-dom";


function Login(){


const navigate = useNavigate();


const [username,setUsername]=useState("");

const [password,setPassword]=useState("");

const [error,setError]=useState("");




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


.then(data=>{


console.log(

"LOGIN",

data

);



if(data.access){



localStorage.setItem(

"token",

data.access

);



alert(

"Login Successful 🎉"

);



navigate("/");



}

else{


setError(

"Invalid Username or Password ❌"

);


}



});


};






return(


<div className="auth-box">


<h1>

Login 💎

</h1>




<input

placeholder="Username"

onChange={e=>

setUsername(e.target.value)

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

onClick={login}

>

Login

</button>




</div>


);


}


export default Login;