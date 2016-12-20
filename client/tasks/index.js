export { default as TaskPage } from './containers/TaskPage.jsx';
export { default as TaskTable } from './containers/TaskTable.jsx';
export { default as AddTaskForm } from './components/AddTaskForm.jsx';
export { default as CategoryDropdown } from './components/CategoryDropdown.jsx';
export { default as Task } from './components/Task.jsx';
export { default as TaskModal } from './components/TaskModal/TaskModal.jsx';
export * from './actions';
import reducer from './reducer';
export default reducer;