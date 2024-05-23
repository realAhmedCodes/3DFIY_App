
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { User_SignUp } from './pages/User_SignUp';
import { Model_Upload } from './pages/Model_Upload';
import { Login } from './pages/Login';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/User_SignUp"
            element={<User_SignUp></User_SignUp>}
          ></Route>
          <Route
            path="/Model_Upload"
            element={<Model_Upload></Model_Upload>}
          ></Route>
          <Route
            path="/Login"
            element={<Login></Login>}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
