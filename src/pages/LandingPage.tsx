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

        {/* Buttons */}
        <div className="landing__actions">
          <Link className="landing__btn landing__btn--primary" to="/dashboard">
            Get Started
          </Link>

          <Link className="landing__btn landing__btn--ghost" to="/dashboard">
            View Dashboard
          </Link>
        </div>

        {/* 🔥 MODULES SECTION */}
        <div className="modules">
          <h2>🚀 Explore BenefAI Modules</h2>

          <div className="modules__grid">

            <a href="https://benefai-dashboard.vercel.app" target="_blank" rel="noreferrer">
              🏠 Main Dashboard
            </a>

            <a href="https://benefai.vercel.app" target="_blank" rel="noreferrer">
              📊 Analytics & Insights
            </a>

            <a href="https://benefai-legal-intelligence-mgln-dprw767no.vercel.app/p3test" target="_blank" rel="noreferrer">
              🤖 AI Fraud Detection
            </a>

            <a href="https://benefd.vercel.app/" target="_blank" rel="noreferrer">
              🎤 Voice Verification
            </a>

          </div>
        </div>

        <p className="landing__footer">
          Synthetic demo data · Not connected to production systems
        </p>
      </div>
    </div>
  );
}