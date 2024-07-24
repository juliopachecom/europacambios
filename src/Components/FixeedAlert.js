import React from 'react'

const FixeedAlert = ({ message, type }) => {
  return (
    <div className={`fixed-alert ${type}`}>
      {message}
    </div>
  );
}

export { FixeedAlert }