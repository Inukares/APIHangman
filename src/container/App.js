import React, { Component } from "react";
import ReactDOM from "react-dom";
import GameFinished from "../presentational/GameFinished.js";
import WordBox from "../presentational/WordBox.js";
import Folk from "../presentational/Folk.js";
import CorrectPassword from "../presentational/CorrectPassword.js";
import "../css/App.css";
import LetterBoxes from "../presentational/LetterBoxes.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: [],
      uniqueLetters: [],
      correctLetters: [],
      missedLetters: [],
      hyphenedPassword: [],
      gameScore: false
    };
  }

  /**
   * Adds keyDown event
   */

  componentDidMount() {
    this.getLetters();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  /**
   * Catches keyDown event
   * Validates for letters and dashes
   */

  handleKeyDown = e => {
    if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 189) {
      this.pushLetters(e.key.toUpperCase());
      console.log(e.key.toUpperCase());
    }
  };

  /**
   * Api call for random word
   * Pushes word to this.state.letters and this.state.uniqueLetters
   */

  getLetters = () => {
    return fetch(
      "https://api.wordnik.com/v4/words.json/randomWord?&minLength=3&maxLength=11&hasDictionaryDef=true&api_key=48dd829661f515d5abc0d03197a00582e888cc7da2484d5c7"
    )
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        let upcaseWord = data.word.toUpperCase();
        this.setState({
          letters: upcaseWord,
          isLoaded: true
        });
        this.pushUniqueLetters(upcaseWord);
        this.replaceLettersWithDash();
      });
  };

  pushUniqueLetters = word => {
    if (word) {
      for (let i = 0; i < word.length; i++) {
        if (!this.state.uniqueLetters.includes(word[i])) {
          this.state.uniqueLetters.push(word[i]);
          this.setState({
            uniqueLetters: this.state.uniqueLetters
          });
        }
      }
    }
  };

  pushLetters = letter => {
    const FOLKPARTS = 12;
    let letters = this.state.letters;
    let missedLetters = this.state.missedLetters;
    let correctLetters = this.state.correctLetters;
    let uniqueLetters = this.state.uniqueLetters;
    if (letters.length === 0) {
      return;
    }
    if (
      !missedLetters.includes(letter) &&
      !letters.includes(letter) &&
      missedLetters.length < FOLKPARTS
    ) {
      missedLetters.push(letter);
      this.setState({
        missedLetters: missedLetters
      });
    } else if (!correctLetters.includes(letter) && letters.includes(letter)) {
      correctLetters.push(letter);
      this.setState({
        correctLetters: correctLetters
      });
    }
    this.replaceLettersWithDash();
    this.checkScore(missedLetters, correctLetters, uniqueLetters);
  };

  checkScore = (missedLetters, correctLetters, uniqueLetters) => {
    let gameScore = this.state.gameScore;
    if (missedLetters.length > 11 && gameScore !== "YOU WON!") {
      gameScore = `GAME OVER \n THE PASSWORD WAS: ${this.state.letters}`;
      document.removeEventListener("keydown", this.handleKeyDown);
    } else if (
      correctLetters.length === uniqueLetters.length &&
      uniqueLetters.length > 1
    ) {
      gameScore = "YOU WON!";
      document.removeEventListener("keydown", this.handleKeyDown);
    }
    this.setState({
      gameScore
    });
  };

  onResetEnter = event => {
    if (event.key === "Enter") {
      this.setState({
        letters: [],
        uniqueLetters: [],
        correctLetters: [],
        missedLetters: [],
        hyphenedPassword: [],
        gameScore: false
      });
      this.getLetters();
      document.addEventListener("keydown", this.handleKeyDown);
    }
  };

  onReset = () => {
    this.setState({
      letters: [],
      uniqueLetters: [],
      correctLetters: [],
      missedLetters: [],
      hyphenedPassword: [],
      gameScore: false
    });
    this.getLetters();
    document.addEventListener("keydown", this.handleKeyDown);
  };

  replaceLettersWithDash = () => {
    const wordArray = this.state.letters;
    const correctWordArray = this.state.correctLetters;
    const lastAddedCorrectWord = correctWordArray.length - 1;
    const hyphenedPassword = this.state.hyphenedPassword; // it's a const !
    const checkIfLetter = /^[a-zA-Z]+$/;
    if (hyphenedPassword.length == false) {
      for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === correctWordArray[lastAddedCorrectWord]) {
          hyphenedPassword[i] = correctWordArray[lastAddedCorrectWord];
        } else {
          hyphenedPassword[i] = "-";
        }
      }
    } else {
      for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === correctWordArray[lastAddedCorrectWord]) {
          hyphenedPassword[i] = correctWordArray[lastAddedCorrectWord];
        } else if (hyphenedPassword[i].match(checkIfLetter)) {
          // do nth
        } else {
          hyphenedPassword[i] = "-";
        }
      }
    }
    this.setState({
      hyphenedPassword
    });
  };

  render() {
    const {
      missedLetters,
      correctLetters,
      letters,
      gameScore,
      isLoaded,
      uniqueLetters,
      hyphenedPassword
    } = this.state;
    console.log(this.state);
    return (
      <div id={isLoaded ? "hangman" : ""}>
        <div className="game-wrapper">
          {gameScore !== false && (
            <GameFinished
              gameScore={gameScore}
              onReset={this.onReset}
              onKeyPress={this.onResetEnter}
            />
          )}
          {isLoaded && (
            <div>
              <CorrectPassword hyphenedPassword={hyphenedPassword} />
              <div>
                <Folk missedLetters={missedLetters} />
              </div>
              <LetterBoxes
                missedLetters={missedLetters}
                correctLetters={correctLetters}
                uniqueLetters={uniqueLetters}
                onLetterClick={this.pushLetters}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

// TO ADD: DISABLE ADDING LETTERS AFTER END SCREEN (should be easy)

// modify styling a bit

// Perhaps prevent updating component if letters repeat

// while loading (this.state.loaded === false) display loading bar, if loaded -> go on with whole app

// app working with bad looks of fetching data, above will be my trying to fix that

/* 
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: [],
      uniqueLetters: [],
      correctLetters: [],
      missedLetters: [],
      hyphenedPassword: [],
      gameScore: false
    };
  }

  /**
  * Adds keyDown event
  */
/* deletede if needed
  componentDidMount() {
    this.getLetters();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  /**
  * Catches keyDown event
  * Validates for letters and dashes
  */
/* // delete if needed
  handleKeyDown = e => {
    if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 189) {
      this.pushLetters(e.key.toUpperCase());
      console.log(e.key.toUpperCase());
    }
  };

  /**
  * Api call for random word
  * Pushes word to this.state.letters and this.state.uniqueLetters
  */
/* // delete if needed
  getLetters = () => {
    return fetch(
      "https://api.wordnik.com/v4/words.json/randomWord?&minLength=3&maxLength=11&hasDictionaryDef=true&api_key=48dd829661f515d5abc0d03197a00582e888cc7da2484d5c7"
    )
      .then(function(response) {
        return response.json();
      })
      .then(data => {
        //let upcaseWord = data.word.toUpperCase()
        let upcaseWord = data.word.toUpperCase();
        this.setState({
          letters: upcaseWord,
          isLoaded: true
        });
        this.pushUniqueLetters(upcaseWord);
        this.replaceLettersWithDash();
      });
  };

  pushUniqueLetters = word => {
    if (word) {
      for (let i = 0; i < word.length; i++) {
        if (!this.state.uniqueLetters.includes(word[i])) {
          this.state.uniqueLetters.push(word[i]);
          this.setState({
            uniqueLetters: this.state.uniqueLetters
          });
        }
      }
    }
  };

  pushLetters = letter => {
    const FOLKPARTS = 12;
    let letters = this.state.letters;
    let missedLetters = this.state.missedLetters;
    let correctLetters = this.state.correctLetters;
    let uniqueLetters = this.state.uniqueLetters;
    if (letters.length === 0) {
      return;
    }
    if (
      !missedLetters.includes(letter) &&
      !letters.includes(letter) &&
      missedLetters.length < FOLKPARTS
    ) {
      missedLetters.push(letter);
      this.setState({
        missedLetters: missedLetters
      });
    } else if (!correctLetters.includes(letter) && letters.includes(letter)) {
      correctLetters.push(letter);
      this.setState({
        correctLetters: correctLetters
      });
    }
    this.replaceLettersWithDash();
    this.checkScore(missedLetters, correctLetters, uniqueLetters);
  };

  checkScore = (missedLetters, correctLetters, uniqueLetters) => {
    let gameScore = this.state.gameScore;
    if (missedLetters.length > 11 && gameScore !== "YOU WON!") {
      gameScore = "GAME OVER";
    } else if (
      correctLetters.length === uniqueLetters.length &&
      uniqueLetters.length > 1
    ) {
      gameScore = "YOU WON!";
    }
    this.setState({
      gameScore
    });
  };

  onReset = () => {
    this.setState({
      letters: [],
      uniqueLetters: [],
      correctLetters: [],
      missedLetters: [],
      hyphenedPassword: [],
      gameScore: false
    });
    this.getLetters();
  };

  replaceLettersWithDash = () => {
    const wordArray = this.state.letters;
    const correctWordArray = this.state.correctLetters;
    const lastAddedCorrectWord = correctWordArray.length - 1;
    const hyphenedPassword = this.state.hyphenedPassword; // it's a const !
    const checkIfLetter = /^[a-zA-Z]+$/;
    if (hyphenedPassword.length == false) {
      for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === correctWordArray[lastAddedCorrectWord]) {
          hyphenedPassword[i] = correctWordArray[lastAddedCorrectWord];
        } else {
          hyphenedPassword[i] = "-";
        }
      }
    } else {
      for (let i = 0; i < wordArray.length; i++) {
        if (wordArray[i] === correctWordArray[lastAddedCorrectWord]) {
          hyphenedPassword[i] = correctWordArray[lastAddedCorrectWord];
        } else if (hyphenedPassword[i].match(checkIfLetter)) {
          // do nth
        } else {
          hyphenedPassword[i] = "-";
        }
      }
    }
    this.setState({
      hyphenedPassword
    });
  };

  render() {
    const {
      missedLetters,
      correctLetters,
      letters,
      gameScore,
      isLoaded,
      uniqueLetters,
      hyphenedPassword
    } = this.state;
    console.log(this.state);
    return (
      <div id={isLoaded ? "hangman" : ""}>
        <div className="game-wrapper">
          {gameScore !== false && (
            <GameFinished gameScore={gameScore} onReset={this.onReset} />
          )}
          {isLoaded && (
            <div>
              <CorrectPassword
                hyphenedPassword={hyphenedPassword}
                //  style={
                //   missedLetters.length > 1 ? { height: "" } : { height: "86px" }
                // }
              />
              <Folk missedLetters={missedLetters} />
              <LetterBoxes
                missedLetters={missedLetters}
                correctLetters={correctLetters}
                uniqueLetters={uniqueLetters}
                onLetterClick={this.pushLetters}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
*/
