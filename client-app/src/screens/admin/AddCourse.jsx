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
  Flex,
} from 'native-base';
import InputType from '../../components/common/Input';
import AxiosInstance from '../../config/Axios';
import {CustomAlert} from '../../components/common/Alert';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import {compareSpecificity} from 'native-base/lib/typescript/hooks/useThemeProps/propsFlattener';

const FormFields = {
  name: '',
  CRN: '',
  term: '',
  instructorId: '',
  members: [],
};

const AddCourse = ({navigation}) => {
  const [formData, setFormData] = useState({...FormFields});
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);

  const [instructorList, setInstructorList] = useState([]);
  const [taMarkerList, setTaMarkerList] = useState([]);
  const [membersFields, setMembersFields] = useState([]);

  useEffect(() => {
    AxiosInstance.get('/user/instructor-list')
      .then(({data}) => {
        setInstructorList(data);
      })
      .catch(error => {
        setError('Something went wrong.');
      })
      .finally(() => {
        setLoader(false);
      });

    AxiosInstance.get('/user/ta-marker-list')
      .then(({data}) => {
        setTaMarkerList(data);
      })
      .catch(error => {
        setError('Something went wrong.');
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  const handleTextChange = (fieldName, value) => {
    setFormData(current => ({...current, [fieldName]: value}));
  };

  const handleSubmit = async () => {
    const formattedMembers = membersFields.map(({key, ...rest}) => rest);
    const payload = {
      ...formData,
      members: formattedMembers,
    };
    setLoader(true);
    AxiosInstance.post('/course/register-course', payload)
      .then(({data}) => {
        if (!data.success) {
          setError(data?.data?.message);
        } else {
          setMessage(data.data.message);
          setFormData({...FormFields});
          navigation.navigate('Dashboard');
        }
      })
      .catch(error => {
        setError('Something went wrong.');
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchInstructors = query => {
    const instructorDropdownList = instructorList.map(instructor => ({
      label: instructor.name,
      value: instructor._id,
    }));
    return new Promise(resolve => {
      setTimeout(() => {
        const filteredInstructors = instructorDropdownList.filter(inst =>
          inst.label.toLowerCase().includes(query.toLowerCase()),
        );
        resolve(filteredInstructors);
      }, 500);
    });
  };

  // Members Field below

  const handleAddMemberField = () => {
    setMembersFields(currentFields => [...currentFields, {key: Date.now()}]);
  };

  const handleRemoveMemberField = key => {
    setMembersFields(currentFields =>
      currentFields.filter(field => field.key !== key),
    );
  };

  const handleMemberDetailChange = (key, field, value) => {
    setMembersFields(currentFields =>
      currentFields.map(memberField => {
        if (memberField.key === key) {
          return {...memberField, [field]: value};
        }
        return memberField;
      }),
    );
  };

  const fetchMembers = query => {
    const members = taMarkerList.map(member => ({
      label: member.name,
      value: member._id,
    }));
    return new Promise(resolve => {
      setTimeout(() => {
        const filteredMembers = members.filter(
          member =>
            member.label.toLowerCase().includes(query.toLowerCase()) &&
            !membersFields.map(obj => obj.memberId).includes(member.value),
        );
        resolve(filteredMembers);
      }, 500);
    });
  };
  useEffect(() => {
    if (message || error) {
      setTimeout(() => {
        setMessage('');
        setError('');
      }, 3000);
    }
  }, [message]);

  return (
    <AdminWrapper title="Add Course" navigation={navigation}>
      <Stack p="4" space={3} width="100%">
        <FormControl>
          <InputType
            placeholder="Course Name"
            value={formData.courseName}
            onChangeText={text => handleTextChange('name', text)}
          />
        </FormControl>
        <FormControl>
          <InputType
            placeholder="CRN Number"
            value={formData.crnNumber}
            onChangeText={text => handleTextChange('CRN', text)}
          />
        </FormControl>
        <FormControl>
          <InputType
            placeholder="Term Name"
            value={formData.termName}
            onChangeText={text => handleTextChange('term', text)}
          />
        </FormControl>
        <SearchableDropdown
          placeholder="Instructor Name"
          onItemSelect={item => {
            handleTextChange('instructorId', item.value);
          }}
          fetchData={fetchInstructors}
        />
        {membersFields.map(field => (
          <Flex key={field.key} direction="row" alignItems="center" mb={2}>
            <Flex flex={1} mr={2}>
              <SearchableDropdown
                placeholder="TA/Marker Name"
                onItemSelect={item =>
                  handleMemberDetailChange(field.key, 'memberId', item.value)
                }
                fetchData={fetchMembers}
              />
              <InputType
                placeholder="Maximum Hours"
                keyboardType="numeric"
                onChangeText={text =>
                  handleMemberDetailChange(field.key, 'maxHours', text ? parseInt(text) : 0)
                }
                mt={2}
              />
              <Radio.Group
                name=""
                value={formData.role}
                onChange={nextValue =>
                  handleMemberDetailChange(field.key, 'role', nextValue)
                }>
                <HStack space={4} justifyContent="center" alignItems="center">
                  <Radio value="TA" my="1">
                    <Text color="secondary.100">Teaching Assistant</Text>
                  </Radio>
                  <Radio value="MARKER" my="1">
                    <Text color="secondary.100">Marker</Text>
                  </Radio>
                </HStack>
              </Radio.Group>
            </Flex>
            <Button
              onPress={() => handleRemoveMemberField(field.key)}
              size="sm">
              Remove
            </Button>
          </Flex>
        ))}
        <Button onPress={handleAddMemberField}>Add Member</Button>
        <Stack space={2}>
          {loader ? (
            <Spinner color="secondary.500" size="lg" />
          ) : (
            <Button onPress={handleSubmit}>Add Course</Button>
          )}
        </Stack>
        <CustomAlert
          message={message}
          open={Boolean(message)}
          status="success"
        />
        <CustomAlert message={error} open={Boolean(error)} status="error" />
      </Stack>
    </AdminWrapper>
  );
};

export default AddCourse;
