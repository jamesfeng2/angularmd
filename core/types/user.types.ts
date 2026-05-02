// src/app/core/types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatarUrl?: string;
}
