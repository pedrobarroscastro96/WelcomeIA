import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tasks from "./pages/Tasks";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root path now shows the Tasks page directly */}
        <Route path="/" element={<Tasks />} />
        {/* Fallback for any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;