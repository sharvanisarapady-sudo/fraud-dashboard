import { Link } from 'react-router-dom';
import './LandingPage.css';

export function LandingPage() {
  return (
    <div className="landing">
      <div className="landing__inner">
        <p className="landing__badge">Government · Trust · Intelligence</p>
        <h1 className="landing__title">BenefAI</h1>
        <p className="landing__subtitle">
          AI-Powered Fraud Detection System for Government Schemes
        </p>
        <p className="landing__desc">
          Monitor benefits in real time, surface suspicious patterns, and protect public funds with
          voice verification, network analytics, and regional risk signals—built for teams who need
          clarity at a glance.
        </p>
        <div className="landing__actions">
          <Link className="landing__btn landing__btn--primary" to="/dashboard">
            Get Started
          </Link>
          <Link className="landing__btn landing__btn--ghost" to="/dashboard">
            View Dashboard
          </Link>
        </div>
        <p className="landing__footer">Synthetic demo data · Not connected to production systems</p>
      </div>
    </div>
  );
}
