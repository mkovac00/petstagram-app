import React from "react";

import landingPageImg from "../../../images/landingImg.svg";

import "./Container.css";

const Container = () => {
  return (
    <div className="center main-container">
      <img className="landing-image" src={landingPageImg} alt="Landing" />
      <div className="center main-container-lower">
        <p className="landing-text-first">Instagram,</p>
        <p className="landing-text-second">but for your</p>
        <p className="landing-text-third">pets</p>
      </div>
    </div>
  );
};

export default Container;
