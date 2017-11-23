// THIS IS WORKING EXAMPLE. LET'S DIVIDE IT INTO PARTS!

import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './App.css';

export default class Hangman extends React.Component {
  constructor(props) {
    super(props);
    this.getLetters = this.getLetters.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.pushUniqueLetters = this.pushUniqueLetters.bind(this)
   // this.pushLetters = this.pushLetters.bind(this)
    this.checkScore = this.checkScore.bind(this)
    this.onReset = this.onReset.bind(this)
    this.state = {letters: [],
                  uniqueLetters: [],
                  correctLetters: [],
                  missedLetters: [],
                  gameScore: false};
  }

  /**
  * Adds keyDown event
  */    
  
  componentDidMount() {
    this.getLetters();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  
  /**
  * Catches keyDown event
  * Validates for letters and dashes
  */  

  handleKeyDown(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode === 189) {
      this.pushLetters(e.key.toUpperCase())
      console.log(e.key.toUpperCase())
    }
  }
  
  /**
  * Api call for random word
  * Pushes word to this.state.letters and this.state.uniqueLetters
  */
  
  getLetters() {
    return fetch('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=11&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5').then(function(response) {
      return response.json();
    }).then((data) => {
      let upcaseWord = data.word.toUpperCase()
      this.setState({letters: upcaseWord});
      this.pushUniqueLetters(upcaseWord)
    });
  }

  pushUniqueLetters(word) {
    if (word) {
      for (let i = 0; i < word.length; i++) {
        if (!this.state.uniqueLetters.includes(word[i])) {
          this.state.uniqueLetters.push(word[i])
          this.setState({
            uniqueLetters: this.state.uniqueLetters
          })
        }
      }
    }
  }
  
  pushLetters = (letter) => {
    const FOLKPARTS = 12;
    let letters = this.state.letters;
    let missedLetters = this.state.missedLetters;
    let correctLetters = this.state.correctLetters;
    let uniqueLetters = this.state.uniqueLetters;
    if (letters.length == 0) {return;}
    if (!missedLetters.includes(letter) && !letters.includes(letter) && missedLetters.length < FOLKPARTS) {
      missedLetters.push(letter)
      this.setState({
        missedLetters: missedLetters
      });
    } else if (!correctLetters.includes(letter) && letters.includes(letter)) {
      correctLetters.push(letter)
      this.setState({
        correctLetters: correctLetters
      })
    }
    this.checkScore(missedLetters, correctLetters, uniqueLetters)
  }
  
  
  checkScore(missedLetters, correctLetters, uniqueLetters) {
    let gameScore = this.state.gameScore
    if (missedLetters.length > 11 && gameScore !== 'YOU WON!') {
      gameScore = "GAME OVER";
      this.setState({
        gameScore: gameScore
      })
    } else if (correctLetters.length === uniqueLetters.length && uniqueLetters.length > 1) {
      gameScore = "YOU WON!";
      this.setState({
        gameScore: gameScore
      })      
    }
  }
  
  onReset() {
    this.setState({letters: [],
                  uniqueLetters: [],
                  correctLetters: [],
                  missedLetters: [],
                  gameScore: false});
    this.getLetters();
  }
  
  render() {
    let missedLetters = this.state.missedLetters;
    return (
      <div className="game-wrapper">
        {this.state.gameScore !== false && <GameFinished gameScore={this.state.gameScore}
                                             onReset={this.onReset}/>}
        <Folk missedLetters={missedLetters} />
        <MissedLetters missedLetters={missedLetters}/>
        <WordBox missedLetters={missedLetters}
                 correctLetters={this.state.correctLetters}
                 letters={this.state.letters} />
      </div>
    )
  }
}

const GameFinished = (props) => (
    <div className="game-score">
      <div className="reset-section">
        <h1 className="score">{props.gameScore}</h1>
        <button className="play-again" onClick={props.onReset}><b>NEW WORD</b></button>
      </div>
    </div>
  )


const WordBox = (props) => {
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

const Folk = (props) => {
  let misses = props.missedLetters.length
  let hangedParts = [];
  const folkParts = [
    <img className="gallows" src="https://s18.postimg.org/du9y0kzol/bar_1.png"/>,
    <img className="head" src="https://s18.postimg.org/iipxvrov9/head.png"/>,
    <img className="neck" src="https://s18.postimg.org/hzkumhxgl/neck.png"/>,
    <img className="corpus" src="https://s18.postimg.org/yfopshh9h/corpus.png"/>,
    <img className="left-arm" src="https://s18.postimg.org/le312msv9/left_arm.png"/>,
    <img className="left-hand" src="https://s18.postimg.org/wszi7957p/left_hand.png"/>,
    <img className="right-arm" src="https://s18.postimg.org/z1doolcbp/right_arm.png"/>,
    <img className="right-hand" src="https://s18.postimg.org/61nvmcj39/right_hand.png"/>,
    <img className="left-leg" src="https://s18.postimg.org/ergd9gb6t/left_leg.png"/>,
    <img className="left-foot" src="https://s18.postimg.org/ggpghiqw5/left_foot.png"/>,
    <img className="right-leg" src="https://s18.postimg.org/hs1t3qbvp/right_leg.png"/>,
    <img className="right-foot" src="https://s18.postimg.org/soyjer99h/right_foot.png"/>
  ];
  
  for (let i=0; i < misses; i++) {
    hangedParts.push(folkParts[i])
  }
   
  return (
    <div className="folk">
      {hangedParts}
    </div>
  );
}

const MissedLetters = (props) => (
    <div className="missed-letters-box">
      <h3>You missed:</h3>
      <h2 className="missed-letters">{props.missedLetters}</h2>
    </div>
  );

