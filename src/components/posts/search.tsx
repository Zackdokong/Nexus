import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import supabase from "../../../supabase";
import Header from "../header";
import "./search.css";

function SearchPage() {
  const [posts, setPosts] = useState<any[]>([]); // 검색된 게시물 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [searchParams, setSearchParams] = useSearchParams(); // URL에서 검색어 가져오기
  const [totalPosts, setTotalPosts] = useState(0); // 총 게시물 수
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  ); // 현재 페이지
  const query: string = searchParams.get("query") || ""; // 검색어 타입 명시

  const POSTS_PER_PAGE = 10; // 페이지당 게시물 수

  useEffect(() => {
    const fetchPosts = async () => {
      if (!query.trim()) return; // 빈 검색어 무시
      setLoading(true);

      // 총 게시물 수 가져오기
      const { count } = await supabase
        .from("post")
        .select("id", { count: "exact" })
        .ilike("title", `%${query}%`);
      setTotalPosts(count || 0);

      // 게시물 가져오기
      const { data: posts, error } = await supabase
        .from("post")
        .select("id, title, detail, like, view, created_at, writer")
        .ilike("title", `%${query}%`)
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1);

      if (error) {
        console.error("Error fetching posts:", error.message);
        setPosts([]);
        setLoading(false);
        return;
      }

      // 작성자 정보를 users 테이블에서 가져오기
      const uniqueWriters = [...new Set(posts.map((post) => post.writer))]; // 고유 작성자 ID
      const { data: writers, error: writerError } = await supabase
        .from("users") // users 테이블에서 작성자 정보 가져오기
        .select("id, user_metadata")
        .in("id", uniqueWriters);

      if (writerError) {
        console.error("Error fetching writers:", writerError.message);
      }

      // 작성자 정보를 게시물에 매핑
      const postsWithWriters = posts.map((post) => {
        const writer = writers?.find((writer) => writer.id === post.writer);
        return {
          ...post,
          writerNickname: writer?.user_metadata?.display_name || "알 수 없음",
        };
      });

      setPosts(postsWithWriters || []);
      setLoading(false);
    };

    fetchPosts();
  }, [query, currentPage]);

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setSearchParams({ query, page: page.toString() }); // URL에 페이지 번호 반영
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <div className="search-container">
        <h2 className="search-title">"{query}"에 대한 검색 결과</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : posts.length > 0 ? (
          <>
            <ul className="search-results">
              {posts.map((post) => (
                <li key={post.id} className="search-item">
                  <h3>{post.title}</h3>
                  <p>{post.detail.substring(0, 50)}...</p>
                  <div className="post-meta">
                    <span>작성자: {post.writerNickname}</span>
                    <span>좋아요: {post.like}</span>
                    <span>조회수: {post.view}</span>
                    <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
            {/* 페이지네이션 */}
            <div className="pagination">
              {Array.from({ length: Math.ceil(totalPosts / POSTS_PER_PAGE) }, (_, index) => (
                <button
                  key={index}
                  className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </>
  );
}

export default SearchPage;
