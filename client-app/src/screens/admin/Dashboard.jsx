import React, {useEffect, useState} from 'react';
import {Box} from 'native-base';
import AxiosInstance from '../../config/Axios';
import AdminWrapper from '../../components/AdminWrapper';
import InputType from '../../components/common/Input';
import CourseList from '../../components/CourseList';

const Dashboard = ({navigation}) => {
  const [courseList, setCourseList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    AxiosInstance.get('/course/course-list')
      .then(({data}) => {
        setCourseList(data);
      })
      .catch(error => {
        setCourseList([]);
      });
  }, []);

  const handleCardPress = courseId => {
    const course = courseList.filter(c => c._id == courseId);
    navigation.navigate('COURSE_DETAILS', {course: course});
  };

  return (
    <AdminWrapper title="Dashboard" navigation={navigation}>
      <Box>
        <InputType
          placeholder="Search Courses"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          mt={4}
          mb={2}
        />
        <CourseList
          courses={courseList}
          searchQuery={searchQuery}
          onCoursePress={handleCardPress}
        />
      </Box>
    </AdminWrapper>
  );
};

export default Dashboard;
