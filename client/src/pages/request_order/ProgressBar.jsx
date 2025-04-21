import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', margin: '10px 0' }}>
      <div
        style={{
          width: `${progress}%`,
          backgroundColor: '#76c7c0',
          height: '20px',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
