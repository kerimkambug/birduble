import React, { useState } from "react";
import "../styles/Loginpage.css";

function LoginPage({ setCurrentPage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("E-posta ve şifre gereklidir!");
            return;
        }

        const API_URL = process.env.REACT_APP_API_URL || "https://mighty-island-53325-296dd28c851f.herokuapp.com";

        fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === "Login successful") {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setCurrentPage("home");
                } else {
                    setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
                }
            })
            .catch((error) => {
                setError("Bir hata oluştu.");
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Giriş Yap</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">E-posta:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="E-posta adresini girin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Şifre:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Şifrenizi girin"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-btn">Giriş Yap</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
