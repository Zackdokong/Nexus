import "./signup.css";
import Header from "./header";
import { useState } from "react";
import supabase from "../../supabase"; // Supabase 클라이언트 가져오기

function SignUp() {
  const [nickname, setNickname] = useState(""); // 닉네임 상태 추가
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // Supabase Auth 회원가입 호출
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // displayName을 metadata로 추가
        data: {
          displayName: nickname,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNickname(""); // 닉네임 초기화
    }
  };

  return (
    <>
      <Header />
      <div className="signup-container">
        <h2 className="signup-title">회원가입</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          
          {/* 닉네임 입력 필드 */}
          <label>
            닉네임:
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
            />
          </label>

          {/* 이메일 입력 필드 */}
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

          {/* 비밀번호 입력 필드 */}
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

          {/* 비밀번호 확인 입력 필드 */}
          <label>
            비밀번호 확인:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </label>

          <button type="submit" className="signup-button">
            가입하기
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
