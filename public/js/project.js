(function () {
  /* on load */
  renderBacklog();

  var statesDivs = document.querySelectorAll('.sprintStates .stateColumn');
  if (statesDivs[0]) {
    statesArray = Array.prototype.slice.call(statesDivs);
    statesArray.map(function (stateDiv) {
      loadState(parseInt(stateDiv.id.split('-')[1]));
    });
  }
  // document.getElementById('state-88').addEventListener('load', function (e) {
  //   alert('dsad');
  // });
  /* */
  /* Start new Sprint */
  var startSprintButton = document.getElementById('startSprintButton');
  if (startSprintButton) {
    startSprintButton.addEventListener('click', function () {
      document.getElementById('startSprintForm').classList.remove('hidden');
      document.getElementsByClassName('startSprintDiv')[0].remove();
      startSprintFormListener();
    });
  }

  /* Add New Task */
  var addTaskButton = document.getElementById('addTaskButton');
  var addTaskDiv = document.getElementsByClassName('addTaskDiv')[0];
  var backlogTasksDiv = document.querySelector('#backlog .stateTasks');

  addTaskButton.addEventListener('click', function (e) {
    renderAddTaskForm(addTaskDiv);
    addTaskFormListener(function (err, res) {
      if (err) {
        backlogTasksDiv.innerHTML = '<h2>Connection Error!</h2>';
      } else {
        document.querySelector('#addTaskForm input').value = '';
        loading(backlogTasksDiv);
        renderBacklog();
      }
    });
  });
  /* Tabs */
  var linkHash = window.location.hash;
  var projectContent = document.getElementsByClassName('content-wrapper')[0];
  if (linkHash === '#members') {
    loading(projectContent);
    render(window.location.pathname + '/members', projectContent);
    addMemberFormListener();
  }

  document.getElementById('membersButton').addEventListener('click', function (event) {
    loading(projectContent);
    render(window.location.pathname + '/members', projectContent);
    addMemberFormListener();
  });

  if (linkHash === '#logs') {
    loading(projectContent);
    render(window.location.pathname + '/logs', projectContent);
  }

  document.getElementById('logsButton').addEventListener('click', function (event) {
    loading(projectContent);
    render(window.location.pathname + '/logs', projectContent);
  });

  document.getElementById('projectsButton').addEventListener('click', function (event) {
    window.location.hash = '';
    window.location.reload();
  });

  /* /tabs */
})();

function loading (container) {
  if (!container) {
    return console.error('Cannot load, no container found.');
  }
  container.innerHTML = '<h2>Loading.....</h2>';
}
function getData (url, cb) {
  apiReq(url,'GET', function (err, data) {// eslint-disable-line
    if (err) {
      cb('Connection Error!');
    } else {
      cb(null, data);
    }
  });
}

function render (url, container) {
  getData(url, function (err, data) {
    if (err) {
      container.innerHTML = '<h2>' + err + '</h2>';
    } else {
      container.innerHTML = data;
    }
  });
}

function loadState (id) {
  const tasksContainer = document.querySelector('#state-' + id + '>.stateTasks');
  loading(tasksContainer);

  // apiReq is defined in request.js
  apiReq(window.location.pathname + '/stateTasks/' + id, 'GET', function (err, data) {
    if (err) {
      tasksContainer.innerHTML = '<h1>Failed to Load</h1>';
    } else {
      tasksContainer.innerHTML = data;
    }
  });
}
function renderBacklog () {
  var tasksContainer = document.querySelector('#backlog .stateTasks');
  loading(tasksContainer);
  // apiReq is defined in request.js
  apiReq(window.location.pathname + '/backlogTasks', 'GET', function (err, data) {
    if (err) {
      tasksContainer.innerHTML = '<h1>Failed to Load</h1>';
    } else {
      tasksContainer.innerHTML = data;
    }
  });
}

