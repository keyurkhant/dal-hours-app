import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  VStack,
  Text,
  Divider,
  Card,
  Button,
  Flex,
  Center,
  Spinner,
  Stack,
} from 'native-base';
import AxiosInstance from '../../config/Axios';
import TaWrapper from '../../components/TaWrapper';
import {CustomAlert} from '../../components/common/Alert';
import CenterSpinner from '../../components/common/CenterSpinner';

const CourseDetails = ({route, navigation}) => {
  const course = route.params.course[0];
  const [instructorDetails, setInstructorDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(state => state.user);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [shiftTime, setShiftTime] = useState(0);
  const [message, setMessage] = useState('');
  const [instanceData, setInstanceData] = useState({});
  const [timeSheetData, setTimeSheetData] = useState({});

  const getInstructorDetails = () => {
    setLoading(true);
    AxiosInstance.get('/user/user?userId=' + course.instructorId)
      .then(({data}) => {
        setInstructorDetails(data.data[0]);
      })
      .catch(error => {
        setInstructorDetails({});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getTimeSheetDetails = () => {
    setLoading(true);
    AxiosInstance.get(
      '/timeSheet/details?userId=' + user._id + '&courseId=' + course._id,
    )
      .then(({data}) => {
        if (data.success) {
          processTimeSheetData(data.data);
          setTimeSheetData(data.data);
        } else {
          setTimeSheetData({});
        }
      })
      .catch(error => {
        setInstructorDetails({});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getInstructorDetails();
    getTimeSheetDetails();
  }, [course]);

  const processTimeSheetData = timeSheetData => {
    timeSheetData.timeSheets.map(instance => {
      if (instance.endTime == 0) {
        let currentTime = Math.floor(new Date().getTime() / 1000);
        setShiftTime(currentTime - instance.startTime);
        setIsPunchedIn(true);
        setInstanceData(instance);
      } else {
        setIsPunchedIn(false);
        setShiftTime(0);
        setInstanceData(instance);
      }
    });
  };

  const punchHandler = () => {
    setLoading(true);
    if (!isPunchedIn) {
      let payload = {
        userId: user._id,
        courseId: course._id,
        approverId: course.instructorId,
      };

      AxiosInstance.post('timeSheet/add-punch', payload)
        .then(response => {
          setInstanceData({instanceId: response.data.data.instanceId});
          setIsPunchedIn(true);
        })
        .catch(error => {
          setMessage('Punch in failed. Please try again.');
          console.error('Punch in error:', error);
        })
        .then(() => {
          setLoading(false);
        });
    } else {
      const payload = {
        instanceId: instanceData.id ? instanceData.id : instanceData.instanceId,
      };
      AxiosInstance.post('timeSheet/punchout', payload)
        .then(response => {
          setIsPunchedIn(false);
          setShiftTime(0);
          setInstanceData({});
        })
        .catch(error => {
          console.error('Punch out error:', error);
        })
        .then(() => {
          setLoading(false);
        });
    }
  };

  const formatTime = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShiftTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TaWrapper title="Course Details">
      {loading ? (
        <CenterSpinner />
      ) : (
        <VStack space={4} p={4}>
          <Card>
            <Text color={'white'}>Course: {course.name}</Text>
            <Text color={'white'}>
              Term:{' '}
              {course.term.includes('_')
                ? course.term.replace('_', ' ')
                : course.term}
            </Text>
            <Text color={'white'}>Instructor: {instructorDetails?.name}</Text>
            <Text color={'white'}>
              Instructor Email: {instructorDetails?.email}
            </Text>
          </Card>

          <Divider my={2} />

          <Flex direction="row" justifyContent="space-between" mb={4}>
            <Card
              flex={1}
              mx={1}
              alignItems="center"
              justifyContent="center"
              p={2}>
              <Text fontSize="xl" bold color="white">
                Total Hours
              </Text>
              <Text fontSize="2xl" color="white">
                {timeSheetData?.totalHours
                  ? timeSheetData?.totalHours.toFixed(2)
                  : 0}
              </Text>
            </Card>
            <Card
              flex={1}
              mx={1}
              alignItems="center"
              justifyContent="center"
              p={2}>
              <Text fontSize="xl" bold color="white">
                Hours Limits
              </Text>
              <Text fontSize="2xl" color="white">
                {timeSheetData?.maxHours
                  ? timeSheetData?.maxHours.toFixed(2)
                  : 0}
              </Text>
            </Card>
          </Flex>

          <Flex direction="row" mb={4}>
            <Button
              bg="secondary.300"
              flex={1}
              pt={5}
              pb={5}
              onPress={punchHandler}
              mx={1}>
              <Text fontSize="lg" bold color="white">
                {!isPunchedIn ? 'Punch in' : 'Punch out'}
              </Text>
            </Button>
          </Flex>

          <Center>
            <Text fontSize="md" color="white" bold>
              {'Current shift time'}
            </Text>
            <Text fontSize="6xl" color="white" bold>
              {formatTime(isPunchedIn ? shiftTime : 0)}
            </Text>
          </Center>

          <CustomAlert
            message={message}
            open={Boolean(message)}
            status="success"
            noClose={true}
          />
        </VStack>
      )}
    </TaWrapper>
  );
};

export default CourseDetails;
