import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Trading Quiz Admin</h1>
      </div>
      <div className="header-right">
        <Link to="/">
          <button>Home</button>
        </Link>
        <Link to="/questions">
          <button>Questions</button>
        </Link>
        <Link to="/stats">
          <button>Stats</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
