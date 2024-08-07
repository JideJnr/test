import { BrowserRouter as Router } from "react-router-dom";
import { Spin } from "antd";
import { Suspense } from "react";

import Routes from "@/routes/routes";

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col justify-center items-center">
          <Spin size="large" className="text-5xl" />
        </div>
      }
    >
      <Router>
        <Routes />
      </Router>
    </Suspense>
  );
};

export default App;
