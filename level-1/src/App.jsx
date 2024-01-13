import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);

  const addNew = (adding) => {
    setData([...data, { add: adding }]);
  };
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home data={data} setData={setData} />} />
      </Routes>
    </div>
  );
};

export default App;
