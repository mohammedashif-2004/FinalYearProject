import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<TeacherProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;