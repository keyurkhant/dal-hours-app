import React from 'react';
import {FlatList, VStack, Text, Card, Pressable} from 'native-base';

const CourseList = ({courses, searchQuery, onCoursePress}) => {
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return filteredCourses.length > 0 ? (
    <FlatList
      data={filteredCourses}
      keyExtractor={item => item._id.toString()}
      renderItem={({item}) => (
        <Pressable onPress={() => onCoursePress(item._id)}>
          <Card
            mb={2}
            borderRadius="10"
            borderColor="coolGray.200"
            borderWidth="1">
            <VStack space={1} p={1}>
              <Text fontSize="lg" bold color="white">
                {item.name}
              </Text>
              <Text fontSize="sm" color="white">
                {item.term.includes('_')
                  ? item.term.replace('_', ' ')
                  : item.term}
              </Text>
            </VStack>
          </Card>
        </Pressable>
      )}
    />
  ) : (
    <Text fontSize="md" bold color="white" ml={2}>
      No Courses Found.
    </Text>
  );
};

export default CourseList;
