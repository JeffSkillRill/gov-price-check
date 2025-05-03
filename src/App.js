import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ComparePage from './pages/ComparePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </Router>
  );
}

export default App;