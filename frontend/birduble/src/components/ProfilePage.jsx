import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/profile.css";

function ProfilePage() {
    const [user, setUser] = useState(null); // Kullanıcı bilgilerini saklayacağız
    const [ingredientsData, setIngredientsData] = useState([]); // Malzeme verisini saklayacağız
    const [error, setError] = useState(null); // Hata durumu
    const [loading, setLoading] = useState(true); // Yükleniyor durumu

    useEffect(() => {
        // API'ye Bearer token ile istek gönderiyoruz
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Token'ı localStorage'dan alıyoruz
                if (!token) {
                    setError("Token bulunamadı. Lütfen giriş yapın.");
                    setLoading(false);
                    return;
                }

                // Kullanıcı profilini alıyoruz
                const profileResponse = await axios.get("http://localhost:8080/api/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(profileResponse.data.data); // Profil verisini state'e alıyoruz

                // Malzeme kategorileri verisini alıyoruz
                const ingredientsResponse = await axios.get("http://localhost:8080/api/ingredient/getallingredients");
                setIngredientsData(ingredientsResponse.data.data); // Tüm malzemelerin kategorilerini saklıyoruz

                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || "Bir hata oluştu.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Yükleniyor durumu kontrolü
    if (loading) {
        return <div>Loading...</div>;
    }

    // Hata durumu kontrolü
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Kullanıcı verisi kontrolü
    if (!user) {
        return <div>Profil verisi bulunamadı.</div>;
    }

    // Malzemeleri kategorize etme
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

        // Kullanıcı malzemelerini kategorilere ayırıyoruz
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
                {/* Kategorilere ayrılmış malzemeleri göster */}
                {Object.keys(categorizedIngredients).map((category) =>
                    categorizedIngredients[category].length > 0 ? (
                        <div key={category} className="ingredient-category">
                            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                            <ul className="ingredient-list">
                                {/* Aynı kategoriye ait tüm malzemeleri burada listele */}
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
