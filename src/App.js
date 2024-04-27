// App.js

import React from 'react';
import './App.css';
import AudioAnalyzer from './AudioAnalyzer.jsx';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Audio Gender Analyzer</h1>
      </header>
      <div className="container">
        <AudioAnalyzer />
      </div>
    </div>
  );
}

export default App;
