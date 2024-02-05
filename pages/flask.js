import React, { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const runRecon = () => {
    fetch("http://0.0.0.0:5001/run-recon")
      .then((response) => response.text())
      .then((text) => {
        const data = JSON.parse(text);
        setMessage(data.message);
        console.log(data);
      });
  };

  return (
    <div>
      <h1>Response from Flask:</h1>
      <button onClick={runRecon}>Run Recon</button>
      <p>{message}</p>
    </div>
  );
}
