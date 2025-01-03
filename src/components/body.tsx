import { Link } from 'react-router-dom';
import './body.css';

function MainBody() {
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
            <li>첫 번째 게시물</li>
            <li>두 번째 게시물</li>
            <li>세 번째 게시물</li>
            <li>네 번째 게시물</li>
            <li>다섯 번째 게시물</li>
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
            <li>가장 인기 있는 게시물</li>
            <li>두 번째 인기 게시물</li>
            <li>세 번째 인기 게시물</li>
            <li>네 번째 인기 게시물</li>
            <li>다섯 번째 인기 게시물</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default MainBody;
