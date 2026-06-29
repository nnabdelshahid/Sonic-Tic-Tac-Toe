import React from 'react';
import './App.css';

function Squares({ index, isDisabled, isHighlighted, onSquareClick, renderToken, value }) {
  const label = value ? `Square ${index + 1}, occupied` : `Square ${index + 1}, empty`;

  return (
    <button
      type="button"
      className={`square ${isHighlighted ? 'square--winning' : ''}`}
      onClick={() => onSquareClick(index)}
      disabled={isDisabled}
      aria-label={label}
    >
      {renderToken(value)}
    </button>
  );
}

export default Squares;
