export default function Navbar() {
  return (
    <header className="top-header">

      <div className="header-container">

        <div className="brand-section">

          <div className="brand-logo">
            ⚙
          </div>

          <div className="brand-text">
            <div className="brand-name">
              MachineryGuard
            </div>

            <div className="brand-subtitle">
              Failure Prediction System
            </div>
          </div>

        </div>

        <div className="system-status">
          <span className="status-dot"></span>

          <div>
            <div className="status-title">
              System Online
            </div>

            <div className="status-subtitle">
              ML services operational
            </div>
          </div>
        </div>

      </div>

    </header>
  );
}