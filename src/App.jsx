import React from "react";
import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/Signup";
import Dashboard from "./components/dash";
import Account from "./components/accpage";
import SyllabusBeginner from "./components/syllabus_beginner";
import SyllabusIntermediate from "./components/syllabus_intermediate";
import SyllabusAdvanced from "./components/syllabus_advanced";
import Exercise1 from "./components/exercise1";
import Exercise2 from "./components/exercise2";
import Exercise3 from "./components/exercise3";
import Exercise4 from "./components/exercise4";
import Exercise5 from "./components/exercise5";
import Exercise6 from "./components/exercise6";
import Exercise7 from "./components/exercise7";
import Exercise8 from "./components/exercise8";
import Exercise9 from "./components/exercise9";
import Exercise10 from "./components/exercise10";
import Exercise11 from "./components/exercise11";
import Exercise21 from "./components/exercise21";
import Exercise22 from "./components/exercise22";
import Exercise23 from "./components/exercise23";
import Exercise24 from "./components/exercise24";
import Exercise25 from "./components/exercise25";
import Exercise31 from "./components/exercise31";
import Exercise32 from "./components/exercise32";
import Exercise33 from "./components/exercise33";
import Exercise34 from "./components/exercise34";
import Exercise35 from "./components/exercise35";
import Exercise36 from "./components/exercise36";

import Chatbot from "./components/Chatbot";

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
});
// Create a router instance with the future flag
const router = createBrowserRouter(
  
  [
    { path: "/", element: <SignUpPage /> },
    { path: "/login", element: <LoginPage setUser={setUser} /> },
    { path: "/dash", element: <Dashboard user={user} /> },
    { path: "/account", element: <Account /> },
    {path: "/syllabus-beginner", element: <SyllabusBeginner/>},
    {path: "/syllabus-intermediate", element: <SyllabusIntermediate />},
    {path: "/syllabus-advanced", element: <SyllabusAdvanced />},
    { path: "/exercise1", element: <Exercise1 /> },
    { path: "/exercise2", element: <Exercise2 /> },
    { path: "/exercise3", element: <Exercise3 /> },
    { path: "/exercise4", element: <Exercise4 /> },
    { path: "/exercise5", element: <Exercise5 /> },
    { path: "/exercise6", element: <Exercise6 /> },
    { path: "/exercise7", element: <Exercise7 /> },
    { path: "/exercise8", element: <Exercise8 /> },
    { path: "/exercise9", element: <Exercise9 /> },
    { path: "/exercise10", element: <Exercise10 /> },
    { path: "/exercise11", element: <Exercise11 /> },
    { path: "/exercise21", element: <Exercise21 /> },
    { path: "/exercise22", element: <Exercise22 /> },
    { path: "/exercise23", element: <Exercise23 /> },
    { path: "/exercise24", element: <Exercise24 /> },
    { path: "/exercise25", element: <Exercise25 /> },
    { path: "/exercise31", element: <Exercise31 /> },
    { path: "/exercise32", element: <Exercise32 /> },
    { path: "/exercise33", element: <Exercise33 /> },
    { path: "/exercise34", element: <Exercise34 /> },
    { path: "/exercise35", element: <Exercise35 /> },
    { path: "/exercise36", element: <Exercise36 /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // Enable v7 relative splat path behavior
    },
  }
);


  return <RouterProvider router={router} />;
}

export default App;
