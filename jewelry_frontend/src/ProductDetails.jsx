import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetails() {

  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state;

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!product) {
    return <h2>Product Not Found</h2>;
  }

  // -----------------------------
  // Load Related Products
  // -----------------------------
  useEffect(() => {

    fetch(
      "http://127.0.0.1:8000/api/products/products/",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
      .then(res => res.json())
      .then(data => {

        setProducts(Array.isArray(data) ? data : []);

      });

  }, []);

  // -----------------------------
  // Load Reviews
  // -----------------------------
  useEffect(() => {

    fetch(
      `http://127.0.0.1:8000/api/products/review/${product.id}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
      .then(res => res.json())
      .then(data => {

        setReviews(Array.isArray(data) ? data : []);

      });

  }, [product.id]);

  // -----------------------------
  // Add To Cart
  // -----------------------------
  const addCart = () => {

    let cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    let exist = cart.find(x => x.id === product.id);

    if (exist) {

      exist.quantity += qty;

    } else {

      cart.push({

        ...product,

        quantity: qty

      });

    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert("Added to Cart 🛒");
  };

  // -----------------------------
  // Buy Now
  // -----------------------------
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

  // -----------------------------
  // Submit Review
  // -----------------------------
  const submitReview = () => {

    fetch(
      "http://127.0.0.1:8000/api/products/review/",
      {
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
      }
    )

      .then(res => res.json())

      .then(() => {

        alert("Review Added ⭐");

        return fetch(
          `http://127.0.0.1:8000/api/products/review/${product.id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

      })

      .then(res => res.json())

      .then(data => {

        setReviews(Array.isArray(data) ? data : []);

        setComment("");

        setRating(5);

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
          className="details-image"
          alt={product.name}
        />
      )}

      <h1>{product.name}</h1>

      <h2>₹{product.price}</h2>

      <p>{product.description}</p>

      <p>⭐ Rating {product.rating}</p>

      <hr />

      <h2>Quantity</h2>

      <button
        onClick={() => {
          if (qty > 1) setQty(qty - 1);
        }}
      >
        -
      </button>

      <span style={{ margin: "0 10px" }}>
        {qty}
      </span>

      <button
        onClick={() => setQty(qty + 1)}
      >
        +
      </button>

      <h2>Total ₹{product.price * qty}</h2>

      <button
        onClick={addCart}
      >
        🛒 Add Cart
      </button>

      <button
        onClick={buyNow}
      >
        ⚡ Buy Now
      </button>

      <hr />

      <h2>⭐ Reviews</h2>

      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Write review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <br /><br />

      <button
        onClick={submitReview}
      >
        Submit Review
      </button>

      <br /><br />

      {Array.isArray(reviews) && reviews.length > 0 ? (

        reviews.map(review => (

          <div
            key={review.id}
            className="review-card"
          >

            <h3>⭐ {review.rating}</h3>

            <p>{review.comment}</p>

            <hr />

          </div>

        ))

      ) : (

        <p>No Reviews Yet.</p>

      )}

      <hr />

      <h2>Related Jewelry 💎</h2>

      <div className="product-grid">

        {products
          .filter(item =>
            item.id !== product.id &&
            item.category === product.category
          )

          .map(item => (

            <div
              className="shop-card"
              key={item.id}
            >

              {item.image && (

                <img
                  src={item.image}
                  className="admin-image"
                  alt={item.name}
                />

              )}

              <h3>{item.name}</h3>

              <p>₹{item.price}</p>

              <button

                onClick={() =>
                  navigate("/product", {
                    state: item
                  })
                }

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