import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Home from "./Home.jsx";
import Envlope from "./EnvelopeReveal.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/envelope" element={<Envlope />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);