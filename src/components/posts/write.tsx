import Header from "../header";
import "./write.css";
import { useState, useEffect } from "react";
import supabase from "../../../supabase";

function WritePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setWriter(session.user.id); // 사용자 UUID 저장
      } else {
        setWriter(null);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!writer) {
      setError("로그인 상태가 아닙니다. 로그인을 먼저 해주세요.");
      return;
    }

    try {
      const { error } = await supabase
        .from("post")
        .insert([
          {
            title: title,
            detail: content,
            writer: writer, // 작성자 UUID 추가
            like: 0,
            dislike: 0,
            view: 0,
          },
        ]);

      if (error) {
        setError("글 작성 중 오류가 발생했습니다.");
        console.error("Error:", error.message);
      } else {
        setSuccess("글 작성이 완료되었습니다!");
        setTitle("");
        setContent("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("예기치 못한 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <div className="write-container">
        <h2 className="write-title">새 글 작성</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form className="write-form" onSubmit={handleSubmit}>
          <label>
            제목:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </label>
          <label>
            내용:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              required
            />
          </label>
          <button type="submit" className="submit-button">
            작성 완료
          </button>
        </form>
      </div>
    </>
  );
}

export default WritePost;
