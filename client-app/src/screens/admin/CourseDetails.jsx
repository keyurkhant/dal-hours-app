import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  Box,
  Text,
  VStack,
  Divider,
  Card,
} from 'native-base';
import AxiosInstance from '../../config/Axios';
import AdminWrapper from '../../components/AdminWrapper';

const CourseDetails = ({route}) => {
  const course = route.params.course[0];
  const [instructor, setInstructor] = useState({});
  const [memberDetails, setMemberDetails] = useState([]);

  useEffect(() => {
    AxiosInstance.get('/user/user?userId=' + course.instructorId)
      .then(({data}) => {
        setInstructor(data.data[0]);
      })
      .catch(error => {
        setInstructor({});
      });
  }, [course]);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      const memberInfoPromises = course.members.map(member =>
        AxiosInstance.get('/user/user?userId=' + member.memberId).then(
          ({data}) => data.data[0],
        ),
      );

      Promise.all(memberInfoPromises)
        .then(memberInfos => {
          setMemberDetails(memberInfos);
        })
        .catch(error => {
          console.error('Error fetching member details', error);
        });
    };

    fetchMemberDetails();
  }, [course.members]);

  const renderMember = ({item, index}) => {
    const {memberId, maxHours, role} = item;
    const memberInfo = memberDetails.filter(member => member._id == memberId);
    return (
      <VStack space={2} mb={2}>
        <Card
          mb={2}
          borderRadius="10"
          borderColor="coolGray.200"
          borderWidth="1">
          <Text fontSize="md" bold color="white">
            Name: {memberInfo[0]?.name || ''}
          </Text>
          <Text fontSize="sm" color="white">
            Role: {role}
          </Text>
          <Text fontSize="sm" color="white">
            Completed Hours: {'completedHours'}
          </Text>
          <Text fontSize="sm" color="white">
            Maximum Hours: {maxHours}
          </Text>
        </Card>
      </VStack>
    );
  };

  return (
    <AdminWrapper title="Dashboard">
      <Box p={4}>
        <VStack space={4}>
          <Text fontSize="2xl" bold color="white">
            {course.name}
          </Text>

          <Divider my={2} />

          <Box>
            <Text fontSize="md" bold color="white">
              {'Term:  '}
              {course.term.includes('_')
                ? course.term.replace('_', ' ')
                : course.term}
            </Text>
          </Box>

          <Divider my={2} />

          <Box>
            <Text fontSize="md" bold color="white">
              Instructor:
            </Text>
            <Text fontSize="md" color="white">
              {instructor?.name || ''}
            </Text>
          </Box>

          <Box>
            <Text fontSize="md" bold color="white">
              Email:
            </Text>
            <Text fontSize="md" color="white">
              {instructor?.email || ''}
            </Text>
          </Box>

          <Box>
            <Text fontSize="xl" bold color="white">
              Members
            </Text>
            <FlatList
              data={course.members}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderMember}
              nestedScrollEnabled={true}
            />
          </Box>
        </VStack>
      </Box>
    </AdminWrapper>
  );
};

export default CourseDetails;
