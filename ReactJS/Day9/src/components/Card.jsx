import React from "react";

const Card = ({name,dec}) => {
  return (
    <div className="Card">
      <h1>{name}</h1>
      <p>
        {dec}
      </p>
    </div>
  );
};

export default Card;
