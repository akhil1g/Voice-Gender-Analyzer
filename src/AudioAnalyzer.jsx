import React, { useState } from 'react';
import fft from 'fft-js';

const AudioAnalyzer = () => {
  const [results, setResults] = useState([]);

  const analyzeAudio = async (files) => {
    try {
      console.log(files);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log(audioContext)
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          console.log(reader);
          reader.onload = async () => {
            try {
              const audioBuffer = await audioContext.decodeAudioData(reader.result);
              console.log(audioBuffer);

              // Calculate the FFT size (nearest power of two greater than or equal to the length of the audio buffer)
              let fftSize = 1;
              while (fftSize < audioBuffer.length) {
                fftSize *= 2;
              }

              // Set a minimum FFT size
              if (fftSize < 2) {
                fftSize = 2;
              }
              console.log(fftSize);

              const audioData = audioBuffer.getChannelData(0);
              console.log(audioData);
              // const inputData = audioData.map(value => [value, 0]);
              // console.log(inputData);
              // audioData.forEach((value, index) => {
              //   inputData[index] = value;
              // });
              const inputData = new Array(fftSize).fill(0);
              audioData.forEach((value, index) => {
                inputData[index] = value;
              });
              // Perform FFT
              const phasors = fft.fft(inputData);
              console.log(phasors);

              // Get the frequency data
              // const magnitudeData = phasors.map(ph => Math.sqrt(ph[0] ** 2 + ph[1] ** 2));
              const magnitudeData = phasors.map(phasor => {
                const realPart = phasor[0];
                const imaginaryPart = phasor[1];
                return Math.sqrt(realPart ** 2 + imaginaryPart ** 2);
              });

              console.log(magnitudeData);
              // Find the index of the maximum frequency
              // const maxFrequencyIndex = magnitudeData.indexOf(Math.max(...magnitudeData));
              let maxMagnitude = -Infinity;
              let maxFrequencyIndex = -1;

              for (let i = 0; i < magnitudeData.length; i++) {
                const magnitude = magnitudeData[i];
                if (magnitude > maxMagnitude) {
                  maxMagnitude = magnitude;
                  maxFrequencyIndex = i;
                }
              }

              console.log(maxFrequencyIndex);

              // Calculate the corresponding frequency
              const maxFrequency = maxFrequencyIndex * audioContext.sampleRate / fftSize;

              // Determine the gender based on the peak frequency
              const gender = Math.abs(maxFrequency - 122) > Math.abs(maxFrequency - 212) ? 'female' : 'male';

              // Resolve the promise with the analysis results
              resolve({ name: file.name, maxFrequency: maxFrequency.toFixed(2), gender });
            } catch (error) {
              reject(error);
            }
          };
          reader.readAsArrayBuffer(file);
        });
      });

      // Wait for all promises to resolve
      const analysisResults = await Promise.all(promises);

      // Update the state with the analysis results
      setResults(analysisResults);
    } catch (error) {
      console.error('Error analyzing audio:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" multiple onChange={(e) => analyzeAudio(e.target.files)} />
      <div className="results-container">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <p>File: {result.name} - Peak Frequency: {result.maxFrequency} Hz - Gender: {result.gender}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioAnalyzer;
