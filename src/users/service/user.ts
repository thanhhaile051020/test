import { Attributes, Filter, SearchResult, Service } from 'onecore';

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  balance?: number;
  currency?: string;
  imageURL: string;
  isLike?: boolean
}

export const userModel: Attributes = {
  id: {
    length: 40,
    required: true,
    key: true
  },
  username: {
    length: 100,
    required: true,
    q: true
  },
  phone: {
    format: 'phone',
    length: 14,
    q: true
  },
  email: {
    length: 100,
    q: true,
    required: true,
  },
  website: {
    length: 100,
    q: true
  }
};

export interface UserFilter extends Filter {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  address?: Address;
  phone?: string;
  website?: string;
  company?: Company;
  balance?: number;
  currency?: string;
}
export interface UserService extends Service<User, string, UserFilter> {
  getAllUsers(): Promise<User[]>;
  search(s: UserFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<User>>;
  deleteUser(id: number, ctx?: any): boolean;
  likeUser(id: number, isLike: boolean):boolean;
}
