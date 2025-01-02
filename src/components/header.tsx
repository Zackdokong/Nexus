import './header.css';
import { FaSearch } from 'react-icons/fa'; // Font Awesome 아이콘
import { Link } from 'react-router-dom'; // Link를 추가

function Header() {
  return (
    <>
      <div className="wrapper">
        <div className="logo-wrapper">
          <Link to="/" className="logo"><h1>NEXUS</h1></Link> {/* 로고 클릭 시 홈으로 이동 */}
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
          <h2 className="login">로그인</h2>
          {/* 회원가입 버튼에 Link 추가 */}
          <Link to="/signup" className="signup"><h2>회원가입</h2></Link>
        </div>
      </div>
    </>
  );
}

export default Header;
