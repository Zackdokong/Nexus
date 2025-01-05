import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../../supabase";
import "./body.css";

function MainBody() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]); // 최신 게시물
  const [popularPosts, setPopularPosts] = useState<any[]>([]); // 인기 게시물

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 최신 게시물 가져오기 (created_at 순)
        const { data: latest, error: latestError } = await supabase
          .from("post")
          .select("id, title")
          .order("created_at", { ascending: false })
          .limit(10); // 10개 제한

        if (latestError) throw latestError;
        setLatestPosts(latest || []);

        // 인기 게시물 가져오기 (like 순)
        const { data: popular, error: popularError } = await supabase
          .from("post")
          .select("id, title")
          .order("like", { ascending: false })
          .limit(10); // 10개 제한

        if (popularError) throw popularError;
        setPopularPosts(popular || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="post-wrapper">
        {/* 최신 게시물 */}
        <div className="latest">
          <div className="section-header">
            <h2>최신 게시물</h2>
            <Link to="/write">
              <button className="write-button">글쓰기</button>
            </Link>
          </div>
          <hr />
          <ul className="post-list">
            {latestPosts.map((post) => (
              <Link key={post.id} to={`post/${post.id}`}>
                <li key={post.id}>
                  <p>{post.title}</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* 인기 게시물 */}
        <div className="popularity">
          <div className="section-header">
            <h2>인기 게시물</h2>
            <Link to="/write">
              <button className="write-button">글쓰기</button>
            </Link>
          </div>
          <hr />
          <ul className="post-list">
            {popularPosts.map((post) => (
              <Link key={post.id} to={`post/${post.id}`}>
                <li key={post.id}>
                  <p>{post.title}</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default MainBody;
