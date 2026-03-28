import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentList from "./pages/StudentList";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<TeacherProfile />} />
        <Route path="/students" element={<StudentList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;