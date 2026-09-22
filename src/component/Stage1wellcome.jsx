import React, { useState } from "react";

export default function Stage1wellcome({ onComplete }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Allowed names (case-insensitive for English, exact for Urdu)
  const allowedNames = ["muqaddas", "muqadas", "مقدس"];

  const isValidName = (input) => {
    const trimmed = input.trim().toLowerCase();
    return allowedNames.includes(trimmed) || input.trim() === "مقدس";
  };

  const handleContinue = () => {
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!isValidName(name)) {
      setError("Sorry, this surprise is not for you. ❌");
      return;
    }

    localStorage.setItem("loveName", name.trim());

    onComplete && onComplete();
  };

  return (
    <>
      <style>{`
        .stage1-container{
          font-family:Poppins,sans-serif;
          text-align:center;
          color:#fff;
        }

        .stage1-container h1{
          margin-bottom:15px;
          font-size:2.5rem;
        }

        .stage1-container p{
          margin-bottom:25px;
        }

        .stage1-container input{
          width:100%;
          padding:15px;
          border:none;
          border-radius:12px;
          outline:none;
          margin-bottom:15px;
          box-sizing:border-box;
          font-family:Poppins,sans-serif;
        }

        .stage1-container button{
          width:100%;
          padding:15px;
          border:none;
          border-radius:12px;
          background:#ff4d6d;
          color:#fff;
          cursor:pointer;
          font-size:16px;
          font-weight:600;
        }

        .stage1-container .error{
          color:#ffb3c1;
          margin-bottom:15px;
          font-size:14px;
          font-weight:500;
        }

        @media(max-width:480px){
          .stage1-container h1{
            font-size:2rem;
          }
        }
      `}</style>

      <div className="stage1-container">
        <h1>Welcome ❤️</h1>

        <p>Mere paas aap ke liye ek chhota sa surprise hai...</p>

        <input
          type="text"
          placeholder="Apna naam likhiye..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
        />

        {error && <div className="error">{error}</div>}

        <button onClick={handleContinue}>Continue</button>
      </div>
    </>
  );
}