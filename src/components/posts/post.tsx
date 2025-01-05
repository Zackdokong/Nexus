import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../supabase";
import Header from "../header";
import "./post.css";

function PostPage() {
  const { id } = useParams<{ id: string }>(); // URL에서 게시글 ID 가져오기
  const [post, setPost] = useState<any>(null); // 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(""); // 에러 상태

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      // 게시글 가져오기
      const { data: post, error: postError } = await supabase
        .from("post")
        .select("id, title, detail, like, dislike, view, created_at, writer")
        .eq("id", id)
        .single();

      if (postError) {
        setError("게시글을 불러오는 데 실패했습니다.");
        setLoading(false);
        return;
      }

      // 작성자 정보 가져오기
      const { data: writer, error: writerError } = await supabase
        .from("user")
        .select("display_name")
        .eq("user_id", post.writer)
        .single();

      if (writerError) {
        setError("작성자 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
        return;
      }

      // 조회수 증가
      await supabase
        .from("post")
        .update({ view: post.view + 1 })
        .eq("id", id);

      setPost({ ...post, writerNickname: writer?.display_name || "알 수 없음" });
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  // 좋아요 핸들러
  const handleLike = async () => {
    if (!post) return;

    const { error } = await supabase
      .from("post")
      .update({ like: post.like + 1 }) // 좋아요 1 증가
      .eq("id", id);

    if (error) {
      console.error("좋아요 처리 중 오류:", error.message);
    } else {
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        like: prevPost.like + 1,
      }));
    }
  };

  // 싫어요 핸들러
  const handleDislike = async () => {
    if (!post) return;

    const { error } = await supabase
      .from("post")
      .update({ dislike: post.dislike + 1 }) // 싫어요 1 증가
      .eq("id", id);

    if (error) {
      console.error("싫어요 처리 중 오류:", error.message);
    } else {
      setPost((prevPost: typeof post) => ({
        ...prevPost,
        dislike: prevPost.dislike + 1,
      }));
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="post-container">
          <p>로딩 중...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="post-container">
          <p className="error-message">존재하지 않는 게시물입니다.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="post-container">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span>작성자: {post.writerNickname}</span>
          <span>조회수: {post.view}</span>
          <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <div className="post-detail">
          <p>{post.detail}</p>
        </div>
        <div className="post-actions">
          <button className="like-button" onClick={handleLike}>
            좋아요 {post.like}
          </button>
          <div className="like-dislike-bar">
            <div
              className="like-ratio"
              style={{
                width: `${
                  post.like + post.dislike === 0
                    ? 50
                    : (post.like / (post.like + post.dislike)) * 100
                }%`,
                height: "10px",
                backgroundColor: "#1da1f2",
                position: "absolute",
                left: 0,
              }}
            />
          </div>
          <button className="dislike-button" onClick={handleDislike}>
            싫어요 {post.dislike}
          </button>
        </div>
      </div>
    </>
  );
}

export default PostPage;
