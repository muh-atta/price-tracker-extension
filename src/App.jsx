import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import WatchlistView from "./pages/WatchListView";
import PopupView from "./popup/popup";

export default function App() {
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    const width = window.innerWidth;

    setIsPopup(width < 600);
  }, []);

  return (
    <Router>
      <Routes>
        {isPopup ? (
          <Route path="/" element={<PopupView />} />
        ) : (
          <Route path="/watchlist" element={<WatchlistView />} />
        )}
      </Routes>
    </Router>
  );
}
