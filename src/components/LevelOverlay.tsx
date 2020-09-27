import React from "react";
import StyledOverlay from "./Overlay";

const LevelOverlay = (props: { level: string; desc?: string }) => {
  return (
    <StyledOverlay>
      <div>
        <h1>Level {props.level}</h1>
        {props.desc && <p>{props.desc}</p>}
      </div>
    </StyledOverlay>
  );
};

export default LevelOverlay;
