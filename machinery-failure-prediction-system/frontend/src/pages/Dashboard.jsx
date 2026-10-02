import { useEffect, useState } from "react";
import { getMachines, getRecentPredictions } from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard({ onNavigate }) {
  const [machines, setMachines] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    getMachines()
      .then((r) => setMachines(r.data))
      .catch(console.error);

    getRecentPredictions()
      .then((r) => setPredictions(r.data))
      .catch(console.error);
  }, []);

  const risk = predictions.filter(
    (p) => p.prediction !== "NORMAL"
  ).length;

  const normalCount = predictions.filter(
    (p) => p.prediction === "NORMAL"
  ).length;

  return (
    <main className="main-content">

      {/* HERO */}
      <section className="hero-dashboard">

        <div className="hero-content">

          <div className="hero-eyebrow">
            INDUSTRIAL MONITORING
          </div>

          <h1>
            Machinery Health
            <span> Dashboard</span>
          </h1>

          <p>
            Monitor machine health, analyze sensor readings,
            and use your trained machine learning model to
            predict potential equipment failures.
          </p>

          <button
            className="hero-button"
            onClick={() => onNavigate("predict")}
          >
            Run New Prediction
            <span>→</span>
          </button>

        </div>

        <div className="hero-visual">

          <div className="machine-orbit">

            <div className="orbit-ring ring-one"></div>
            <div className="orbit-ring ring-two"></div>

            <div className="machine-core">
              ⚙
            </div>

            <div className="orbit-dot dot-one"></div>
            <div className="orbit-dot dot-two"></div>
            <div className="orbit-dot dot-three"></div>

          </div>

        </div>

      </section>

      {/* PAGE TITLE */}
      <div className="page-heading">

        <div>
          <div className="small-label">
            SYSTEM OVERVIEW
          </div>

          <h2>
            Performance Overview
          </h2>
        </div>

        <div className="last-updated">
          ● Live data
        </div>

      </div>

      {/* STATISTICS */}
      <div className="stats-grid">

        <StatCard
          title="Machines"
          value={machines.length}
          sub="Registered assets"
          icon="⚙"
          type="blue"
        />

        <StatCard
          title="Predictions"
          value={predictions.length}
          sub="Recent analyses"
          icon="◉"
          type="purple"
        />

        <StatCard
          title="Normal"
          value={normalCount}
          sub="Healthy predictions"
          icon="✓"
          type="green"
        />

        <StatCard
          title="Risk Alerts"
          value={risk}
          sub="Needs attention"
          icon="!"
          type="red"
        />

      </div>

      {/* MACHINES */}
      <section className="content-section">

        <div className="section-header">

          <div>
            <div className="small-label">
              ASSET MANAGEMENT
            </div>

            <h2>Machines</h2>

            <p>
              Current registered production equipment
            </p>
          </div>

          <button
            className="outline-button"
            onClick={() => onNavigate("predict")}
          >
            Run Prediction →
          </button>

        </div>

        {machines.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">⚙</div>
            <h3>No machines found</h3>
            <p>
              No machines are currently registered in the system.
            </p>
          </div>

        ) : (

          <div className="machine-grid">

            {machines.map((machine) => (

              <div
                className="machine-card"
                key={machine.id}
              >

                <div className="machine-card-header">

                  <div className="machine-icon">
                    ⚙
                  </div>

                  <span
                    className={`machine-status ${
                      machine.status === "NORMAL"
                        ? "status-normal"
                        : "status-warning"
                    }`}
                  >
                    <span>●</span>
                    {machine.status || "ACTIVE"}
                  </span>

                </div>

                <h3>
                  {machine.machine_name}
                </h3>

                <div className="machine-code">
                  {machine.machine_code}
                </div>

                <div className="machine-details">

                  <div>
                    <span className="detail-label">
                      Type
                    </span>

                    <strong>
                      {machine.machine_type || "—"}
                    </strong>
                  </div>

                  <div>
                    <span className="detail-label">
                      Location
                    </span>

                    <strong>
                      {machine.location || "—"}
                    </strong>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* PREDICTIONS */}
      <section className="content-section">

        <div className="section-header">

          <div>
            <div className="small-label">
              ML ANALYTICS
            </div>

            <h2>Recent Predictions</h2>

            <p>
              Latest machine learning prediction results
            </p>
          </div>

          <div className="prediction-count">
            {predictions.length} records
          </div>

        </div>

        {predictions.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <h3>No predictions yet</h3>
            <p>
              Run a prediction to see results here.
            </p>
          </div>

        ) : (

          <div className="table-container">

            <table className="professional-table">

              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Prediction</th>
                  <th>Probability</th>
                  <th>Model</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>

                {predictions.map((p) => {

                  const isNormal =
                    p.prediction === "NORMAL";

                  const probability =
                    p.failure_probability != null
                      ? (
                          Number(p.failure_probability) * 100
                        ).toFixed(1) + "%"
                      : "-";

                  return (
                    <tr key={p.id}>

                      <td>
                        <div className="table-machine">

                          <div className="table-machine-icon">
                            ⚙
                          </div>

                          <div>
                            <strong>
                              {p.machine_name}
                            </strong>

                            <small>
                              Machine prediction
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span
                          className={`prediction-badge ${
                            isNormal
                              ? "prediction-normal"
                              : "prediction-danger"
                          }`}
                        >
                          <span>
                            {isNormal ? "✓" : "!"}
                          </span>

                          {p.prediction}
                        </span>
                      </td>

                      <td>
                        <div className="probability">
                          <strong>
                            {probability}
                          </strong>

                          <div className="probability-bar">
                            <div
                              style={{
                                width: probability === "-"
                                  ? "0%"
                                  : probability
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="model-badge">
                          {p.model_name}
                        </span>
                      </td>

                      <td>
                        <span className="time-text">
                          {p.predicted_at
                            ? new Date(
                                p.predicted_at
                              ).toLocaleString()
                            : "-"}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}