import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { SearchResult } from 'onecore';
import { options } from 'uione';
import { Client, Result } from 'web-clients';
import { User, UserFilter, userModel, UserService } from './user';

export * from './user';
const httpRequest = new HttpRequest(axios, options);

export function buildShownUsers(items: User[], keyword: string, phone?: string, website?: string): User[] {
  if ((!keyword || keyword === '' || keyword === '?') && (!phone && !website)) {
    return items;
  }
  const w = keyword.toLowerCase();
  const shownUsers = items.filter(u => {
    let isMatch = u.name.toLowerCase().includes(w) || u.username.toLowerCase().includes(w)
    if (phone) {
      const p = phone.toLowerCase().trim();
      isMatch = u.phone.toLowerCase().includes(p)
    }
    if (website) {
      const w = website.toLowerCase().trim();
      isMatch = u.website.toLowerCase().includes(w)
    }
    return isMatch
  });

  return shownUsers;
}
export class UserClient extends Client<User, string, UserFilter> implements UserService {
  private users: User[] = [];
  constructor(public http: HttpRequest, public url: string, private urlAvatar: string) {
    super(http, url, userModel);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.search = this.search.bind(this);
  }
  async getAllUsers(): Promise<User[]> {
    if (this.users.length === 0) {
      const rs = await this.http.get<User[]>(this.url);
      this.users = rs.map(user => {
        const data = radomBalance();
        user.currency = data.currency;
        user.balance = data.balance;
        return user;
      });
      const getUserImageAPI = `https://avatars.dicebear.com/v2/avataaars/{{username}}.svg?options[mood][]=happy`;
      for (const user of this.users) {
        user.imageURL = getUserImageAPI.replace(/{{username}}/, user.username);
      }
      return this.users;
    }
    return this.users;
  }

  async search(s: UserFilter, limit?: number | undefined, offset?: string | number | undefined, fields?: string[] | undefined): Promise<SearchResult<User>> {
    const listUser: User[] = await this.getAllUsers();
    const fillterd = buildShownUsers(listUser, s.q || '', s.phone, s.website);
    const result: SearchResult<User> = {
      list: fillterd
    };
    return result;
  }

  async load(id: string, ctx?: any): Promise<User | null> {
    const listUser: User[] = await this.getAllUsers();
    const rs = listUser.find(u => u.id === Number(id))
    return rs ? rs : null
  }

  deleteUser(id: number, ctx?: any): boolean {
    const newUsers = this.users.filter(u => u.id !== id)
    if (newUsers.length === this.users.length - 1) {
      this.users = newUsers
      return true
    }
    return false
  }
  likeUser(id: number, isLike: boolean): boolean {
    let rs = false
    this.users = this.users.map(u => {
      if (u.id === id) {
        u.isLike = isLike;
        rs = true
      }; return u
    })
    return rs;
  }


  async update(obj: User, ctx?: any): Promise<Result<User>> {
    const listUser: User[] = await this.getAllUsers();
    let isUpdate = 0
    for (const user of listUser) {
      if (obj.id === user.id) {
        const keys = Object.keys(obj)
        for (const key of keys) {
          (user as any)[key] = (obj as any)[key]
        }
        isUpdate = 1
      }
    }
    this.users = listUser
    const result: Result<User> = {
      status: isUpdate,
    };
    return result;
  }
}

function radomBalance() {
  const currencys = ['USD', 'VND', 'JPY', 'THB'];
  const currency = currencys[Math.floor(Math.random() * 4)];
  const balance = Math.floor(Math.random() * 10000);
  return { currency, balance };
}

class ApplicationContext {
  userSevice!: UserService;

  getUserService(): UserService {
    if (!this.userSevice) {
      this.userSevice = new UserClient(httpRequest, 'https://jsonplaceholder.typicode.com/users', 'https://avatars.dicebear.com/v2/avataaars/Bret.svg?options[mood][]=happy');
    }
    return this.userSevice;
  }
}

export const context = new ApplicationContext();

export function getUserService(): UserService {
  return context.getUserService();
}
