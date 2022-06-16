import { formatter } from 'ui-plus';
import { Locale } from 'uione';
import { User } from './service';
import './users.css'
export interface StringMap {
  [key: string]: string;
}
export type OnClick = React.MouseEvent<HTMLElement, MouseEvent>;
export interface Props {
  navigate: (e: OnClick, id: number) => void;
  users: User[];
  currency?: boolean;
  locale?: Locale;
  onDelete: (id: number, e?: OnClick) => void;
  onLikeUser?: (id: number, isLike: boolean) => void
}
export interface UserItemProps {
  navigate: (e: OnClick, id: number) => void;
  user: User;
  currency?: boolean;
  locale?: Locale;
  onDelete: (id: number, e?: OnClick) => void;
  onLikeUser?: (id: number, isLike: boolean) => void
}

export const UserItem = (props: UserItemProps) => {
  const user = props.user;
  const balance = formatter.formatCurrency(user.balance, user.currency, props.locale, true);
  const handleDelete = (e: OnClick, id: number) => {
    // e.preventDefault()
    props.onDelete(id, e)
  }
  const handleLike = (e: OnClick, id: number, isLike: boolean) => {
    e.preventDefault();
    if (props.onLikeUser)
      props.onLikeUser(id, isLike)
  }
  return (
    <li className='col s12 m6 l4 xl3' >
      <div className='card-user'>
        <div className='card-cover'>
          <img src={user.imageURL} alt='user' className='' />
        </div>
        <div className='card-user-body'>
          <div className='card-user-meta'>
            <h4>{user.username}</h4>
            <div className='card-user-infomation'>
              <span className='material-icons-outlined'>
                email
              </span>
              <div className='col s12 m10 '>{user.email}</div>
            </div>
            <div className='card-user-infomation'>
              <span className='material-icons-outlined'>
                phone_enabled
              </span>
              <div className='col s12 m10 '>{user.phone}</div>
            </div>
            <div className='card-user-infomation'>
              <span className='material-icons-outlined'>
                language
              </span>
              <div className='col s12 m10 '>{user.website}</div>
            </div>
            {props.currency && <div className='card-user-infomation'>
              <span className="material-icons-outlined">
                account_balance_wallet
              </span>
              <div className='col s12 m10 '>{balance}</div>
            </div>
            }
          </div>
        </div>
        <ul className='card-user-action'>
          <li>
            <span className="material-icons-outlined favorite" onClick={(e) => handleLike(e, user.id, !user.isLike)}>
              {user.isLike ? 'favorite' : ' favorite_border'}
            </span>
          </li>
          <li><span className='material-icons-outlined' onClick={(e) => props.navigate(e, user.id)}>
            edit
          </span></li>
          <li><span className='material-icons' onClick={(e) => handleDelete(e, user.id)}>
            delete
          </span>
          </li>
        </ul>
      </div>
    </li>
  );
};
export const UserList = (props: Props) => {
  const users = props.users;
  return (
    <ul className='row list-view'>
      {users && users.length > 0 && users.map((user, i) =>
        <UserItem key={i} user={user} navigate={props.navigate} onDelete={props.onDelete} currency={props.currency} locale={props.locale} onLikeUser={props.onLikeUser} />)}
    </ul>
  );
};
