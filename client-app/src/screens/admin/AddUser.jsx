import React, {useEffect, useState} from 'react';
import AdminWrapper from '../../components/AdminWrapper';
import {
  Alert,
  Button,
  FormControl,
  HStack,
  Radio,
  Spinner,
  Stack,
  Text,
} from 'native-base';
import InputType from '../../components/common/Input';
import AxiosInstance from '../../config/Axios';
import {CustomAlert} from '../../components/common/Alert';

const FormFields = {
  name: '',
  email: '',
  password: '',
  role: '',
};

const AddUser = ({navigation}) => {
  const [formData, setFormData] = useState({...FormFields});
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const [loader, setLoader] = useState(false);

  const handleTextChange = (fieldName, value) => {
    setFormData(current => ({...current, [fieldName]: value}));
  };

  const handleSubmit = async () => {
    setLoader(true);
    AxiosInstance.post('/user/add-user', formData)
      .then(({data}) => {
        if (!data.success) {
          setError(data?.data?.message);
        } else {
          setMessage(data.data.message);
          setFormData({...FormFields});
        }
      })
      .catch(error => {
        setError('Something went wrong.');
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const inputFields = [
    {placeholder: 'Name', type: 'text', name: 'name'},
    {placeholder: 'Email ID', type: 'text', name: 'email'},
    {
      placeholder: 'Password',
      type: 'password',
      secureTextEntry: true,
      name: 'password',
    },
  ];

  useEffect(() => {
    if (message || error) {
      setTimeout(() => {
        setMessage('');
        setError('');
      }, 3000);
    }
  }, [message]);

  return (
    <AdminWrapper title="Add User" navigation={navigation}>
      <Stack p="4" space={3} width="100%">
        {inputFields.map((inputField, key) => (
          <Stack space={2} key={key}>
            <FormControl>
              <InputType
                disabled={false}
                {...inputField}
                value={formData[inputField.name]}
                onChangeText={value => handleTextChange(inputField.name, value)}
              />
            </FormControl>
          </Stack>
        ))}
        <Radio.Group
          name=""
          value={formData.role}
          onChange={nextValue => handleTextChange('role', nextValue)}>
          <HStack space={4} justifyContent="center" alignItems="center">
            <Radio value="TA_MARKER" my="1">
              <Text color="secondary.100">TA / MARKER</Text>
            </Radio>
            <Radio value="INSTRUCTOR" my="1">
              <Text color="secondary.100">Instructor</Text>
            </Radio>
          </HStack>
        </Radio.Group>
        <Stack space={2}>
          {loader ? (
            <Spinner color="secondary.500" size="lg" />
          ) : (
            <Button
              size="lg"
              background="secondary.400"
              onPress={() => handleSubmit()}
              _pressed={{backgroundColor: 'secondary.500'}}>
              Add User
            </Button>
          )}
        </Stack>

        <CustomAlert
          message={message}
          open={Boolean(message)}
          status="success"
          noClose={true}
        />
        <CustomAlert
          message={error}
          open={Boolean(error)}
          status="error"
          noClose={true}
        />
      </Stack>
    </AdminWrapper>
  );
};

export default AddUser;
