import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
 position: relative;
 margin: 20px 0;
 border: 1px solid #ddd;
 border-radius: 8px;
 padding: 10px;
 user-select: none;
 -webkit-user-select: none;
 -moz-user-select: none;
 -ms-user-select: none;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  
  img, svg {
    width: 100%;
    height: auto;
    display: block;
  }
  
  svg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const StyledImage = styled.img`
 max-width: 100%;
 height: auto;
 pointer-events: none;
 -webkit-user-drag: none;
`;

const DrawingModeSelect = styled.div`
 margin-bottom: 10px;
`;

const Button = styled.button`
 padding: 5px 10px;
 margin-right: 10px;
 background-color: ${props => props.active ? '#007bff' : '#f8f9fa'};
 color: ${props => props.active ? 'white' : '#333'};
 border: 1px solid #ddd;
 border-radius: 4px;
 cursor: pointer;

 &:hover {
   background-color: ${props => props.active ? '#0056b3' : '#e9ecef'};
 }
`;

const AreaForm = styled.div`
 margin-top: 10px;
 padding: 10px;
 background: #f8f9fa;
 border-radius: 4px;
`;

const ImageMapEditor = ({ image, areas = [], onAreasChange }) => {
 const [selectedArea, setSelectedArea] = useState(null);
 const [isDrawing, setIsDrawing] = useState(false);
 const [isDragging, setIsDragging] = useState(false);
 const [points, setPoints] = useState([]);
 const [mode, setMode] = useState('polygon'); // 'polygon' ou 'rectangle'
 const [startPoint, setStartPoint] = useState(null);
 const imageRef = useRef(null);
 const lastPointRef = useRef(null);

 console.log('Areas reçues dans ImageMapEditor:', areas);

 const getColorValues = (color) => {
    const colors = {
      blue: '0, 123, 255',
      red: '255, 0, 0',
      green: '0, 255, 0',
      yellow: '255, 255, 0'
    };
    return colors[color] || colors.blue;
  };

 useEffect(() => {
   const handleKeyDown = (e) => {
     if ((e.key === 'Delete' || e.key === 'Backspace') && selectedArea !== null) {
       e.preventDefault();
       const updatedAreas = areas.filter((_, i) => i !== selectedArea);
       onAreasChange(updatedAreas);
       setSelectedArea(null);
     } else if (e.key === 'Escape' && isDrawing) {
       setIsDrawing(false);
       setPoints([]);
     }
   };

   window.addEventListener('keydown', handleKeyDown);
   return () => window.removeEventListener('keydown', handleKeyDown);
 }, [selectedArea, areas, onAreasChange, isDrawing]);

 const getMousePosition = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    return {
      x: Math.max(0, Math.min(x, 100)),
      y: Math.max(0, Math.min(y, 100))
    };
  };

  const handleAreaMouseDown = (e, index) => {
    e.stopPropagation();
    setSelectedArea(index);
    setIsDragging(true);
    setStartPoint(getMousePosition(e));
  };
  
  const handleAreaMouseMove = (e) => {
    if (!isDragging || selectedArea === null) return;
    e.preventDefault();
    e.stopPropagation();
  
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left);
    const clickY = (e.clientY - rect.top);
    
    // Calcule le centre de la forme
    const area = areas[selectedArea];
    const points = area.points;
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  
    // Convertit les coordonnées de la souris en pourcentages
    const mouseX = (clickX / rect.width) * 100;
    const mouseY = (clickY / rect.height) * 100;
  
    // Calcule le déplacement nécessaire pour que le centre de la forme suive la souris
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
  
    // Applique le déplacement à tous les points
    const newPoints = points.map(point => ({
      x: point.x + dx,
      y: point.y + dy
    }));
  
    const updatedAreas = [...areas];
    updatedAreas[selectedArea] = {
      ...area,
      points: newPoints
    };
  
    onAreasChange(updatedAreas);
  };
  
  const handleAreaMouseUp = () => {
    setIsDragging(false);
  };


  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const point = getMousePosition(e);
    setIsDrawing(true);
    setStartPoint(point);
    setPoints([point]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    e.stopPropagation();
  
    const currentPoint = getMousePosition(e);
  
    if (mode === 'polygon') {
      // Pour le mode polygon, on met à jour les points existants
      setPoints(prev => {
        const newPoints = [...prev];
        if (newPoints.length > 0) {
          const lastPoint = newPoints[newPoints.length - 1];
          const distance = Math.hypot(currentPoint.x - lastPoint.x, currentPoint.y - lastPoint.y);
          if (distance > 1) {
            return [...newPoints, currentPoint];
          }
        }
        return newPoints;
      });
    } else {
      // Pour le mode rectangle, on calcule les quatre coins
      const minX = Math.min(startPoint.x, currentPoint.x);
      const maxX = Math.max(startPoint.x, currentPoint.x);
      const minY = Math.min(startPoint.y, currentPoint.y);
      const maxY = Math.max(startPoint.y, currentPoint.y);
  
      setPoints([
        { x: minX, y: minY }, // coin supérieur gauche
        { x: maxX, y: minY }, // coin supérieur droit
        { x: maxX, y: maxY }, // coin inférieur droit
        { x: minX, y: maxY }, // coin inférieur gauche
        { x: minX, y: minY }  // retour au point de départ pour fermer le rectangle
      ]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || points.length < 2) {
      setPoints([]);
      setIsDrawing(false);
      return;
    }

    const newArea = {
        type: mode,
        points: [...points],
        text: ''
      };
      onAreasChange([...areas, newArea]);
    
      setIsDrawing(false);
      setPoints([]);
      setStartPoint(null);
    };

    const createPathFromPoints = (points) => {
        if (!points || points.length < 2) return '';
        return (
          points
            .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
            .join(' ') + ' Z'
        );
      };

 return (
   <EditorContainer>
     <DrawingModeSelect>
       <Button
         active={mode === 'polygon'}
         onClick={() => setMode('polygon')}
       >
         Forme libre
       </Button>
       <Button
         active={mode === 'rectangle'}
         onClick={() => setMode('rectangle')}
       >
         Rectangle
       </Button>
     </DrawingModeSelect>

     <ImageContainer>
  <StyledImage
    ref={imageRef}
    src={image.src}
    alt="Zone sélectionnable"
  />
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    onMouseDown={handleMouseDown}
    onMouseMove={(e) => {
      if (isDragging) {
        handleAreaMouseMove(e);
      } else if (isDrawing) {
        handleMouseMove(e);
      }
    }}
    onMouseUp={() => {
      handleMouseUp();
      handleAreaMouseUp();
    }}
    onMouseLeave={() => {
      handleMouseUp();
      handleAreaMouseUp();
    }}
  >
    {areas.map((area, index) => (
        
      area.points && area.points.length > 0 && (
        <g key={index}>
<path
  key={index}
  d={createPathFromPoints(area.points)}
  fill={
    selectedArea === index
      ? `rgba(${getColorValues(area.color || 'blue')}, 0.5)`  // Changé de 0.5 à 0.3
      : `rgba(${getColorValues(area.color || 'blue')}, 0.2)`  // Changé de 0.2 à 0.1
  }
  stroke={`rgba(${getColorValues(area.color || 'blue')}, 0.5)`}
  strokeWidth="0.1"
  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAreaMouseDown(e, index);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedArea(index);
            }}
          />
          {area.points[0] && (
            <text
              x={area.points[0].x}
              y={area.points[0].y}
              fill="white"
              fontSize="2" // Ajuster la taille de la police
              fontWeight="bold"
              pointerEvents="none"
            >
              {index + 1}
            </text>
          )}
        </g>
      )
    ))}
    {isDrawing && points.length > 0 && (
        <path
  d={createPathFromPoints(points)}
  fill="rgba(0, 123, 255, 0.3)"
  stroke="rgba(0, 123, 255, 0.5)"
  strokeWidth="0.1" // Change 0.5 à 0.2 ici aussi
  pointerEvents="none"
/>
    )}
  </svg>
