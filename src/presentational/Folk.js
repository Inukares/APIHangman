import React from "react";

const Folk = props => {
  let misses = props.missedLetters.length;
  let hangedParts = [];
  const folkParts = [
    <img
      className="gallows"
      src="https://s18.postimg.org/du9y0kzol/bar_1.png"
      // style={misses > 1 ? { position: "relative" } : { position: "initial" }}
    />,
    <img className="head" src="https://s18.postimg.org/iipxvrov9/head.png" />,
    <img className="neck" src="https://s18.postimg.org/hzkumhxgl/neck.png" />,
    <img
      className="corpus"
      src="https://s18.postimg.org/yfopshh9h/corpus.png"
    />,
    <img
      className="left-arm"
      src="https://s18.postimg.org/le312msv9/left_arm.png"
    />,
    <img
      className="left-hand"
      src="https://s18.postimg.org/wszi7957p/left_hand.png"
    />,
    <img
      className="right-arm"
      src="https://s18.postimg.org/z1doolcbp/right_arm.png"
    />,
    <img
      className="right-hand"
      src="https://s18.postimg.org/61nvmcj39/right_hand.png"
    />,
    <img
      className="left-leg"
      src="https://s18.postimg.org/ergd9gb6t/left_leg.png"
    />,
    <img
      className="left-foot"
      src="https://s18.postimg.org/ggpghiqw5/left_foot.png"
    />,
    <img
      className="right-leg"
      src="https://s18.postimg.org/hs1t3qbvp/right_leg.png"
    />,
    <img
      className="right-foot"
      src="https://s18.postimg.org/soyjer99h/right_foot.png"
    />
  ];

  for (let i = 0; i < misses; i++) {
    hangedParts.push(folkParts[i]);
  }

  return <div className="folk">{hangedParts}</div>;
};

export default Folk;
