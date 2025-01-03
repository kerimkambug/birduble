import React from "react";

const LoginRequired = ({ message }) => {
    if (message == "Veri çekilirken bir hata oluştu.") {
        return <div
            style={{
                backgroundColor: "rgba(211, 24, 24, 0.7)",
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
            <h2>Giriş yapılamadı</h2>

        </div>
    }
    return (
        <div
            style={{
                backgroundColor: "rgba(211, 24, 24, 0.7)",
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
            <h2>{message}</h2>

        </div>
    );
};

export default LoginRequired;
