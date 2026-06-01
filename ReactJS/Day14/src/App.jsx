import React, { useState } from "react";

const App = () => {
  
  const [title,setTitle] = useState("HI")

  const changed = () =>{
    setTitle("Hey")
  }
  return (
    <>
    <p>{title}</p>
    <button onClick={changed}>Click ME</button>      
    </>
  );
};

export default App;
