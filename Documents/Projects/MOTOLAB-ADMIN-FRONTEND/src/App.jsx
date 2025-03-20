import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/pageIndex";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        {/* REACT-TOASTIFY */}
        <ToastContainer />
      </div>      
    </>
  );
}

export default App;
