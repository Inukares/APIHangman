import React, { Component } from "react";

export class LetterBoxes extends Component {
  constructor(props) {
    super(props);
  }

  displayProperStyling = char => {
    if (this.props.correctLetters.indexOf(char) !== -1) {
      return "disabled correct";
    } else if (this.props.missedLetters.indexOf(char) !== -1) {
      return "disabled";
    } else {
      return "";
    }
  };

  appendDivAndStyle = alphabet => {
    const styledLetter = alphabet.map(singleLetter => (
      <div
        className={this.displayProperStyling(singleLetter)}
        onClick={() => this.props.onLetterClick(singleLetter)}
      >
        {singleLetter}
      </div>
    ));
    return <div className="letters">{styledLetter}</div>;
  };

  render() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return this.appendDivAndStyle(alphabet);
  }
}

export default LetterBoxes;
