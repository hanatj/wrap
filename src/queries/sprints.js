const connection = require('../database/db_connection.js');
require('env2')('./config.env');


const getAllSprints = (projectId, cb) => {
  const sql = {
    text: `SELECT sprints.id, sprints.title, sprints.progress FROM sprints WHERE project_id= $1`,
    values: [projectId] };
  connection.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, res);
    }
  });
};


const getFinishedSprints = (projectId, cb) => {
  const sql = {
    text: `SELECT sprints.id, sprints.title, sprints.progress FROM sprints WHERE project_id= $1 AND closed != False`,
    values: [projectId] };
  connection.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, res);
    }
  });
};

const getCurrentSprints = (projectId, cb) => {
  const sql = {
    text: `SELECT sprints.id, sprints.title, sprints.progress FROM sprints WHERE project_id= $1 AND closed = False`,
    values: [projectId] };
  connection.query(sql, (err, res) => {
    if (err) {
      cb(err);
    } else {
      cb(null, res);
    }
  });
};


module.exports={
  getAllSprints,
  getFinishedSprints,
  getCurrentSprints
}