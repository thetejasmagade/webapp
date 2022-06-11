export function sortUserAchievements(userAchievements) {
  const sortedAchievements = [];
  for (const achievement of userAchievements) {
    sortedAchievements.push(achievement);
  }
  sortedAchievements.sort((ua1, ua2) => {
    if (ua1.Category < ua2.Category) {
      return 1;
    } else if (ua1.Category > ua2.Category) {
      return -1;
    }
    return ua1.Order < ua2.Order ? -1 : 1;
  });
  return sortedAchievements;
}
