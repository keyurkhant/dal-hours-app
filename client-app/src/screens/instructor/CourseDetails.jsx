import React, {useEffect, useState} from 'react';
import {
  Box,
  Text,
  VStack,
  Divider,
  Card,
  Button,
  ScrollView,
} from 'native-base';
import AxiosInstance from '../../config/Axios';
import InstructorWrapper from '../../components/InstructorWrapper';
import {useSelector} from 'react-redux';
import CenterSpinner from '../../components/common/CenterSpinner';

const CourseDetails = ({route}) => {
  const course = route.params.course[0];
  const [data, setData] = useState({});
  const [membersLoader, setLoader] = useState(false);
  const {loading, user} = useSelector(state => state.user);

  const approveTime = userId => {
    setLoader(true);
    AxiosInstance.post('/timeSheet/approve', {
      userId,
      courseId: course._id,
      approverId: user._id,
    })
      .then(({data}) => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
    getCourseDetails();
  };

  const getCourseDetails = () => {
    setLoader(true);
    AxiosInstance.get('/course/details/' + course._id)
      .then(({data}) => {
        setData(data.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getCourseDetails();
  }, []);

  const RenderMembers = ({item, index}) => {
    const isOverTime =
      parseInt(item.maxHours) < parseFloat(item.completedHours).toFixed(2);
    return (
      <VStack space={2} mb={2}>
        <Card
          mb={2}
          borderRadius="10"
          borderColor="coolGray.200"
          borderWidth="1">
          <Text fontSize="md" bold color="white">
            Name: {item.name}
          </Text>
          <Text fontSize="sm" color="white">
            Role: {item.role}
          </Text>
          <Text fontSize="sm" color="white">
            Completed Hours: {parseFloat(item.completedHours).toFixed(2)} hrs
          </Text>
          <Text fontSize="sm" color="white">
            Maximum Hours: {item.maxHours} hrs
          </Text>
          {isOverTime && (
            <Text fontSize="sm" color="white">
              Overtime:
              {parseFloat(item.completedHours).toFixed(2) -
                parseInt(item.maxHours)}
              hrs
            </Text>
          )}
          {item.isApproved == false && (
            <>
              <Button
                size="sm"
                background="secondary.400"
                onPress={() => {
                  approveTime(item.memberId);
                }}
                _pressed={{backgroundColor: 'secondary.500'}}
                style={{marginTop: 10}}>
                Approve
              </Button>
            </>
          )}
        </Card>
      </VStack>
    );
  };

  return (
    <InstructorWrapper title="Dashboard">
      {loading || membersLoader ? (
        <CenterSpinner />
      ) : (
        <ScrollView>
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
                  {user?.name || ''}
                </Text>
              </Box>

              <Box>
                <Text fontSize="md" bold color="white">
                  Email:
                </Text>
                <Text fontSize="md" color="white">
                  {user?.email || ''}
                </Text>
              </Box>

              <Box>
                <Text fontSize="xl" bold color="white">
                  Members
                </Text>
                {data?.members?.map((member, index) => (
                  <RenderMembers item={member} key={index} />
                ))}
              </Box>
            </VStack>
          </Box>
        </ScrollView>
      )}
    </InstructorWrapper>
  );
};

export default CourseDetails;
