import {React} from 'react';

const {Input} = require('native-base');

const InputType = ({...rest}) => (
  <Input
    size="lg"
    color="white"
    borderColor="white"
    _focus={{borderColor: 'white'}}
    {...rest}
  />
);

export default InputType;
