import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Index from "./pages/Index";
import HelloIA from "./pages/HelloIA";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hello-ia" element={<HelloIA />} />

        {/* Protected page */}
        <Route path="/tasks" element={<Tasks />} />

        {/* Fallback for any unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;