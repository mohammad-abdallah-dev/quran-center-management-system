import './App.css';
import ProtectedRoute from './Components/ProtectedRoute';
import { Routes,Route } from 'react-router-dom';
import Login from './Components/Shared/Login';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from './Components/Shared/Header';
import Home from './Components/Shared/Home';
import CreateTeacherPage from './Components/AdminPages/CreateTeacher';
import CreateClass from './Components/AdminPages/CreateClass';
import DashBoards from './Components/Shared/DashBoards';
import CreateStudent from './Components/TeacherPages/CreateStudent';
import DailyProgress from './Components/TeacherPages/DailyProgress';
import StudentProfile from './Components/StudentPages/StudentProfile';
import QuranProgress from './Components/StudentPages/QuranProgress';
import StudentQuranProgress from './Components/StudentPages/StudentQuranProgress';
import StudentDailyProgress from './Components/StudentPages/StudentDailyProgress';
import EditStudentDailyProgress from './Components/StudentPages/EditStudentDailyProgress';
import AddStudentDailyProgress from './Components/StudentPages/AddStudentDailyProgress';
import ResetPassword from './Components/AdminPages/ResetPassword';
function App() {
  return (
    <div className="App">
     <Header/>
      
<Routes>
  <Route path="/login" element={<Login />} />
<Route path="/Login" element={<Login />} />

 <Route
  path="/"
  element={
    localStorage.getItem("Account") ? (
      <ProtectedRoute allowedRoles={["Admin", "Teacher"]}>
        <Home />
      </ProtectedRoute>
    ) : (
      <Login />
    )
  }
/>

  <Route
    path="/CreateTeacher"
    element={
      <ProtectedRoute allowedRoles={["Admin"]}>
        <CreateTeacherPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/CreateClass"
    element={
      <ProtectedRoute allowedRoles={["Admin"]}>
        <CreateClass />
      </ProtectedRoute>
    }
  />

  <Route
    path="/ResetPassword/:id"
    element={
      <ProtectedRoute allowedRoles={["Admin"]}>
        <ResetPassword />
      </ProtectedRoute>
    }
  />

  <Route
    path="/DashBoards/:type"
    element={
      <ProtectedRoute allowedRoles={["Admin", "Teacher"]}>
        <DashBoards />
      </ProtectedRoute>
    }
  />

  <Route
    path="/DashBoards/:type/:id"
    element={
      <ProtectedRoute allowedRoles={["Admin", "Teacher"]}>
        <DashBoards />
      </ProtectedRoute>
    }
  />

  <Route
    path="/CreateStudent"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <CreateStudent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/StudentDailyProgress/:id"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <StudentDailyProgress />
      </ProtectedRoute>
    }
  />

  <Route
    path="/StudentProfile/:id"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <StudentProfile />
      </ProtectedRoute>
    }
  />

  <Route
    path="/QuranProgress/:type/:id"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <QuranProgress />
      </ProtectedRoute>
    }
  />

  <Route
    path="/StudentQuranProgress/:id"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <StudentQuranProgress />
      </ProtectedRoute>
    }
  />

  <Route
    path="/StudentDailyProgress/Edit/:id"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <EditStudentDailyProgress />
      </ProtectedRoute>
    }
  />

  <Route
    path="/StudentDailyProgress/Add/:id"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <AddStudentDailyProgress />
      </ProtectedRoute>
    }
  />

  <Route
    path="/DailyProgress"
    element={
      <ProtectedRoute allowedRoles={["Teacher"]}>
        <DailyProgress />
      </ProtectedRoute>
    }
  />
</Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="dark"
      />
    </div>
  );
}

export default App;
