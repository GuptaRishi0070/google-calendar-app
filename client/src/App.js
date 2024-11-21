import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { getMonth } from "./util";
import GlobalContext from "./context/GlobalContext";
import GoogleSignIn from "./components/GoogleSignIn";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import EventModal from "./components/EventModal";

function CalendarApp() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}
      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={currenMonth} />
        </div>
      </div>
    </React.Fragment>
  );
}

function App() {
  const { user } = useContext(GlobalContext); // `user` state from GlobalContext

  return (
    <Router>
      <Routes>
        {/* Protected route for calendar app */}
        <Route path="/" element={user ? <CalendarApp /> : <Navigate to="/signin" />} />
        {/* Route for Google Sign-In */}
        <Route path="/signin" element={<GoogleSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
