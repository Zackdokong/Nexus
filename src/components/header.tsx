import './header.css';
import { FaSearch } from 'react-icons/fa'; // Font Awesome 아이콘

function Header() {
  return (
    <>
      <div className="wrapper">
        <div className="logo-wrapper">
          <h1 className="logo">NEXUS</h1>
        </div>
        <div className="search-wrapper">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="검색어를 입력하세요..." 
          />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>
        <div className="account-wrapper">
          <h2 className="login">Log In</h2>
          <h2 className="signup">Sign Up</h2>
        </div>
      </div>
    </>
  );
}

export default Header;
