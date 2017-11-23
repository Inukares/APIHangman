import React from "react";

const GameFinished = props => (
  <div className="game-score">
    <div className="reset-section">
      <h1 className="score">
        {/* function below bascially splits on \n and creates br (newline) */}
        {props.gameScore.split("\n").map((item, key) => {
          return (
            <span key={key}>
              {item}
              <br />
            </span>
          );
        })}
      </h1>
      <button
        className="play-again"
        onClick={props.onReset}
        onKeyPress={e => props.onKeyPress(e)}
        ref={input => {
          input &&
            window.requestAnimationFrame(() => {
              input.focus();
            });
        }}
        style={{ outline: "none" }}
      >
        <b>NEW WORD</b>
      </button>
    </div>
  </div>
);
export default GameFinished;
