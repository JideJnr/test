import React from "react";
import { Link } from "react-router-dom";

const Error: React.FC = () => {
  return (
    <div>
      <h1>Error Page</h1>
      <Link to={"/"}>Go home</Link>
    </div>
  );
};

export default Error;
