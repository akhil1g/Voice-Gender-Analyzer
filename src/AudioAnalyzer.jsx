import React, { useState, useRef } from 'react';
import fft from 'fft-js';
import { FaPlay, FaPause } from 'react-icons/fa';
import Loader from './Loader';

// CSS styles
const containerStyle = {
  maxWidth: '600px',
  margin: 'auto',
  padding: '20px',
};

const controlStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

const resultItemStyle = {
  textAlign: 'center',
  margin: '10px auto',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  width: '80%',
};


const resultsStyle = {
  marginTop: '20px',
};

const footerStyle = {
  textAlign: 'center',
  marginTop: '50px',
  borderTop: '1px solid #ccc',
  paddingTop: '20px',
};

const teamMemberStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '40px', // Increased vertical distance
};

const memberNameStyle = {
  marginTop: '5px', // Reduced margin to separate names from photos
};

const registrationNumberStyle = {
  marginTop: '2px', // Reduced margin to separate registration numbers from names
};

const squarePhotoStyle = {
  width: '150px', // Increased photo size
  height: '150px', // Increased photo size
  objectFit: 'cover',
  borderRadius: '10px', // Added border radius for rounded corners
  marginBottom: '10px', // Added spacing between images
  marginLeft: '10px', // Added left spacing
  marginRight: '10px', // Added right spacing
};

const AudioAnalyzer = () => {
  const [results, setResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const audioRef = useRef(new Audio());

  const togglePlay = () => {
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const analyzeAudio = async (files) => {
    try {
      setIsLoading(true); // Show loader while analyzing audio
      const fileURL = URL.createObjectURL(files[0]);
      audioRef.current.src = fileURL;
      audioRef.current.play();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const audioBuffer = await audioContext.decodeAudioData(reader.result);
              let fftSize = 1;
              while (fftSize < audioBuffer.length) {
                fftSize *= 2;
              }
              if (fftSize < 2) {
                fftSize = 2;
              }
              const audioData = audioBuffer.getChannelData(0);
              const inputData = new Array(fftSize).fill(0);
              audioData.forEach((value, index) => {
                inputData[index] = value;
              });
              const phasors = fft.fft(inputData);
              const magnitudeData = phasors.map(phasor => {
                const realPart = phasor[0];
                const imaginaryPart = phasor[1];
                return Math.sqrt(realPart ** 2 + imaginaryPart ** 2);
              });
              let maxMagnitude = -Infinity;
              let maxFrequencyIndex = -1;
              for (let i = 0; i < magnitudeData.length; i++) {
                const magnitude = magnitudeData[i];
                if (magnitude > maxMagnitude) {
                  maxMagnitude = magnitude;
                  maxFrequencyIndex = i;
                }
              }
              const maxFrequency = maxFrequencyIndex * audioContext.sampleRate / fftSize;
              const gender = Math.abs(maxFrequency - 122) > Math.abs(maxFrequency - 212) ? 'female' : 'male';
              resolve({ name: file.name, maxFrequency: maxFrequency.toFixed(2), gender });
            } catch (error) {
              reject(error);
            }
          };
          reader.readAsArrayBuffer(file);
        });
      });
      const analysisResults = await Promise.all(promises);
      setResults(analysisResults);
      setIsLoading(false); // Hide loader after analysis
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setIsLoading(false); // Hide loader in case of error
    }
  };

  return (
    <div style={containerStyle}>
      <input type="file" accept="audio/*" multiple onChange={(e) => analyzeAudio(e.target.files)} />
      {isLoading && <Loader />} {/* Loader */}
      <div style={controlStyle} className="controls">
        {isPlaying ? (
          <button onClick={togglePlay}><FaPause /></button>
        ) : (
          <button onClick={togglePlay}><FaPlay /></button>
        )}
      </div>
      <div style={resultsStyle} className="results-container">
        {results.map((result, index) => (
          <div key={index} style={resultItemStyle} className="result-item">
            <p><strong>File Name:</strong> {result.name}</p>
            <p><strong>Gender:</strong> {result.gender}</p>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div style={footerStyle}>
        <p style={{ margin: 0 }}>Team Info:</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={teamMemberStyle}>
            <img src="https://t4.ftcdn.net/jpg/02/60/78/83/360_F_260788352_x5sSHM4DGvpjHj9wz8sFltzAPktQwJCj.jpg" alt="Member" style={squarePhotoStyle} />
            <p style={memberNameStyle}>Akhil Gupta</p>
            <p style={registrationNumberStyle}>20215090</p>
          </div>
          <div style={teamMemberStyle}>
            <img src="https://t4.ftcdn.net/jpg/02/60/78/83/360_F_260788352_x5sSHM4DGvpjHj9wz8sFltzAPktQwJCj.jpg" alt="Member" style={squarePhotoStyle} />
            <p style={memberNameStyle}>Aman Singh</p>
            <p style={registrationNumberStyle}>20215127</p>
          </div>
          <div style={teamMemberStyle}>
            <img src="https://t4.ftcdn.net/jpg/02/60/78/83/360_F_260788352_x5sSHM4DGvpjHj9wz8sFltzAPktQwJCj.jpg" alt="Member" style={squarePhotoStyle} />
            <p style={memberNameStyle}>Aman Singh</p>
            <p style={registrationNumberStyle}>20215129</p>
          </div>
          <div style={teamMemberStyle}>
            <img src="https://t4.ftcdn.net/jpg/02/60/78/83/360_F_260788352_x5sSHM4DGvpjHj9wz8sFltzAPktQwJCj.jpg" alt="Member" style={squarePhotoStyle} />
            <p style={memberNameStyle}>Aman Kumar</p>
            <p style={registrationNumberStyle}>20215041</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioAnalyzer;
