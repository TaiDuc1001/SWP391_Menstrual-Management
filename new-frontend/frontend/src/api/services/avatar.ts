// src/api/services/avatar.ts
export function getAvatarUrl(id: string | number | undefined) {
  if (!id) return 'https://ui-avatars.com/api/?name=User';
  return `https://ui-avatars.com/api/?name=${id}`;
}
