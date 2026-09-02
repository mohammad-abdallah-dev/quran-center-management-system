import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const Account = JSON.parse(localStorage.getItem("Account"));
const navigate=useNavigate()
function handleLogout() {
  localStorage.removeItem("Account");
  localStorage.removeItem("role");
  localStorage.removeItem("token");

  window.location.href = "/";
}

  return (
    <header style={styles.header}>
      {Account ? (
        <Link to="/" style={styles.logo}>
  <span>{Account.userName}</span>
  <span style={styles.className}>{Account.className}</span>
</Link>
      ) : (
     <p style={styles.logo}>
  🌱 نبني الجيل
</p>
      )}

      <nav style={styles.nav}>
        {Account ? (
          <>
            <Link to="/" style={styles.link}>
              الصفحة الرئيسية
            </Link>

            <Button style={styles.logoutButton} onClick={handleLogout}>
              تسجيل الخروج
            </Button>
          </>
        ) : (
<Link to="/" style={styles.link}>
            تسجيل الدخول
          </Link>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    width: "100%",
    height: "70px",
    background: "rgba(12,22,15,0.9)",
    backdropFilter: "blur(10px)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid rgba(139,161,93,0.35)",
  },

logo: {
  color: "#e5e0c8",
  textDecoration: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "2px",
},

 nav: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexShrink: 0,
},

  link: {
    color: "#f0f0e0",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  logoutButton: {
    border: "1px solid #6f7d49",
    background: "linear-gradient(135deg,#5f6f35,#9aaa57)",
    color: "white",
    fontWeight: "bold",
    borderRadius: "8px",
  },
};