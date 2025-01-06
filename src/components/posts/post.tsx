import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../supabase";
import Header from "../header";
import "./post.css";

function PostPage() {
  const { id } = useParams<{ id: string }>(); // URL에서 게시글 ID 가져오기
  const [post, setPost] = useState<any>(null); // 게시글 상태
  const [comments, setComments] = useState<any[]>([]); // 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(""); // 에러 상태
  const [commentsError, setCommentsError] = useState(""); // 댓글 에러 상태

  useEffect(() => {
    const fetchPostAndComments = async () => {
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

      setPost(post);

      // 댓글 가져오기
      const { data: comments, error: commentsError } = await supabase
        .from("comment")
        .select("id, content, writer, created_at, post_id")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });
      if (commentsError) {
        setCommentsError("댓글을 불러오는 데 실패했습니다.");
      } else {
        setComments(comments || []);
      }

      setLoading(false);
    };

    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // 현재 로그인된 사용자 ID 가져오기
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("로그인 후 댓글을 작성할 수 있습니다.");
        return;
      }

      const { user } = session;

      // 댓글 추가
      const { data: comment, error } = await supabase
        .from("comment")
        .insert([{ post_id: id, content: newComment, writer: user.id }])
        .select()
        .single();

      if (error) {
        setError("댓글 작성 중 오류가 발생했습니다.");
        return;
      }

      // 새로운 댓글 리스트에 추가
      setComments((prevComments) => [...prevComments, comment]);
      setNewComment(""); // 입력창 초기화
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("예기치 못한 오류가 발생했습니다.");
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
          <p className="error-message">{error}</p>
        </div>
      </>
    );
  }
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
        <hr />
        <div className="comment-wrapper">
          <div className="comment-input">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <button onClick={handleAddComment}>댓글 작성</button>
          </div>
        </div>
        {commentsError && <p className="error-message">{commentsError}</p>}
          {comments.length > 0
            ? comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.content}</p>
                  <span>
                    {new Date(comment.created_at).toLocaleDateString()} 작성
                  </span>
                </div>
              ))
            : !commentsError && (
                <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
              )}
            <div></div>{/*아니 왜 이거 없으면 댓글 바닥 짤리냐 개빡치네*/}
      </div>
    </>
  );
}

export default PostPage;
