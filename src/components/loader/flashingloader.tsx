import React from "react";
import "./dot-flashing.css";

const FlashingLoader = () => {
  return (
    <div className="stage" style={{ alignItems: "center" }}>
      <div className="dot-flashing"></div>
    </div>
  );
};

export default FlashingLoader;
