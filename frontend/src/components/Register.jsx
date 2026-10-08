import { useState } from "react";

function Register({ onRegister, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            setMessage(
                "Please fill all fields."
            );
            return;
        }

        if (password.length < 6) {
            setMessage(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            setMessage(
                "Registration successful! Please login."
            );

            setName("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                onRegister();
            }, 1000);

        } catch (error) {
            console.error(error);

            setMessage(
                error.message || "Registration failed"
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
                    Create Account
                </h2>

                <p className="auth-subtitle">
                    Create an account to manage your meetings.
                </p>


                <form onSubmit={handleRegister}>

                    <label>
                        Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />


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
                        placeholder="Create a password"
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
                            ? "Creating Account..."
                            : "Register"}
                    </button>

                </form>


                {message && (
                    <p className="auth-message">
                        {message}
                    </p>
                )}


                <p className="switch-auth">

                    Already have an account?

                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                    >
                        Login
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Register;