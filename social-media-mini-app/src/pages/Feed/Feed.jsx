import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPosts,
  selectPostsStatus,
  getPostsError,
  getPostsHasMore,
  getPostsCurrentPage,
} from "../../features/posts/postsSelectors";
import { fetchPostsAsync } from "../../features/posts/postsApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PostList from "../../components/Post/PostList";
import ErrorMessage from "../../components/common/ErrorMessage";
import InfiniteScroll from "../../components/common/InfiniteScroll";

function Feed() {
  const dispatch = useDispatch();

  const posts = useSelector(getPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(getPostsError);
  const hasMore = useSelector(getPostsHasMore);
  const currentPage = useSelector(getPostsCurrentPage);

  const loadMorePosts = () => {
    dispatch(fetchPostsAsync({ page: currentPage + 1, limit: 10 }));
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPostsAsync({ page: 1, limit: 10 }));
    }
  }, [status, dispatch]);

  return (
    <div className="feed">
      {status === "failed" && <ErrorMessage error={error} />}

      <PostList posts={posts} />

      {status === "loading" && <LoadingSpinner />}

      <InfiniteScroll
        fetchMore={loadMorePosts}
        hasMore={hasMore}
        isLoading={status === "loading"}
      />
    </div>
  );
}

export default Feed;
