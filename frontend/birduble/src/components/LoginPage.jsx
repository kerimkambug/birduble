import React, { useState } from "react";
import "../styles/Loginpage.css";

function LoginPage({ setCurrentPage }) {
    const [isLogin, setIsLogin] = useState(true); // Giriş veya Kayıt arasında geçiş yapar
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const API_URL = "https://mighty-island-53325-296dd28c851f.herokuapp.com";

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!email || !password) {
            setError("E-posta ve şifre gereklidir!");
            return;
        }

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
            .catch(() => {
                setError("Bir hata oluştu.");
            });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!name || !username || !email || !password) {
            setError("Tüm alanlar gereklidir!");
            return;
        }
        fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, username, email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // API cevabını kontrol edin
                if (data.message === "User registered successfully") {
                    setSuccessMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
                    setIsLogin(true);
                } else {
                    setError("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.");
                }
            })
            .catch(() => {
                setError("Bir hata oluştu.");
            });

    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isLogin ? "Giriş Yap" : "Kayıt Ol"}</h2>
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {isLogin ? (
                    <form onSubmit={handleLogin}>
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
                ) : (
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label htmlFor="name">Ad Soyad:</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Adınızı ve soyadınızı girin"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="username">Kullanıcı Adı:</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Kullanıcı adınızı girin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
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
                        <button type="submit" className="login-btn">Kayıt Ol</button>
                    </form>
                )}

                <p>
                    {isLogin ? "Hesabınız yok mu?" : "Hesabınız var mı?"}{" "}
                    <span
                        className="toggle-link"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Kayıt Olun" : "Giriş Yapın"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
