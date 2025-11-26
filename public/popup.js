import { createRoot } from 'react-dom/client';
import Popup from '../src/popup/popup.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('popup-root');
  const root = createRoot(container);
  root.render(<Popup />);
});
