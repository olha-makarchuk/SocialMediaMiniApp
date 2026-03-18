import mockUsers from "../data/mockUsers";
import mockComments from "../data/mockComments";
import mockPosts from "../data/mockPosts";

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === "password123") {
        resolve({
          user,
          token: `mock_token_${user.id}_${Date.now()}`,
        });
      } else {
        reject(new Error("Невірний email або пароль"));
      }
    }, 1000);
  });
};

export const register = async (name, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = mockUsers.some((u) => u.email === email);
      if (exists) {
        reject(new Error("Користувач з таким email вже існує"));
      } else {
        const newUser = {
          id: mockUsers.length + 1,
          name,
          email,
          password,
        };
        mockUsers.push(newUser);

        resolve({
          user: newUser,
          token: `mock_token_${newUser.id}_${Date.now()}`,
        });
      }
    }, 1000);
  });
};

export const fetchPosts = async (page = 1, limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const posts = mockPosts.slice(start, end);
      resolve({
        posts,
        hasMore: end < mockPosts.length,
      });
    }, 800);
  });
};

export const fetchPostById = async (postId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => String(p.id) === String(postId));

      if (post) {
        resolve(post);
      } else {
        reject(new Error("Пост не знайдено"));
      }
    }, 500); 
  });
};

export const createPost = async (postData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        ...postData,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      };
      mockPosts.unshift(newPost);
      resolve(newPost);
    }, 1000);
  });
};

export const updatePost = async (postData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockPosts.findIndex((p) => String(p.id) === String(postData.id));

      if (index !== -1) {
        mockPosts[index] = {
          ...mockPosts[index],
          ...postData,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockPosts[index]);
      } else {
        reject(new Error("Пост не знайдено в базі даних (ID mismatch)"));
      }
    }, 1000);
  });
};

export const deletePost = async (postId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockPosts.findIndex((p) => p.id === postId);

      if (index !== -1) {
        mockPosts.splice(index, 1);
        resolve(postId);
      } else {
        reject(new Error("Пост не знайдено або він вже видалений"));
      }
    }, 1000);
  });
};

export const likePost = async (postId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => p.id === postId);

      if (post && Math.random() > 0.1) {
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;

        resolve(post);
      } else {
        reject(new Error("Помилка мережі"));
      }
    }, 500);
  });
};

export const fetchComments = async (postId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const comments = mockComments.filter((p) => p.postId === postId);

      resolve(comments);
    }, 800);
  });
};

export const addComment = async (commentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        ...commentData,
        likesCount: 0,
        commentsCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      };
      mockComments.unshift(newComment);
      resolve(newComment);
    }, 1000);
  });
};

export const deleteComment = async (commentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockComments.findIndex((c) => c.id === commentId);

      if (index !== -1) {
        mockComments.splice(index, 1);
        resolve(commentId);
      } else {
        reject(new Error("Коментар не знайдено або він вже видалений"));
      }
    }, 1000);
  });
};

export const likeComment = async (commentId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const comment = mockComments.find((c) => c.id === commentId);

      if (comment && Math.random() > 0.1) {
        comment.isLiked = !comment.isLiked;
        comment.likesCount += comment.isLiked ? 1 : -1;

        resolve(comment);
      } else {
        reject(new Error("Помилка мережі"));
      }
    }, 500);
  });
};


export const fetchUser = async (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => String(u.id) === String(userId));

      if (user) {
        resolve(user);
      } else {
        reject(new Error("Користувача не знайдено"));
      }
    }, 800);
  });
};
export const fetchUsers = async (page = 1, limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const posts = mockUsers.slice(start, end);
      resolve({
        posts,
        hasMore: end < mockUsers.length,
      });
    }, 800);
  });
};

export const updateUserProfile = async (user) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockUsers.findIndex((p) => p.id === user.id);

      if (index !== -1) {
        mockUsers[index] = {
          ...mockUsers[index],
          ...user
        };
        resolve(mockUsers[index]);
      } else {
        reject(new Error("Профіль користувача не знайдено"));
      }
    }, 1000);
  });
};

export const followUser = async (userId, followedUserId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === userId);
      const followedUser = mockUsers.find((u) => u.id === followedUserId);

      if (followedUser && followedUser) {
        user.followersCount ++;
        followedUser.isFollowing = true;

        resolve(user, followedUser);
      } else {
        reject(new Error("Помилка мережі"));
      }
    }, 500);
  });
};

export const unfollowUser = async (userId, followedUserId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === userId);
      const followedUser = mockUsers.find((u) => u.id === followedUserId);

      if (followedUser && followedUser) {
        user.followersCount --;
        followedUser.isFollowing = false;

        resolve(user, followedUser);
      } else {
        reject(new Error("Помилка мережі"));
      }
    }, 500);
  });
};

export const search = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = text.toLowerCase().trim();
      
      if (!query) {
        resolve({ posts: [], users: [] });
        return;
      }

      const filteredPosts = mockPosts.filter((post) =>
        post.content.toLowerCase().includes(query)
      );

      const filteredUsers = mockUsers.filter((user) =>
        user.name.toLowerCase().includes(query) || 
        user.username.toLowerCase().includes(query)
      );

      resolve({
        posts: filteredPosts,
        users: filteredUsers,
      });
    }, 600); 
  });
};