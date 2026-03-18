export const getPosts = (state) => state.posts.posts;

export const getPostsLoading = (state) => state.posts.loading;

export const getPostsError = (state) => state.posts.error;

export const getPostsCurrentPage = (state) => state.posts.currentPage;

export const getPostsHasMore = (state) => state.posts.hasMore;

export const selectPostsStatus = (state) => state.posts.status;

export const selectPostById = (state, postId) => 
  state.posts.posts.find((post) => post.id === postId || post.id === Number(postId));