import { useState, useEffect } from 'react';
import './header.css';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../supabase';

function Header() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user } = session;
        setUser(user); // 세션에서 사용자 정보 저장
      } else {
        setUser(null);
      }
    };

    getUser(); //절대로 건들지 말것, getUser 이거 나도 왜 되는지 모르겠음

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };
  const handleSearch = () => {
    if (searchQuery.trim() === "") return; // 빈 검색어 무시
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // 검색어와 함께 /search로 이동
  };
  return (
    <div className="wrapper">
      <div className="logo-wrapper">
        <Link to="/" className="logo"><h1>NEXUS</h1></Link>
      </div>
      <div className="search-wrapper">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="검색어를 입력하세요..." 
          onChange={(e) => setSearchQuery(e.target.value)} // 검색어 상태 갱신
        />
        <button className="search-button" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
      {
        user ? (
          <div className="account-wrapper">
            <h2 className="welcome">
              환영합니다, {user.user_metadata?.displayName || user.email}님!
            </h2>
            <h2 className="logout" onClick={handleLogout}>로그아웃</h2>
          </div>
        ) : (
          <div className="account-wrapper">
            <Link to="/login" className="login"><h2>로그인</h2></Link>
            <Link to="/signup" className="signup"><h2>회원가입</h2></Link>
          </div>
        )
      }
    </div>
  );
}

export default Header;