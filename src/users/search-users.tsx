import { Item } from 'onecore';
import { useEffect, useRef, useState } from 'react';
import { checked, OnClick, Search, SearchComponentState, useSearch, value } from 'react-hook-core';
import ReactModal from 'react-modal';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'reactx-pagination';
import { getLocale, inputSearch, storage, useResource } from 'uione';
import { getUserService, User, UserFilter, UserService } from './service';
import { UserList } from './user-list';
import { confirm } from 'ui-alert';
import './users.css';
interface UserSearch extends SearchComponentState<User, UserFilter> {
  statusList: Item[];
}
const userFilter: UserFilter = {
  id: 1,
  username: '',
  phone: '',
  email: '',
  name: '',
  q: ''
};
const initialState: UserSearch = {
  statusList: [],
  list: [],
  filter: userFilter
};
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
export const SearchUser = () => {
  const navigate = useNavigate();
  const [modalDelete, setModalDelete] = useState<boolean>(false)
  const refForm = useRef();
  const deleteUserID = useRef<number>(0);
  const user = storage.user();
  const locale = getLocale(user && user.language ? user.language : 'en');

  const { state, resource, component, updateState, search, sort, toggleFilter, clearQ, changeView, pageChanged, pageSizeChanged } = useSearch<User, UserFilter, UserSearch>(refForm, initialState, getUserService(), inputSearch());

  const editUser = (e: OnClick, id: number) => {
    e.preventDefault();
    navigate(`/users/${id}`);
  };


  const handleDelete = (id: number, e?: OnClick) => {
    deleteUserID.current=id
    confirm('Are you sure want to delete this user', 'Delete user', () => deleteUser(e))
  }
  const deleteUser = (e?: any) => {

  }
  const { list } = state;
  const filter = value(state.filter);
  const closeModalDelete = () => {
    setModalDelete(false)
  }

  return (
    <div className='view-container'>
      <header>
        <h2>Users</h2>
        <div className='btn-group'>
          {component.view !== 'table' && <button type='button' id='btnTable' name='btnTable' className='btn-table' data-view='table' onClick={changeView} />}
          {component.view === 'table' && <button type='button' id='btnListView' name='btnListView' className='btn-list-view' data-view='listview' onClick={changeView} />}
        </div>
      </header>
      <div>
        <form id='usersForm' name='usersForm' noValidate={true} ref={refForm as any}>
          <section className='row search-group'>
            <Search className='col s12 m6 search-input' size={component.pageSize} sizes={component.pageSizes} pageSizeChanged={pageSizeChanged}
              onChange={updateState} placeholder={resource.keyword}
              toggle={toggleFilter} value={filter.q ? filter.q === '?' ? '' : filter.q : ''}
              search={search} clear={clearQ} />
            <Pagination className='col s12 m6' total={component.total} size={component.pageSize} max={component.pageMaxSize} page={component.pageIndex} onChange={pageChanged} />
          </section>
          <section className='row search-group inline' hidden={component.hideFilter}>

            <label className='col s12 m4 l4'>
              Website
              <input type='text'
                id='website' name='website'
                value={filter.website || ''}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.website} />
            </label>
            <label className='col s12 m4 l4'>
              Phone
              <input type='text'
                id='phone' name='phone'
                value={filter.phone || ''}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.user_phone} />
            </label>
          </section>
        </form>
        <form className='list-result'>
          {component.view !== 'table' &&
            <UserList users={list ?? []} navigate={editUser} currency={true} locale={locale} onDelete={handleDelete} />
          }
          {component.view === 'table' &&
            <div className='table-responsive'>
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field='id'><button type='button' id='sortUserId' onClick={sort}>{resource.user_id}</button></th>
                    <th data-field='name'><button type='button' id='sortUserName' onClick={sort}>Name</button></th>
                    <th data-field='email'><button type='button' id='sortEmail' onClick={sort}>Email</button></th>
                    <th data-field='phone'><button type='button' id='sortPhone' onClick={sort}>Phone</button></th>
                    <th data-field='website'><button type='button' id='sortWebsite' onClick={sort}>Website</button></th>
                  </tr>
                </thead>
                <tbody>
                  {list && list.length > 0 && list.map((user, i) => {
                    return (
                      <tr key={i} onClick={e => editUser(e, user.id)}>
                        <td className='text-right'>{(user as any).sequenceNo}</td>
                        <td>{user.id}</td>
                        <td><Link to={`edit/${user.id}`}>{user.username}</Link></td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.website}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          }
        </form>
      </div>
      <ReactModal
        isOpen={modalDelete}
        onRequestClose={closeModalDelete}
        style={customStyles}
        contentLabel='Modal'
        className='modal-portal-content small-width-height'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container profile-info'>
          <form model-name='data'>
            <header>
              <h2>Delete user</h2>
              <button
                type='button'
                id='btnClose'
                name='btnClose'
                className='btn-close'
                onClick={closeModalDelete}
              />
            </header>
            <div>
              <section className='row'>
                <div>Are you sure to delete this user?</div>
              </section>
            </div>

            <footer>
              <button
                type='button'
                id='btnSave'
                name='btnSave'
                onClick={deleteUser}
              >
                Yes
              </button>
            </footer>
          </form>
        </div>
      </ReactModal>
    </div>
  );
};
