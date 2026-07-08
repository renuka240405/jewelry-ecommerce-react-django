import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);

    const token = localStorage.getItem("token") || "";

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("cart");
        localStorage.removeItem("wishlist");

        navigate("/");

        window.location.reload();
    };

    useEffect(() => {

        if (!token) return;

        fetch("http://127.0.0.1:8000/api/users/profile/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

                return res.json();
            })
            .then((data) => {

                console.log("PROFILE:", data);

                setIsAdmin(data.is_admin);
            })
            .catch((err) => {
                console.log("Profile Error:", err);
            });

    }, [token]);

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    return (
        <nav>

            <h2>💎 Jewelry Shop</h2>

            <Link to="/">
                Home
            </Link>

            <Link to="/wishlist">
                ❤️ Wishlist ({wishlist.length})
            </Link>

            <Link to="/checkout">
                🛒 Cart ({cart.length})
            </Link>

            <Link to="/register">
                Create Account ✨
            </Link>

            <Link to="/orders">
                📦 My Orders
            </Link>

            {isAdmin && (
                <Link to="/admin">
                    ⚙️ Admin Dashboard
                </Link>
            )}

            <Link to="/profile">
                👤 Profile
            </Link>

            {token ? (
                <button onClick={logout}>
                    Logout 🚪
                </button>
            ) : (
                <button onClick={() => navigate("/login")}>
                    Login
                </button>
            )}

        </nav>
    );
}

export default Navbar;