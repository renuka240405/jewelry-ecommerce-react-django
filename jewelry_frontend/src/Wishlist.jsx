import { useEffect, useState } from "react";

function Wishlist() {

    const [wishlist, setWishlist] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {

        fetch("http://127.0.0.1:8000/api/products/wishlist/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setWishlist(data);
        });

    }, []);

    const removeWishlist = (id) => {

        fetch(`http://127.0.0.1:8000/api/products/wishlist/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            setWishlist(
                wishlist.filter(item => item.product.id !== id)
            );
        });

    };

    return (

        <div>

            <h1>❤️ Wishlist</h1>

            {
                wishlist.map(item => (

                    <div
                        key={item.id}
                        className="cart-item"
                    >

                        <img
                            src={item.product.image}
                            width="150"
                            alt={item.product.name}
                        />

                        <h3>{item.product.name}</h3>

                        <p>₹{item.product.price}</p>

                        <button
                            onClick={() =>
                                removeWishlist(item.product.id)
                            }
                        >
                            Remove
                        </button>

                    </div>

                ))
            }

        </div>

    );

}

export default Wishlist;