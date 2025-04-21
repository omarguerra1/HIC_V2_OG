import React from 'react';

const ImagePreview = ({ imageUrl, onRemove }) => {
  return (
    <div className="image-preview-container">
      <h3>Imagen cargada:</h3>
      <img 
        src={imageUrl} 
        alt="Imagen cargada" 
        style={{ 
          width: '300px', 
          height: 'auto', 
          border: '2px solid #ddd', 
          padding: '10px',
          display: 'block', // Asegura que la imagen sea un bloque
          margin: '0 auto', // Centra la imagen horizontalmente
        }}
      />
      <button className="remove" onClick={onRemove}>Eliminar Imagen</button>
    </div>
  );
};

export default ImagePreview;
