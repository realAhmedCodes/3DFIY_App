import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { User_SignUp } from './pages/User_SignUp';
import { Model_Upload } from './pages/Model_Upload';
import { Login } from './pages/Login';
import { ViewModel } from './pages/ViewModel';
import { DesignerProfile } from './pages/DesignerProfile';
import { ModelDetail } from './pages/ModelDetail';
import { UpdateModel } from './Management/UpdateModel';
import { Home } from './pages/Home';
import { ModelCal } from './pages/ModelCal';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<ModelCal />} />
          <Route path="/User_SignUp" element={<User_SignUp />} />
          <Route path="/Model_Upload" element={<Model_Upload />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ViewModels" element={<ViewModel />} />
          <Route path="/DesignerProfile" element={<DesignerProfile />} />
          <Route path="/model/:modelId" element={<ModelDetail />} />
          <Route path="/updateModel/:modelId" element={<UpdateModel />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
