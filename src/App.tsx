import { FraudNetworkGraph } from './components/FraudNetworkGraph';
import { FraudScoreMonitor } from './components/FraudScoreMonitor';
import { IndiaFraudHeatmap } from './components/IndiaFraudHeatmap';
import { VoiceVerification } from './components/VoiceVerification';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1 className="app__title">Fraud operations dashboard</h1>
        <p className="app__subtitle">
          Frontend mock: voice checks, network graph, live score trend, and regional heatmap. Data is
          synthetic for demonstration.
        </p>
      </header>

      <div className="app__grid">
        <div className="app__card">
          <VoiceVerification />
        </div>
        <div className="app__card">
          <FraudScoreMonitor />
        </div>
        <div className="app__card app__card--wide">
          <FraudNetworkGraph />
        </div>
        <div className="app__card app__card--wide">
          <IndiaFraudHeatmap />
        </div>
      </div>
    </div>
  );
}

export default App;
