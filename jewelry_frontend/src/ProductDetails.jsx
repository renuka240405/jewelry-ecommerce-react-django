import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [qty, setQty] = useState(1);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    // Load selected product
    useEffect(() => {

        fetch(`https://jewelry-ecommerce-react-django-5.onrender.com/api/products/products/${id}/`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
            });

    }, [id]);

    // Load all products
    useEffect(() => {

        fetch("https://jewelry-ecommerce-react-django-5.onrender.com/api/products/products/")
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
            });

    }, []);

    // Load reviews
    useEffect(() => {

        fetch(`https://jewelry-ecommerce-react-django-5.onrender.com/api/products/review/${id}/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setReviews(Array.isArray(data) ? data : []);
            });

    }, [id]);

    if (!product) {
        return <h2>Loading...</h2>;
    }

    const total = product.price * qty;

    const addCart = () => {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const exist = cart.find(x => x.id === product.id);

        if (exist) {

            exist.quantity += qty;

        } else {

            cart.push({
                ...product,
                quantity: qty
            });

        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Added to Cart");
    };

    const buyNow = () => {

        localStorage.setItem(
            "cart",
            JSON.stringify([
                {
                    ...product,
                    quantity: qty
                }
            ])
        );

        navigate("/checkout");
    };

    const submitReview = () => {

        fetch("https://jewelry-ecommerce-react-django-5.onrender.com/api/products/review/", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${localStorage.getItem("token")}`

            },

            body: JSON.stringify({

                product: product.id,

                rating: Number(rating),

                comment

            })

        })

            .then(res => res.json())

            .then(() => {

                alert("Review Added");

                window.location.reload();

            });

    };

    return (

        <div className="product-details">

            <button onClick={() => navigate("/")}>
                ⬅ Back
            </button>

            {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className="details-image"
                />
            )}

            <h1>{product.name}</h1>

            <h2>₹{product.price}</h2>

            <p>{product.description}</p>

            <p>⭐ {product.rating}</p>

            <hr />

            <button onClick={() => qty > 1 && setQty(qty - 1)}>
                -
            </button>

            <span style={{ margin: "0 10px" }}>{qty}</span>

            <button onClick={() => setQty(qty + 1)}>
                +
            </button>

            <h2>Total ₹{total}</h2>

            <button onClick={addCart}>
                Add Cart
            </button>

            <button onClick={buyNow}>
                Buy Now
            </button>

            <hr />

            <h2>Reviews</h2>

            <input

                type="number"

                value={rating}

                min="1"

                max="5"

                onChange={(e) => setRating(e.target.value)}

            />

            <br /><br />

            <textarea

                value={comment}

                onChange={(e) => setComment(e.target.value)}

            />

            <br /><br />

            <button onClick={submitReview}>
                Submit Review
            </button>

            <hr />

            {reviews.map(r => (

                <div key={r.id}>

                    ⭐ {r.rating}

                    <br />

                    {r.comment}

                    <hr />

                </div>

            ))}

            <h2>Related Products</h2>

            <div className="product-grid">

                {products

                    .filter(p =>

                        p.id !== product.id &&

                        p.category === product.category

                    )

                    .map(item => (

                        <div key={item.id} className="shop-card">

                            {item.image && (

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="admin-image"
                                />

                            )}

                            <h3>{item.name}</h3>

                            <p>₹{item.price}</p>

                            <button

                                onClick={() => navigate(`/product/${item.id}`)}

                            >

                                View

                            </button>

                        </div>

                    ))}

            </div>

        </div>

    );

}

export default ProductDetails;