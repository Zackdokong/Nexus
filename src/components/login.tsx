import "./login.css";
import Header from "./header";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router의 useNavigate 훅
import supabase from "../../supabase";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // 리다이렉션을 위해 useNavigate 훅 사용

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("비밀번호 혹은 이메일이 다릅니다");
      setSuccess("");
    } else {
      setSuccess("로그인 성공! 환영합니다.");
      setError("");
      setEmail("");
      setPassword("");

      // 2초 후 홈으로 리다이렉션
      setTimeout(() => {
        navigate("/");
      }, 0);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <h2 className="login-title">로그인</h2>
        <form className="login-form" onSubmit={handleLogIn}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <label>
            이메일:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </label>
          <label>
            비밀번호:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        <p className="signup-link">
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </p>
      </div>
    </>
  );
}

export default LogIn;
