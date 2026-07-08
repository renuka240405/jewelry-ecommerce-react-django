import { useEffect, useState } from "react";

function AdminDashboard() {

  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [editProduct, setEditProduct] = useState(null);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    o => o.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    o => o.status === "Delivered"
  ).length;


  const getJSON = (res) => {
    return res.text().then(text => {
      try {
        return JSON.parse(text);
      } catch {
        return {};
      }
    });
  };


  const loadProducts = () => {

    fetch(
      "http://127.0.0.1:8000/api/products/products/",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

      .then(getJSON)

      .then(data => {

        setProducts(
          Array.isArray(data) ? data : []
        );

      });

  };


  const loadOrders = () => {

    fetch(
      "http://127.0.0.1:8000/api/orders/allorders/",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

      .then(getJSON)

      .then(data => {

        setOrders(
          Array.isArray(data) ? data : []
        );

      });

  };


  useEffect(() => {

    loadProducts();

    loadOrders();

  }, []);


  const addProduct = () => {

    if (!name || !price || !description) {

      alert("Fill all fields");

      return;

    }

    let form = new FormData();

    form.append("name", name);
    form.append("description", description);
    form.append("price", price);

    if (image) {
      form.append("image", image);
    }

    fetch(

      "http://127.0.0.1:8000/api/products/products/",

      {

        method: "POST",

        headers: {

          Authorization: `Bearer ${token}`

        },

        body: form

      }

    )

      .then(getJSON)

      .then(data => {

        alert("Product Added");

        setName("");
        setPrice("");
        setDescription("");
        setImage(null);

        loadProducts();

      });

  };


  const deleteProduct = (id) => {

    if (!window.confirm("Delete Product?")) return;

    fetch(

      `http://127.0.0.1:8000/api/products/delete/${id}/`,

      {

        method: "DELETE",

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    )

      .then(getJSON)

      .then(() => {

        loadProducts();

      });

  };


  const updateProduct = (id) => {

    let form = new FormData();

    form.append("name", editProduct.name);
    form.append("price", editProduct.price);
    form.append("description", editProduct.description);

    if (editProduct.newImage) {

      form.append(
        "image",
        editProduct.newImage
      );

    }

    fetch(

      `http://127.0.0.1:8000/api/products/products/${id}/`,

      {

        method: "PATCH",

        headers: {

          Authorization: `Bearer ${token}`

        },

        body: form

      }

    )

      .then(getJSON)

      .then(() => {

        alert("Updated");

        setEditProduct(null);

        loadProducts();

      });

  };
  
  console.log("editProduct state:", editProduct);

  const updateStatus = (id, status) => {

    fetch(

      `http://127.0.0.1:8000/api/orders/update-status/${id}/`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`

        },

        body: JSON.stringify({

          status

        })

      }

    )

      .then(getJSON)

      .then(() => {

        loadOrders();

      });

  };
  return (

<div className="admin-container">

<h1>Admin Dashboard 💎</h1>

<div className="admin-stats">

<div className="stat-card">
<h3>💎 Products</h3>
<h1>{totalProducts}</h1>
</div>

<div className="stat-card">
<h3>📦 Orders</h3>
<h1>{totalOrders}</h1>
</div>

<div className="stat-card">
<h3>⏳ Pending</h3>
<h1>{pendingOrders}</h1>
</div>

<div className="stat-card">
<h3>✅ Delivered</h3>
<h1>{deliveredOrders}</h1>
</div>

</div>

<hr />

<h2>Add Product</h2>

<input
placeholder="Product Name"
value={name}
onChange={e=>setName(e.target.value)}
/>

<input
placeholder="Price"
value={price}
onChange={e=>setPrice(e.target.value)}
/>

<input
placeholder="Description"
value={description}
onChange={e=>setDescription(e.target.value)}
/>

<input
type="file"
accept="image/*"
onChange={e=>setImage(e.target.files[0])}
/>

{
image &&
<img
src={URL.createObjectURL(image)}
width="150"
/>
}

<br/>

<button onClick={addProduct}>
Add Product
</button>

<hr/>

<h2>Products 💎</h2>

<input
placeholder="Search Product"
value={search}
onChange={e=>setSearch(e.target.value)}
/>

<select
value={category}
onChange={e=>setCategory(e.target.value)}
>

<option value="">All</option>
<option value="ring">Ring</option>
<option value="necklace">Necklace</option>
<option value="diamond">Diamond</option>

</select>

{

products

.filter(product=>

product.name

.toLowerCase()

.includes(

search.toLowerCase()

)

&&

(

category===""

||

product.category===category

)

)

.map(product=>(

<div

key={product.id}

className="cart-item"

>

<img

src={
product.image
?
(
product.image.startsWith("http")
?
product.image
:
`http://127.0.0.1:8000${product.image}`
)
:
"/no-image.png"
}

width="120"

alt={product.name}

/>

<h3>{product.name}</h3>

<p>₹{product.price}</p>

<p>{product.description}</p>

<button
onClick={() => {
    console.log("EDIT CLICKED", product);
    setEditProduct(product);
}}
>
✏️ Edit
</button>

<button
onClick={()=>deleteProduct(product.id)}
>
🗑 Delete
</button>

</div>

))

}

<h1 style={{color:"red"}}>
Current Edit Product:
{editProduct ? editProduct.name : "NONE"}
</h1>


{

editProduct &&

<div
style={{
    background:"white",
    border:"3px solid red",
    padding:"20px",
    margin:"20px 0"
}}
>

<h2>Edit Product</h2>

<input

value={editProduct.name}

onChange={e=>

setEditProduct({

...editProduct,

name:e.target.value

})

}

/>

<input

value={editProduct.price}

onChange={e=>

setEditProduct({

...editProduct,

price:e.target.value

})

}

/>

<input

value={editProduct.description}

onChange={e=>

setEditProduct({

...editProduct,

description:e.target.value

})

}

/>

<input

type="file"

accept="image/*"

onChange={e=>

setEditProduct({

...editProduct,

newImage:e.target.files[0]

})

}

/>

<button

onClick={()=>updateProduct(editProduct.id)}

>

Save Changes

</button>

</div>

}

<hr/>

<h2>Orders 📦</h2>
{

orders.map(order=>(

<div

key={order.id}

className="cart-item"

>

<h3>

Order #{order.id}

</h3>

<p>

Customer:

<b>

{order.customer || "Unknown"}

</b>

</p>

<p>
Payment :
{order.payment_method}
</p>

<p>
Payment Status :
{order.payment_status}
</p>

<p>

Status:

<span>

{order.status}

</span>

</p>

{

order.products &&

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

}

<select

value={order.status}

onChange={e=>

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