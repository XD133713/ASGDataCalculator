import { useState } from "react";
import API_URL from "./api";

function Login({ onAuth }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault()
        setError(null);

        try {
            const res = await fetch(`${API_URL}/accounts/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            let data;
            try {
                data = await res.json();
            } catch {
                setError("Nieprawidłowa odpowiedź serwera");
                return;
            }
            console.log("LOGIN RESPONSE:", res.status, data);

            if (!res.ok) {
                const message = data.email || data.password || data.detail || "Błąd logowania";
                setError(message);
                return;
            }

            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            onAuth();

        } catch (err) {
            setError("Błąd połączenia z serwerem")
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Zaloguj się</h2>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Zaloguj</button>
            {error && <p className="error">{error}</p>}
        </form>
    );

}
export default Login;
