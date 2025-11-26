import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import WatchlistView from "./pages/WatchListView";
import PopupView from "./popup/popup";

export default function App() {
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    // Check if we're in popup mode (small window) or fullscreen mode
    const width = window.innerWidth;
    setIsPopup(width < 600);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Popup view for browser extension */}
        <Route path="/" element={<PopupView />} />
        {/* Full dashboard view */}
        <Route path="/watchlist" element={<WatchlistView />} />
        {/* Default route redirects to appropriate view */}
        <Route path="*" element={isPopup ? <PopupView /> : <WatchlistView />} />
      </Routes>
    </Router>
  );
}