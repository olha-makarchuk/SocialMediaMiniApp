const mockPosts = Array.from({ length: 125 }, (_, i) => {
  const id = i + 1;
  const authorId = id === 2 ? 1 : Math.floor(Math.random() * 60) + 1;
  const date = new Date();
  date.setHours(date.getHours() - i); 

  return {
    id,
    authorId,
    content: `Це пост №${id}. Навчаюсь будувати архітектуру на Redux Toolkit. #learning #webdev #post${id}`,
    images: i % 3 === 0 ? [
      `https://picsum.photos/seed/${id}/800/600`,
      `https://picsum.photos/seed/${id + 100}/800/600`
    ] : [],
    likesCount: Math.floor(Math.random() * 200),
    commentsCount: 0, 
    isLiked: Math.random() > 0.9,
    createdAt: date.toISOString(),
    updatedAt: null
  };
});

export default mockPosts;