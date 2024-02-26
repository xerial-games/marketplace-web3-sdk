const ErrorMessage = ({ isOpen, onClose, error }) => {
  const handleModalClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  if (error) {
    setTimeout(() => {
      onClose();
    }, 7000);
  }

  return (
    <div className="error-message__modal-overlay">
      <div className="error-message__errorContainer">
        <div className="error-message__errorImgAndMessageContainer">
          <svg className="error-message__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#fff" stroke-width="2"/>
            <line x1="5" y1="19" x2="19" y2="5" stroke="#fff" stroke-width="2"/>
          </svg>
          {error && <p className="error-message__error"><span>Error:</span> {error}</p>}
        </div>
        <button className="error-message__buttonClose" onClick={handleModalClose}>X</button>
      </div>
    </div>
  );
};

export default ErrorMessage;