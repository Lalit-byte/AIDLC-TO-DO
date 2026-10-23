import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root was not found in index.html');
}

// StrictMode is not used so that the saved list is read exactly once at page open (NFR1.5).
createRoot(container).render(<App />);
