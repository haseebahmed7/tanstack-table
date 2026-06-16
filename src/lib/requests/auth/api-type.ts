export interface User {
  email?: string;
  photo?: string;
  firstName: string;
  lastName: string;
  address?: string;
  country?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  type: string;
  email: string;
  photo: string;
  roles: string[];
  isProfileComplete?: boolean;
}

export interface Company {
  title: string;
}

export interface Login {
  refresh: string;
  access: string;
  profile: Profile;
  company: Company;
}

export type UserPayload = Record<string, unknown> & User;
export type UserResponse = User;
