import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RoutePage from "./pages/RoutePage";
import StopPage from "./pages/StopPage";
import FinalPage from "./pages/FinalPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/stop/:id" element={<StopPage />} />
        <Route path="/final" element={<FinalPage />} />
      </Routes>
    </HashRouter>
  );
}
