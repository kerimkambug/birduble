import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/profile.css";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [ingredientsData, setIngredientsData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = "https://mighty-island-53325-296dd28c851f.herokuapp.com";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Token bulunamadı. Lütfen giriş yapın.");
                    setLoading(false);
                    return;
                }

                const profileResponse = await axios.get(`${API_URL}/api/auth/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(profileResponse.data.data);

                const ingredientsResponse = await axios.get(`${API_URL}/api/ingredient/getallingredients`);
                setIngredientsData(ingredientsResponse.data.data);

                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || "Bir hata oluştu.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Profil verisi bulunamadı.</div>;
    }

    const categorizeIngredients = (userIngredients) => {
        const categorized = {
            alkol: [],
            soft: [],
            sebze: [],
            meyve: [],
            sos: [],
            şurup: [],
            baharat: [],
            diğer: [],
        };

        userIngredients.forEach((ingredient) => {
            const ingredientCategory = ingredientsData.find((item) => item.name === ingredient);
            const category = ingredientCategory ? ingredientCategory.category : "diğer";
            categorized[category].push(ingredient);
        });

        return categorized;
    };

    const categorizedIngredients = categorizeIngredients(user.ingredients);

    return (
        <div className="profile-container">
            <h2>Profil</h2>
            <div className="profile-info">
                <p><strong>Adı:</strong> {user?.name || "Ad bilgisi yok"}</p>
                <p><strong>Kullanıcı Adı:</strong> {user?.username || "Kullanıcı adı yok"}</p>
                <p><strong>Email:</strong> {user?.email || "Email bilgisi yok"}</p>
                <p><strong>Rol:</strong> {user?.role || "Rol bilgisi yok"}</p>

                <p><strong>Malzemeler:</strong></p>
                {Object.keys(categorizedIngredients).map((category) =>
                    categorizedIngredients[category].length > 0 ? (
                        <div key={category} className="ingredient-category">
                            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                            <ul className="ingredient-list">
                                {categorizedIngredients[category].map((ingredient, index) => (
                                    <li key={index} className="ingredient-item">
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
