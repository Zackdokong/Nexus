import { useState, useEffect } from 'react'; // React Hooks
import './header.css';
import { FaSearch } from 'react-icons/fa'; // Font Awesome 아이콘
import { Link, useNavigate } from 'react-router-dom'; // Link 추가 및 useNavigate
import supabase from '../../supabase'

function Header() {
  const [user, setUser] = useState<any>(null); // 로그인된 사용자 상태
  const navigate = useNavigate(); // useNavigate 추가

  useEffect(() => {
    const getUser = async () => {
      // 로그인 상태인지 확인
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.auth.getUser();
        setUser(data); // 사용자 정보 저장
      } else {
        setUser(null); // 로그인되지 않은 경우 null 설정
      }
    };
  
    getUser();
  
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null); // 로그인 상태 변경 시 사용자 정보 갱신
      }
    );
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Supabase에서 로그아웃
    setUser(null); // 사용자 상태 초기화
    navigate('/'); // 로그아웃 후 로그인 페이지로 리디렉션
  };

  return (
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
      {
        user ? (
          <div className="account-wrapper">
            {/* 로그인된 사용자 정보 표시 */}
            <h2 className="welcome">환영합니다, {user?.metadata?.display_name || user?.email}</h2>
            <h2 className="logout" onClick={handleLogout}>로그아웃</h2> {/* 로그아웃 버튼 클릭 시 handleLogout 함수 호출 */}
          </div>
        ) : (
          <div className="account-wrapper">
            {/* 로그인되지 않은 경우 로그인 및 회원가입 버튼 표시 */}
            <Link to="/login" className="login"><h2>로그인</h2></Link>
            <Link to="/signup" className="signup"><h2>회원가입</h2></Link>
          </div>
        )
      }
    </div>
  );
}

export default Header;
