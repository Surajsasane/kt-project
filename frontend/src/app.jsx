import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const id = loginId.trim();
    const pass = password.trim();

    if (!id || !pass) {
      alert("Please enter both Login ID and Password");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (id === "admin" && pass === "admin123") {
        setIsLoggedIn(true);
      } else {
        alert("Invalid Credentials ❌");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginId("");
    setPassword("");
  };

  // If logged in, show dashboard
  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Otherwise, show login form
  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <LogoBlock />

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Login ID</label>
            <input
              type="text"
              placeholder="Enter your login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              style={styles.input}
              disabled={isLoading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              ...styles.loginButton,
              ...(isLoading ? styles.loginButtonDisabled : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div style={styles.loadingSpinner}></div>
            ) : (
              'Access System'
            )}
          </button>
        </div>

        <div style={styles.footer}>
        </div>
      </div>
    </div>
  );
}

function LogoBlock() {
  const [imgOk, setImgOk] = React.useState(true);

  return (
    <div style={styles.logo}>
      {imgOk ? (
        <img
          src="/image.png"
          alt="Company logo"
          style={styles.logoImage}
          onError={() => setImgOk(false)}
        />
      ) : (
        <div style={styles.logoIcon}>🧠</div>
      )}
      <h1 style={styles.title}>Employee Knowledge System</h1>
      <p style={styles.subtitle}>Manage team knowledge efficiently</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  loginCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "40px",
    width: "420px",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
  },
  logo: {
    marginBottom: "30px",
  },
  logoIcon: {
    fontSize: "3rem",
    marginBottom: "10px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "8px",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    color: "#718096",
    fontSize: "0.95rem",
    marginBottom: "0",
  },
  form: {
    marginBottom: "30px",
  },
  inputGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "2px solid #e5e7eb",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.2s ease",
    background: "white",
    boxSizing: "border-box",
  },
  loginButton: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "10px",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  loginButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    transform: "none",
  },
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  footer: {
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
    color: "#9ca3af",
    fontSize: "0.85rem",
  },
};

// Add CSS animations
const styleSheet = document.styleSheets[0] || (() => {
  const style = document.createElement('style');
  document.head.appendChild(style);
  return style.sheet;
})();

styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
  }
`, styleSheet.cssRules.length);