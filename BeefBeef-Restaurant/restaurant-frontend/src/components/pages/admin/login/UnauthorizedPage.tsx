import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "80vh",
      color: "#ffffff",
      padding: "2rem",
      borderRadius: "8px",
    }}
  >
    <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🚫</div>
    <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
      Không có quyền truy cập
    </h1>
    <p style={{ fontSize: "1rem", maxWidth: "400px", textAlign: "center" }}>
      Bạn không được phép xem trang này. Nếu bạn cho rằng đây là nhầm lẫn, hãy liên hệ quản trị viên.
    </p>
    <Link
      to="/"
      style={{
        marginTop: "1.5rem",
        textDecoration: "none",
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "0.6rem 1.2rem",
        borderRadius: "4px",
        fontWeight: "500",
      }}
    >
      Quay về 
    </Link>
  </div>
);

export default UnauthorizedPage;
