import AdminHome from "../AdminPages/AdminHome";
import TeacherHome from "../TeacherPages/TeacherHome";
import Login from "../Shared/Login";

export default function Home() {
  const Account = JSON.parse(localStorage.getItem("Account"));

  if (!Account) {
    return <Login />;
  }

  if (Account.role === "Admin") {
    return <AdminHome />;
  }

  if (Account.role === "Teacher") {
    return <TeacherHome />;
  }

  return <Login />;
}