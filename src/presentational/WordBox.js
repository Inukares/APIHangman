import React from 'react';

const WordBox = props => {
    const BOXESCOUNT = 11
    let letters = props.letters
    let correctLetters = props.correctLetters
    let boxes = [];
    let emptyBoxes = [];
    let letterBoxes = [];
    let lettersCount = letters.length;
    let emptyBoxesCount = BOXESCOUNT - lettersCount;
    for (let i=0; i < emptyBoxesCount; i++) {
      emptyBoxes.push("")
    }
    emptyBoxes = emptyBoxes.map((box) => {
      return <div className="empty-letter-box"></div>
    })
    for (let i=0; i < lettersCount; i++) {
      letterBoxes.push(<div className="letter-box"></div>)
      for (let j=0; j < correctLetters.length; j++) {
        if (letters[i].includes(correctLetters[j])) {
          letterBoxes[i] = <div className="letter-box"><div className="correct-letter">{correctLetters[j]}</div></div>
        }
      }
    }
    boxes = [].concat(emptyBoxes, letterBoxes);
  
    return <div className="word-box">{boxes}</div>
}

export default WordBox;
