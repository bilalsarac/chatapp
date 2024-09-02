import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Chat from './components/Chat';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setUsername={setUsername} />} />
        <Route path="/chat" element={<Chat username={username} />} />
      </Routes>
    </Router>
  );
};

export default App;
