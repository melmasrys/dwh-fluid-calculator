import { useLocation } from "wouter";
import { Link } from "wouter";
import "./Navigation.css";

export default function Navigation() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="nav-logo">⚡</div>
          <span className="nav-title">CapacityPlanner</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
              Calculator
            </Link>
          </li>
          <li>
            <Link href="/comparison" className={`nav-link ${isActive("/comparison") ? "active" : ""}`}>
              Comparison
            </Link>
          </li>
          <li>
            <Link href="/sizing" className={`nav-link ${isActive("/sizing") ? "active" : ""}`}>
              Sizing Guide
            </Link>
          </li>
        </ul>

        <div className="nav-version">v2.1</div>
      </div>
    </nav>
  );
}
