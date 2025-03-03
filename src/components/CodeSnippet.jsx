import React, { useState, useRef } from 'react';
import '../styles/code.css'; // Import your CSS file

const CodeSnippet = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef(null);

  const handleCopyClick = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(codeRef.current.innerText)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        })
        .catch((error) => {
          console.error('Failed to copy: ', error);
          // Handle error, maybe show a message to the user
        });
    }
  };

  return (
    <div className="code-snippet-container">
      <div className="code-header">
        <span className="language-tag">{language}</span> {/* Display language */}
        <button className="copy-button" onClick={handleCopyClick} disabled={isCopied}>
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={`code-block language-${language}`} ref={codeRef}>
        <code>{code}</code> {/* Use <code> for proper formatting */}
      </pre>
    </div>
  );
};

export default CodeSnippet;