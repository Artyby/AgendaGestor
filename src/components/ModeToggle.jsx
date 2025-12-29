import react from "react";
import { Sun, Moon } from "lucide-react";
import "../styles/ModeToggle.css";

const ModeToggle = ({ mode, onModeChange }) => {
  const isFinanceMode = mode === "finanzas";

  return (
    <div className="neo-toggle-container">
      <input
        className="neo-toggle-input"
        id="neo-toggle"
        type="checkbox"
        checked={isFinanceMode}
        onChange={(e) => onModeChange(e.target.checked ? "finanzas" : "agenda")}
      />
      <label className="neo-toggle" htmlFor="neo-toggle">
        <div className="neo-track">
          <div className="neo-background-layer"></div>
          <div className="neo-grid-layer"></div>
          <div className="neo-spectrum-analyzer">
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
            <div className="neo-spectrum-bar"></div>
          </div>
          <div className="neo-track-highlight"></div>
        </div>
        <div className="neo-thumb">
          <div className="neo-thumb-ring"></div>
          <div className="neo-thumb-core">
            <div className="neo-thumb-icon">
              <div className="neo-thumb-wave"></div>
              <div className="neo-thumb-pulse"></div>
            </div>
          </div>
        </div>
        <div className="neo-gesture-area"></div>
        <div className="neo-interaction-feedback">
          <div className="neo-ripple"></div>
          <div className="neo-progress-arc"></div>
        </div>
        <div className="neo-status">
          <div className="neo-status-indicator">
            <div className="neo-status-dot"></div>
            <div className="neo-status-text"></div>
          </div>
        </div>
      </label>

      {/* Labels para indicar los modos */}
      <div className="mode-labels">
        <span className={`mode-label ${!isFinanceMode ? "active" : ""}`}>
          📅 Agenda
        </span>
        <span className={`mode-label ${isFinanceMode ? "active" : ""}`}>
          💰 Finanzas
        </span>
      </div>
    </div>
  );
};

export default ModeToggle;
