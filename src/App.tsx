import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './mainpage';
import SignUp from './components/signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
      </Routes>
    </Router>
  );
}

export default App
