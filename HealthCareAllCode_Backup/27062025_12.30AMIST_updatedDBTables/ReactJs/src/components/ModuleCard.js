import React from 'react';

const ModuleCard = ({ title, iconClass, onClick }) => (
  <div className="col-md-4 mb-4">
    <div className="card module-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-body text-center">
        <i className={`fas ${iconClass} fa-3x mb-3`}></i>
        <h5 className="card-title">{title}</h5>
      </div>
    </div>
  </div>
);

export default ModuleCard;