function startSprintFormListener () {
  var startSprintForm = document.getElementById('startSprintForm');
  if (startSprintForm) {
    startSprintForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var startSprintData = event.target;
      var duration = parseInt(startSprintData[0].value) * parseInt(startSprintData[1].value);
      apiReq(window.location.pathname + '/createSprint', 'POST', function (err, data) {
        if (err) {
          alert('connection error');
        } else {
          if (data === '/rel') {
            window.location.reload();
          }
        }
      }, JSON.stringify(duration));
    });
  }
}
function renderAddTaskForm (container) {
  container.innerHTML = '<form id="addTaskForm" action="' + window.location.pathname + '/addTask" method="post">' +
                          '<label>Title : <input type="text" name="title" value="" placeholder="Enter task name.." required></label>' +
                          '<label>priority :' +
                            '<select name="priority">' +
                              '<option value="1">1 - Very high</option>' +
                              '<option value="2">2</option>' +
                              '<option value="3">3</option>' +
                              '<option value="4">4</option>' +
                              '<option value="5">5 - Very low</option>' +
                            '</select>' +
                          '</label>' +
                          '<input type="submit" name="submit" value="Create Task!">' +
                        '</form>';
}
function addTaskFormListener (cb) {
  var addTaskForm = document.getElementById('addTaskForm');
  if (addTaskForm) {
    addTaskForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var addTaskData = event.target;
      var addTaskReq = {
        title: addTaskData[0].value,
        priority: addTaskData[1].value
        // duration: parseInt(addTaskData[4].value) * parseInt(addTaskData[5].value)
      };
      apiReq(window.location.pathname + '/addTask', 'POST', cb, JSON.stringify(addTaskReq));
    });
  }
}

function addMemberFormListener () {
  var addMemberForm = document.getElementById('addMemberForm');
  if (addMemberForm) {
    addMemberForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var addMemberData = event.target;
      var addMemberReq = {
        email: addMemberData[0].value,
        role: addMemberData[1].value
      };

      apiReq(window.location.pathname + '/addMember', 'POST', function (err, res) {
        if (err) {
          alert('eee', err);
        } else {
          document.getElementById('userEmail').value = '';
          document.getElementById('role').value = '';
          window.location.reload();
        }
      }, JSON.stringify(addMemberReq));
    });
  }
}
/* Drag and Drop */
function findParetId (listNodeObj, idString) {
  if (listNodeObj.id.startsWith(idString)) {
    return listNodeObj;
  }
  return findParetId(listNodeObj.parentElement, idString);
}
function allowDrop (ev) {
  ev.preventDefault();
}

function drag (ev) {
  var task = findParetId(ev.target, 'task');
  ev.dataTransfer.setData('text', task.id);
}
function drop (ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('text');
  var state = findParetId(ev.target, 'state');
  var sprint = findParetId(ev.target, 'sprint');
  data = document.getElementById(data);
  state.appendChild(data);
  var taskId = parseInt(data.id.split('-')[1]);
  var stateId = parseInt(state.id.split('-')[1]);
  var sprintId = parseInt(sprint.id.split('-')[1]);
  setState(taskId, stateId, sprintId, function (err, res) {
    if (err) {
      alert('Connection Error!');
    }
  });
}
function dropBacklog (ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('text');
  data = document.getElementById(data);
  var backlog = findParetId(ev.target, 'backlog');
  backlog.appendChild(data);
  var taskId = parseInt(data.id.split('-')[1]);
  moveToBacklogReq(taskId, function (err, res) {
    if (err) {
      alert('Connection Error!');
    }
  });
}
function moveToBacklogReq (taskId, cb) {
  var data = {taskId: taskId};
  apiReq(window.location.pathname + '/moveToBacklog', 'POST', cb, JSON.stringify(data));
}
function setState (taskId, stateId, sprintId, cb) {
  var data = {taskId: taskId, stateId: stateId, sprintId: sprintId};
  apiReq(window.location.pathname + '/setState', 'POST', cb, JSON.stringify(data));
}
