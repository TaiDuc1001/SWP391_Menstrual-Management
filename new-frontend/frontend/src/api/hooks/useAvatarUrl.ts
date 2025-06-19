import { getAvatarUrl } from '../services/avatar';

export function useAvatarUrl(id: string | number | undefined) {
  return getAvatarUrl(id);
}
