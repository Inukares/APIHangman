import React from "react";

// some weird stuff is going on here, gotta check how this freakin' letters are passed about!
export const CorrectPassword = props => {
  const style = {
    padding: "6px",
    marginBottom: "60px"
  };
  const revealedPassword = props.hyphenedPassword.map(singleLetter => (
    <span style={style}>{singleLetter}</span>
  ));
  return (
    <div>
      <h1>Your password:</h1>
      <h1 style={props.style}>{revealedPassword}</h1>
    </div>
  );
};

export default CorrectPassword;

// replace?
