import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './mainpage';
import SignUp from './components/signup'
import LogIn from './components/login'
import WritePost from './components/posts/write'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/write" element={<WritePost />}></Route>
      </Routes>
    </Router>
  );
}

export default App
