import React from "react";

const LoginRequired = () => {
    return (
        <div
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "20px",
                textAlign: "center",
                borderRadius: "10px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: "1000",
                width: "80%",
                maxWidth: "400px",
            }}
        >
            <h2>Giriş Yapılmadı!</h2>
            <p>Bu sayfayı görüntülemek için giriş yapmanız gerekmektedir.</p>
            <a
                href="#login"
                style={{
                    color: "#4CAF50",
                    textDecoration: "none",
                    fontWeight: "bold",
                }}
            >
                Giriş Yap
            </a>
        </div>
    );
};

export default LoginRequired;
