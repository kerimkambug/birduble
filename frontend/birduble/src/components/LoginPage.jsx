import React, { useState } from "react";
import "../styles/Loginpage.css"

function LoginPage({ setCurrentPage }) {
    const [email, setEmail] = useState(""); // Kullanıcı e-posta durumu
    const [password, setPassword] = useState(""); // Kullanıcı şifre durumu
    const [error, setError] = useState(""); // Hata mesajı durumu

    // Form gönderme işlemi
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(""); // Önceki hatayı temizle

        // Basit validasyon örneği
        if (!email || !password) {
            setError("E-posta ve şifre gereklidir!");
            return;
        }

        // API isteği ile doğrulama
        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // API cevabını kontrol et
                if (data.message === "Login successful") {
                    // Başarılı giriş, token ve kullanıcı bilgisini sakla
                    localStorage.setItem("token", data.token); // Token'ı localStorage'da sakla
                    localStorage.setItem("user", JSON.stringify(data.user)); // Kullanıcı bilgisini sakla

                    // Home sayfasına yönlendir
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
                {error && <div className="error-message">{error}</div>} {/* Hata mesajı */}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">E-posta:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="E-posta adresini girin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // E-posta güncelle
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Şifre:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Şifrenizi girin"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Şifre güncelle
                        />
                    </div>
                    <button type="submit" className="login-btn">Giriş Yap</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
