const names = ["Олександр", "Марія", "Дмитро", "Анна", "Сергій", "Юлія", "Андрій", "Вікторія"];
const surnames = ["Шевченко", "Коваленко", "Мельник", "Ткаченко", "Кравченко", "Олійник"];

const mockUsers = Array.from({ length: 60 }, (_, i) => {
  const id = i + 1;
  const name = names[Math.floor(Math.random() * names.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  
  return {
    id,
    name: `${name} ${surname}`,
    username: `${name.toLowerCase()}_${id}`,
    email: `user${id}@example.com`,
    avatar: `https://i.pravatar.cc/150?u=${id}`,
    bio: `Frontend Developer | Люблю каву та React | Живу у місті №${id % 5 + 1}`,
    postsCount: Math.floor(Math.random() * 50),
    followersCount: Math.floor(Math.random() * 1000),
    followingCount: Math.floor(Math.random() * 500),
    isFollowing: Math.random() > 0.8 
  };
});

export default mockUsers;