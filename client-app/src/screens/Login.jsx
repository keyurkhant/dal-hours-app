import React, {useState} from 'react';
import {
  Stack,
  Heading,
  Button,
  Center,
  Spinner,
  FormControl,
  WarningOutlineIcon,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import Wrapper from '../components/Wrapper';
import Input from '../components/common/Input';
import {validateEmail} from '../helper/functions';
import Axios from '../config/Axios';
import {getUserInfoAction} from '../store/user/actions';
import {CustomAlert} from '../components/common/Alert';

const inputFields = [
  {placeholder: 'Email ID', type: 'text', name: 'emailId'},
  {
    placeholder: 'Password',
    type: 'password',
    secureTextEntry: true,
    name: 'password',
  },
];

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    emailId: '',
    password: '',
  });
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({
    emailId: '',
    password: '',
  });

  const [alert, setAlert] = useState('');

  const isValidated = () => {
    const errorObj = {
      emailId: '',
      password: '',
    };
    let isValid = true;

    if (!validateEmail(formData.emailId)) {
      isValid = false;
      errorObj.emailId = 'Please enter valid email address';
    }

    if (formData.password.length < 6) {
      isValid = false;
      errorObj.password = 'Please enter valid password';
    }

    setErrors(errorObj);
    return isValid;
  };
  const handleTextChange = (name, value) => {
    setFormData(current => ({...current, [name]: value}));
  };
  const handleSubmit = () => {
    if (isValidated()) {
      setLoader(true);
      setAlert('');
      Axios.post('/auth/login', {
        email: formData.emailId,
        password: formData.password,
      })
        .then(async ({data}) => {
          if (data?.data?.message) {
            setAlert(data?.data?.message);
          }

          if (data?.data?.token) {
            await AsyncStorage.setItem('token', data.data.token);
            dispatch(getUserInfoAction());
          }
        })
        .catch(error => {
          console.log(error);
          setAlert('Unable to Login the user.');
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };
  const handleResetPassword = () => {
    navigation.navigate('Reset Password');
  };

  return (
    <Wrapper>
      <Center height="100%">
        <Heading
          size="lg"
          fontSize="36"
          color="secondary.300"
          textAlign="center"
          mt="5"
          mb="5">
          Login
        </Heading>
        <CustomAlert
          message={alert}
          open={Boolean(alert)}
          status="error"
          noClose={true}
        />
        <Stack p="4" space={3} width="100%">
          {inputFields.map((inputField, key) => (
            <Stack space={2} key={key}>
              <FormControl isInvalid={errors[inputField.name]}>
                <Input
                  {...inputField}
                  onChangeText={value =>
                    handleTextChange(inputField.name, value)
                  }
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors[inputField.name]}
                </FormControl.ErrorMessage>
              </FormControl>
            </Stack>
          ))}

          <Stack space={2}>
            {loader ? (
              <Spinner color="secondary.500" size="lg" />
            ) : (
              <Button
                size="lg"
                background="secondary.400"
                onPress={() => handleSubmit()}
                _pressed={{backgroundColor: 'secondary.500'}}>
                Login
              </Button>
            )}
          </Stack>
          <Button
            size="sm"
            onPress={() => handleResetPassword()}
            _pressed={{backgroundColor: 'secondary.500'}}>
            Reset Password
          </Button>
        </Stack>
      </Center>
    </Wrapper>
  );
};
export default Login;
