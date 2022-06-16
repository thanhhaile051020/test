import React from 'react';
import { EditComponentParam, useEdit } from 'react-hook-core';
import { formatPhone } from 'ui-plus';
import { emailOnBlur, inputEdit, phoneOnBlur, requiredOnBlur } from 'uione';
import { getUserService, User } from './service';
import './users.css';

interface InternalState {
  user: User;
}
const initialState: InternalState = {
  user: {} as User
};
const param: EditComponentParam<User, string, InternalState> = {
  patchable:false
};
export const UserDetail = () => {
  const refForm = React.useRef();
  const { resource, state, updateState, flag, save, updatePhoneState, back } = useEdit<User, string, InternalState>(refForm, initialState, getUserService(), inputEdit(),param);
  const user = state.user;
  return (
    <>{user && <div className='view-container'>
      <form id='userForm' name='userForm' model-name='user' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{flag.newMode ? resource.create : resource.edit} {resource.user}</h2>
        </header>
        <div className='row'>
          <label className='col s12 m6'>
            User Id
            <input
              type='text'
              id='userId'
              name='id'
              value={user.id || ''}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20}
              required={true}
            />
          </label>
          <label className='col s12 m6'>
            Username
            <input
              type='text'
              id='displayName'
              name='username'
              value={user.username || ''}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={40} required={true}
              placeholder={'Enter your username'} />
          </label>
          <label className='col s12 m6 flying'>
            Email
            <input
              type='text'
              id='email'
              name='email'
              data-type='email'
              value={user.email || ''}
              onChange={updateState}
              onBlur={emailOnBlur}
              maxLength={100}
              required={true}
              placeholder={'Enter your email'} />
          </label>
          <label className='col s12 m6 flying'>
            Website
            <input
              type='tel'
              id='website'
              name='website'
              value={user.website || ''}
              onChange={updateState}
              maxLength={17}
              placeholder={'Enter your website'} />
          </label>
          <label className='col s12 m6 flying'>
            Phone
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formatPhone(user.phone) || ''}
              onChange={updatePhoneState}
              onBlur={phoneOnBlur}
              // maxLength={17}
              placeholder={'Enter your phone'} />
          </label>
    
          <label className='col s12 m6 flying'>
            City
            <input
              type='text'
              id='address'
              name='address.city'
              value={user.address?.city || ''}
              onChange={updateState}
              placeholder={'City'} />
          </label>
          <label className='col s12 m6 flying'>
            Suite
            <input
              type='text'
              id='address'
              name='address.suite'
              value={user.address?.suite || ''}
              onChange={updateState}
              placeholder={'Enter your suite'} />
          </label>
          <label className='col s12 m6 flying'>
            Zipcode
            <input
              type='text'
              id='address'
              name='address.zipcode'
              value={user.address?.zipcode || ''}
              onChange={updateState}
              placeholder={'Enter your zipcode'} />
          </label>
          <label className='col s12 m6 flying'>
            Lat
            <input
              type='text'
              id='address'
              name='address.city'
              value={user.address?.geo.lat || ''}
              onChange={updateState}
              placeholder={'Enter your lat'} />
          </label>
          <label className='col s12 m6 flying'>
            Lng
            <input
              type='text'
              id='address'
              name='address.geo.lng'
              value={user.address?.geo.lng || ''}
              onChange={updateState}
              placeholder={'Enter your lng'} />
          </label>
          <label className='col s12 m6'>
            Company Name
            <input
              type='text'
              id='companyname'
              name='user.company.name'
              value={user.company?.name || ''}
              onChange={updateState}
              placeholder={'Enter your company name'} />
          </label>
          <label className='col s12 m6'>
            Company Catch Phrase
            <input
              type='text'
              id='companyname'
              name='user.company.name'
              value={user.company?.catchPhrase || ''}
              onChange={updateState}
              placeholder={'Enter your company catch phrase'} />
          </label>
          <label className='col s12 m6 flying'>
            Company BS
            <input
              type='text'
              id='bs'
              name='user.company.bs'
              value={user.company?.bs || ''}
              onChange={updateState}
              placeholder={'Enter your BS'} />
          </label>
        </div>
        <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={save}>
              {resource.save}
            </button>}
        </footer>
      </form>
    </div>}


    </>

  );
};
