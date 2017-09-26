module.exports = {
  getHome: require('./getHome.js'),
  postSignup: require('./postSignup.js'),
  postLogin: require('./postLogin.js'),
  getProjectPage: require('./getProjectPage.js'),
  postAddTask: require('./postAddTask.js'),
  postAddProject: require('./postAddProject.js'),
  getUsersTasks: require('./getUsersTasks.js'),
  getDashboard: require('./getDashboard.js'),
  getTask: require('./getTask.js'), //
  getComments: require('./getComments.js'), //
  getFeatures: require('./getFeatures.js'), //
  getCurrentProjects: require('./getCurrentProjects.js'),
  getFinishedProjects: require('./getFinishedProjects.js'),
  getLogout: require('./getLogout'),
  getStateTasks: require('./getStateTasks.js'),
  getCurrentSprint: require('./getCurrentSprint.js'),
  getBacklogTasks: require('./getBacklogTasks.js'),
  postCreateSprint: require('./postCreateSprint.js'),
  postAddFeature: require('./postAddFeature.js'),
  postAddComment: require('./postAddComment.js'), 
  getLogs: require('./getLogs.js'),
  getMembers: require('./getMembers.js'),
  postAddMember: require('./postAddMember.js')
};
