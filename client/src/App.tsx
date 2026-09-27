import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DirectoryPage } from "./pages/DirectoryPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
