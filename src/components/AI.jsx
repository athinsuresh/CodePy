import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/AI.css";

const GOOGLE_API_KEY = "AIzaSyCxK5DTiWI_RFT-UYNnPCPXR6R61gJ2RJc";
const API_REQUEST_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`;

function AIChat() {
  const [currentUserMessage, setCurrentUserMessage] = useState(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLightTheme, setIsLightTheme] = useState(localStorage.getItem("themeColor") === "light_mode");

  // Load saved chat history from localStorage
  useEffect(() => {
    const savedConversations = JSON.parse(localStorage.getItem("saved-api-chats")) || [];
    setChatHistory(savedConversations);
    document.body.classList.toggle("light_mode", isLightTheme);
  }, [isLightTheme]);

  // Show typing effect
  const showTypingEffect = (rawText, htmlText, messageElement, incomingMessageElement, skipEffect = false) => {
    const copyIconElement = incomingMessageElement.querySelector(".message__icon");
    copyIconElement.classList.add("hide"); // Initially hide copy button

    if (skipEffect) {
      // Display content directly without typing
      messageElement.innerHTML = htmlText;
      hljs.highlightAll();
      addCopyButtonToCodeBlocks();
      copyIconElement.classList.remove("hide"); // Show copy button
      setIsGeneratingResponse(false);
      return;
    }

    const wordsArray = rawText.split(' ');
    let wordIndex = 0;

    const typingInterval = setInterval(() => {
      messageElement.innerText += (wordIndex === 0 ? '' : ' ') + wordsArray[wordIndex++];
      if (wordIndex === wordsArray.length) {
        clearInterval(typingInterval);
        setIsGeneratingResponse(false);
        messageElement.innerHTML = htmlText;
        hljs.highlightAll();
        addCopyButtonToCodeBlocks();
        copyIconElement.classList.remove("hide");
      }
    }, 75);
  };

  // Fetch API response based on user input
  const requestApiResponse = async (incomingMessageElement) => {
    const messageTextElement = incomingMessageElement.querySelector(".message__text");

    try {
      const response = await fetch(API_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: currentUserMessage }] }]
        }),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error.message);

      const responseText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) throw new Error("Invalid API response.");

      const parsedApiResponse = marked.parse(responseText);
      const rawApiResponse = responseText;

      showTypingEffect(rawApiResponse, parsedApiResponse, messageTextElement, incomingMessageElement);

      // Save conversation in localStorage
      const updatedChatHistory = [...chatHistory, { userMessage: currentUserMessage, apiResponse: responseData }];
      localStorage.setItem("saved-api-chats", JSON.stringify(updatedChatHistory));
      setChatHistory(updatedChatHistory);
    } catch (error) {
      setIsGeneratingResponse(false);
      messageTextElement.innerText = error.message;
      messageTextElement.closest(".message").classList.add("message--error");
    } finally {
      incomingMessageElement.classList.remove("message--loading");
    }
  };

  // Add copy button to code blocks
  const addCopyButtonToCodeBlocks = () => {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach((block) => {
      const codeElement = block.querySelector('code');
      let language = [...codeElement.classList].find(cls => cls.startsWith('language-'))?.replace('language-', '') || 'Text';

      const languageLabel = document.createElement('div');
      languageLabel.innerText = language.charAt(0).toUpperCase() + language.slice(1);
      languageLabel.classList.add('code__language-label');
      block.appendChild(languageLabel);

      const copyButton = document.createElement('button');
      copyButton.innerHTML = `<i class='bx bx-copy'></i>`;
      copyButton.classList.add('code__copy-btn');
      block.appendChild(copyButton);

      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
          copyButton.innerHTML = `<i class='bx bx-check'></i>`;
          setTimeout(() => copyButton.innerHTML = `<i class='bx bx-copy'></i>`, 2000);
        }).catch(err => {
          console.error("Copy failed:", err);
          alert("Unable to copy text!");
        });
      });
    });
  };

  // Show loading animation during API request
  const displayLoadingAnimation = () => {
    const loadingHtml = `
      <div class="message__content">
        <img class="message__avatar" src="codepy_logo(1).PNG" alt="CodePy Avatar">
        <p class="message__text"></p>
        <div class="message__loading-indicator">
          <div class="message__loading-bar"></div>
          <div class="message__loading-bar"></div>
          <div class="message__loading-bar"></div>
        </div>
      </div>
      <span onClick="copyMessageToClipboard(this)" class="message__icon hide"><i class='bx bx-copy-alt'></i></span>
    `;

    const loadingMessageElement = createChatMessageElement(loadingHtml, "message--incoming", "message--loading");
    setChatHistory([...chatHistory, { userMessage: currentUserMessage, apiResponse: {} }]);
    requestApiResponse(loadingMessageElement);
  };

  // Create a new chat message element
  const createChatMessageElement = (htmlContent, ...cssClasses) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", ...cssClasses);
    messageElement.innerHTML = htmlContent;
    return messageElement;
  };

  // Handle sending chat messages
  const handleOutgoingMessage = () => {
    if (!currentUserMessage || isGeneratingResponse) return; // Exit if no message or already generating response

    setIsGeneratingResponse(true);

    const outgoingMessageHtml = `
      <div class="message__content">
        <img class="message__avatar" src="account.png" alt="User avatar">
        <p class="message__text"></p>
      </div>
    `;

    const outgoingMessageElement = createChatMessageElement(outgoingMessageHtml, "message--outgoing");
    outgoingMessageElement.querySelector(".message__text").innerText = currentUserMessage;
    setChatHistory([...chatHistory, { userMessage: currentUserMessage, apiResponse: {} }]);

    setCurrentUserMessage(""); // Clear input field
    setTimeout(displayLoadingAnimation, 500); // Show loading animation after delay
  };

  // Clear all chat history
  const clearChatHistory = () => {
    if (window.confirm("Are you sure you want to delete all chat history?")) {
      localStorage.removeItem("saved-api-chats");
      setChatHistory([]);
      setCurrentUserMessage(null);
      setIsGeneratingResponse(false);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isLightTheme ? "dark_mode" : "light_mode";
    localStorage.setItem("themeColor", newTheme);
    setIsLightTheme(!isLightTheme);
  };

  return (
    <div className={`chat-container ${isLightTheme ? "light_mode" : ""}`}>
      <nav className="navbar">
        <div className="navbar__logo">
          <a href="dash.html">
            <img src="codepy_logo(1).PNG" alt="Logo" className="logo" />
            CodePy AI Assistant
          </a>
        </div>
      </nav>

      <header className="header">
        <div className="header__title">
          <h1>Hello, There!</h1>
          <h2>How can I help you today?</h2>
        </div>
        <div className="suggests">
          {[
            "Give tips on learning Python",
            "Help me write an addition function in Python",
            "Give me phrases to learn a new language",
            "Show me how to learn Python skills hand by hand"
          ].map((text, index) => (
            <div className="suggests__item" key={index} onClick={() => setCurrentUserMessage(text)}>
              <p className="suggests__item-text">{text}</p>
              <div className="suggests__item-icon">
                <i className={`bx bx-${index % 2 === 0 ? 'stopwatch' : 'edit-alt'}`}></i>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="chat-history">
        {chatHistory.map((conversation, index) => (
          <div key={index} className={`message ${conversation.apiResponse ? 'message--incoming' : 'message--outgoing'}`}>
            <div className="message__content">
              <img className="message__avatar" src={conversation.apiResponse ? "codepy_logo(1).PNG" : "account.png"} alt="Avatar" />
              <p className="message__text">{conversation.userMessage}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          value={currentUserMessage || ""}
          onChange={(e) => setCurrentUserMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleOutgoingMessage}>Send</button>
      </div>

      <div className="theme-toggle" onClick={toggleTheme}>
        {isLightTheme ? <i className="bx bx-sun"></i> : <i className="bx bx-moon"></i>}
      </div>
    </div>
  );
}

export default AIChat;
