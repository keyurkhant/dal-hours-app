import React from 'react';
import Wrapper from './Wrapper';
import {useDispatch} from 'react-redux';
import {logoutAction} from '../store/user/actions';
import Header from './Header';

const InstructorWrapper = ({children, title}) => {
  const dispatch = useDispatch();

  const MenuItemsList = [{name: 'Logout', onPress: () => logout()}];

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

export default InstructorWrapper;
