import {Center, Spinner, Stack} from 'native-base';
import React from 'react';

const CenterSpinner = () => {
  return (
    <Center style={{height: '100%'}}>
      <Stack space={2}>
        <Spinner color="secondary.500" size="lg" />
      </Stack>
    </Center>
  );
};

export default CenterSpinner;
