import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Navbar from "./components/Navbar";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app-shell">
      <Navbar />

      {/* Navigation */}
      <div className="navigation-bar">
        <div className="container-fluid dashboard-container">
          <div className="nav-inner">

            <button
              className={`nav-button ${
                page === "dashboard" ? "active" : ""
              }`}
              onClick={() => setPage("dashboard")}
            >
              <span className="nav-icon">▦</span>
              Dashboard
            </button>

            <button
              className={`nav-button ${
                page === "predict" ? "active" : ""
              }`}
              onClick={() => setPage("predict")}
            >
              <span className="nav-icon">◉</span>
              Prediction
            </button>

          </div>
        </div>
      </div>

      {/* Pages */}
      {page === "dashboard" ? (
        <Dashboard onNavigate={setPage} />
      ) : (
        <Predict />
      )}
    </div>
  );
}