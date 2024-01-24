import React from 'react';
import Wrapper from './Wrapper';
import {useDispatch} from 'react-redux';
import {logoutAction} from '../store/user/actions';
import Header from './Header';

const AdminWrapper = ({navigation, children, title}) => {
  const dispatch = useDispatch();

  const MenuItemsList = [
    {name: 'Add User', onPress: () => navigation.navigate('ADD_USER')},
    {name: 'Add Course', onPress: () => navigation.navigate('ADD_COURSE')},
    {name: 'Logout', onPress: () => logout()},
  ];

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <Wrapper>
      <Header title={title} menuItemsList={MenuItemsList} />
      {children}
    </Wrapper>
  );
};

export default AdminWrapper;
