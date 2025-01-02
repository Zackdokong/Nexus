import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './mainpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App
