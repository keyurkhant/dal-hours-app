import Login from './screens/Login';
import AdminDashboard from './screens/admin/Dashboard';
import TaDashboard from './screens/taMarker/Dashboard';
import InstructorDashboard from './screens/instructor/Dashboard';
import AddUser from './screens/admin/AddUser';
import AddCourse from './screens/admin/AddCourse';
import CourseDetails from './screens/admin/CourseDetails';
import InstructorCourseDetails from './screens/instructor/CourseDetails';
import TACourseDetails from './screens/taMarker/CourseDetails';

const adminScreens = [
  {name: 'Dashboard', component: AdminDashboard},
  {name: 'ADD_USER', component: AddUser},
  {name: 'ADD_COURSE', component: AddCourse},
  {name: 'COURSE_DETAILS', component: CourseDetails},
];
const taScreens = [
  {name: 'Dashboard', component: TaDashboard},
  {name: 'COURSE_DETAILS', component: TACourseDetails}
];
const instructorScreens = [
  {name: 'Dashboard', component: InstructorDashboard},
  {name: 'COURSE_DETAILS', component: InstructorCourseDetails},
];
const noAuthScreens = [{name: 'Login', component: Login}];

module.exports = {adminScreens, taScreens, instructorScreens, noAuthScreens};
