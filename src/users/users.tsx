import { useEffect, useRef, useState } from 'react';
import { OnClick } from 'react-hook-core';
import ReactModal from 'react-modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { locale as getLocale, storage, useResource } from 'uione';
import { buildShownUsers, getUserService, User, UserService } from './service';
import { UserList } from './user-list';
import { confirm } from 'ui-alert';
import './users.css';
export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  }
};
ReactModal.setAppElement('#root');
export const Users = () => {
  const resource = useResource();
  const [searchParams] = useSearchParams();
  const [view] = useState<string>('list');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [service, setService] = useState<UserService>();
  const deleteUserID = useRef<number>(0);
  const navigate = useNavigate();
  const user = storage.user();
  const locale = getLocale(user && user.language ? user.language : 'en');

  useEffect(() => {

    if (!service) {
      setService(getUserService());
    }

    else {
      getUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);



  useEffect(() => {
    filterUser()
  }, [searchParams])

  useEffect(() => {
    const v = searchParams.get('q') as string || '';
    const shownUsers = buildShownUsers(allUsers, v);
    setUsers(shownUsers);
  }, [allUsers])
  const filterUser = () => {
    const v = searchParams.get('q') as string || '';
    if (v && v.length > 0) {
      const shownUsers = buildShownUsers(allUsers, v);
      setKeyword(v);
      setUsers(shownUsers);
    }
  }


  const getUsers = async () => {
    if (!service) {
      return;
    }
    const res = await service.getAllUsers();
    setAllUsers(res);
    setUsers(res);
  };

  const editUser = (e: OnClick, id: number) => {
    e.preventDefault();
    navigate(`${id}`);
  };


  const handleDelete = async (id: number) => {
    deleteUserID.current = id
    confirm('Are you sure want to delete this user', 'Delete user', deleteUser)
  }
  const deleteUser = async () => {
    if (!service) return
    service.deleteUser(deleteUserID.current)
    await getUsers()
  }
  const handleLikeUser = (id: number, isLike: boolean) => {
    if (!service) return
    const rs = service.likeUser(id,isLike)
    if(rs){
      getUsers()
    }
  }
  return (
    <div className='view-container'>
      <header>
        <h2>{resource.users}</h2>
        <div className='btn-group'>
          {view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' />}
          {view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' />}
        </div>
      </header>
      <div>
        <form className='list-result'>
          <UserList users={users} navigate={editUser} currency={true} locale={locale} onDelete={handleDelete} onLikeUser={handleLikeUser} />
        </form>
      </div>

    </div>
  );
};
