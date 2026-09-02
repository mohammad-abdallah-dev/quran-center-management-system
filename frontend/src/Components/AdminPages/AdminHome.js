import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div style={styles.page}>
      

      <main style={styles.container}>
        <div style={styles.cardContainer}>
          <h1 style={styles.title}>ADMIN HOME</h1>

          <p style={styles.subtitle}>

          </p>

          <div style={styles.buttons}>
            <Link
              to="/CreateClass"
              style={styles.card}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, styles.cardHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.card)
              }
            >
إنشاء شعبة جديدة            </Link>

          

            <Link
              to="/CreateTeacher"
              style={styles.card}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, styles.cardHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.card)
              }
            >
             إنشاء مشرف جديد
            </Link>
 <Link
              to="/DashBoards/Class"
              style={styles.card}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, styles.cardHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.card)
              }
            >
             سجل الشعب
            </Link>
          <Link
              to="/DashBoards/Teacher"
              style={styles.card}
              onMouseEnter={(e) =>
                Object.assign(e.target.style, styles.cardHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.target.style, styles.card)
              }
            >
             سجل المشرفين
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(rgba(8,18,12,0.75), rgba(3,8,5,0.9)), url('http://images.unsplash.com/photo-1448375240586-882707db888b')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Segoe UI, sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    height: "70px",
    background: "rgba(12,22,15,0.9)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid rgba(139,161,93,0.35)",
  },

  logo: {
    color: "#e5e0c8",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  cardContainer: {
    width: "100%",
    maxWidth: "430px",
    background: "rgba(12,22,15,0.82)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(139,161,93,0.35)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    boxSizing: "border-box",
  },

  title: {
    color: "#e5e0c8",
    textAlign: "center",
    fontSize: "30px",
    margin: 0,
    letterSpacing: "2px",
  },

  subtitle: {
    color: "#b9c88a",
    textAlign: "center",
    marginTop: "10px",
    marginBottom: "30px",
    fontSize: "15px",
  },

  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  card: {
    background: "rgba(0,0,0,0.35)",
    border: "1px solid #6f7d49",
    color: "#f0f0e0",
    textDecoration: "none",
    padding: "18px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all .3s ease",
    boxSizing: "border-box",
  },

  cardHover: {
    background: "linear-gradient(135deg,#5f6f35,#9aaa57)",
    color: "#fff",
    transform: "translateY(-3px)",
    boxShadow: "0 8px 20px rgba(154,170,87,.35)",
    border: "1px solid #9aaa57",
  },
};