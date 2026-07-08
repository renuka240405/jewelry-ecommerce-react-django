import { useState, useEffect } from "react";

function Profile() {

    const [profile, setProfile] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: ""
    });

    useEffect(() => {

        fetch(
            "http://127.0.0.1:8000/api/users/profile/",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
        .then(res => res.json())
        .then(data => {
            setProfile(data);
        });

    }, []);

    const updateProfile = () => {

        fetch(
            "http://127.0.0.1:8000/api/users/profile/",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },

                body: JSON.stringify(profile)
            }
        )
        .then(res => res.json())
        .then(data => {
            alert(data.message);
        });

    };

    return (

        <div className="profile-page">

            <h1>👤 My Profile</h1>

            <input
                value={profile.username}
                disabled
            />

            <input
                placeholder="First Name"
                value={profile.first_name}
                onChange={e =>
                    setProfile({
                        ...profile,
                        first_name: e.target.value
                    })
                }
            />

            <input
                placeholder="Last Name"
                value={profile.last_name}
                onChange={e =>
                    setProfile({
                        ...profile,
                        last_name: e.target.value
                    })
                }
            />

            <input
                placeholder="Email"
                value={profile.email}
                onChange={e =>
                    setProfile({
                        ...profile,
                        email: e.target.value
                    })
                }
            />

            <button onClick={updateProfile}>
                Save Changes
            </button>

        </div>

    );

}

export default Profile;