export default function StatCard({
  title,
  value,
  sub,
  icon,
  type = "blue"
}) {
  return (
    <div className="stat-card">

      <div className={`stat-icon stat-${type}`}>
        {icon}
      </div>

      <div className="stat-content">

        <span className="stat-title">
          {title}
        </span>

        <strong className="stat-value">
          {value}
        </strong>

        <span className="stat-subtitle">
          {sub}
        </span>

      </div>

    </div>
  );
}