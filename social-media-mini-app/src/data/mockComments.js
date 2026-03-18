const mockComments = Array.from({ length: 300 }, (_, i) => {
  const id = i + 1;
  const postId = Math.floor(Math.random() * 125) + 1;
  const authorId = Math.floor(Math.random() * 60) + 1;
  
  const isReply = i > 0 && Math.random() > 0.75;
  const parentId = isReply ? Math.floor(Math.random() * i) + 1 : null;

  return {
    id,
    postId,
    authorId,
    content: isReply 
      ? `Відповідь на коментар: Повністю погоджуюсь з думкою автора!` 
      : `Цікавий пост №${postId}, дякую за контент!`,
    likesCount: Math.floor(Math.random() * 20),
    isLiked: false,
    parentId,
    createdAt: new Date().toISOString()
  };
});

export default mockComments;