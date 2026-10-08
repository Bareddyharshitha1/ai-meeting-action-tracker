import { useState } from "react";

function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setMessage(
                "Please enter email and password."
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            onLogin(data.user);

        } catch (error) {
            console.error(error);

            setMessage(
                error.message || "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1>
                    AI Meeting Action Tracker
                </h1>

                <h2>
                    Welcome Back
                </h2>

                <p className="auth-subtitle">
                    Login to manage your meetings and tasks.
                </p>


                <form onSubmit={handleLogin}>

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}


                <p className="switch-auth">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;