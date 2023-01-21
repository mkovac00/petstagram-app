import React from "react";

import "./PageSplitter.css";

const PageSplitter = (props) => {
  return (
    <div className="center splitter-container">
      <p className="splitter-text">{props.text}</p>
    </div>
  );
};

export default PageSplitter;