</ImageContainer>

{selectedArea !== null && (
  <AreaForm>
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700">
        Description de la zone {selectedArea + 1}
      </label>
      <input
        type="text"
        value={areas[selectedArea]?.text || ''}
        onChange={(e) => {
          e.stopPropagation();
          const updatedAreas = [...areas];
          updatedAreas[selectedArea] = {
            ...updatedAreas[selectedArea],
            text: e.target.value
          };
          onAreasChange(updatedAreas);
        }}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700">
        Couleur de la zone
      </label>
      <select
        value={areas[selectedArea]?.color || 'blue'}
        onChange={(e) => {
          e.stopPropagation();
          const updatedAreas = [...areas];
          updatedAreas[selectedArea] = {
            ...updatedAreas[selectedArea],
            color: e.target.value
          };
          onAreasChange(updatedAreas);
        }}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      >
        <option value="blue">Bleu</option>
        <option value="red">Rouge</option>
        <option value="green">Vert</option>
        <option value="yellow">Jaune</option>
      </select>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        const updatedAreas = areas.filter((_, i) => i !== selectedArea);
        onAreasChange(updatedAreas);
        setSelectedArea(null);
      }}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Supprimer la zone
    </button>
  </AreaForm>
)}
   </EditorContainer>
 );
};

export default ImageMapEditor;