'use strict';
const service = require('feathers-rethinkdb');
const hooks = require('./hooks');
const config = require('config');
const db = config.get('dbName')
const db_host = config.get('db_host')
const db_port = config.get('db_port')
const r = require('rethinkdbdash')({
    db: db,
    host: db_host,
    port:db_port
  });
const table = config.get('tbl_attachment')

module.exports = function() {
  const app = this;
  
  const options = {
    Model: r,
    // db: db, //must be on the same connection as rethinkdbdash
    name: table,
     // Enable pagination
    paginate: {
        default: 50,
        max: 50
    }
  };

  // Initialize our service with any options it requires 
  app.use('/task_attachment', service(options));

  // Get our initialize service to that we can bind hooks
  const taskAttachmentService = app.service('/task_attachment');
  app.service('task_attachment').init().then(task_attachment => {
      console.log('Created task_attachment', task_attachment)
  });

 
  // Set up our before hooks
  taskAttachmentService.before(hooks.before);

  // Set up our after hooks
  taskAttachmentService.after(hooks.after);


    taskAttachmentService.filter(function (data, connection, hook) {
    console.log("<========Attachment Tags Filter Call=====>", data);
    var userId = connection.userId;
    if (!userId) {
      return false;
    }
    var self = this;

    return app.service('tasks').get(data.task_id).then(response => {
      var dataTask=response
      // console.log("<========Attachment data reponse=====>",dataTask);  
      return app.service('project').get(dataTask.project_id).then(response => {
       var dataProject=response
        // console.log("<========Attachment project response=====>",response);  
      // console.log("<========Tassk Filter userid=====>",userId);
      if (dataProject && dataProject.project_privacy === "0") {
        return data;
      } else {
        //  console.log("<========Tassk Filter Call=====>",userId);
        return app.service('projectmember').find({ query: { 'user_id': userId, project_id: dataProject.id } }).then(response => {
          // console.log("<========Attachment projectmember  Call=====>",response);
          if (response && response.length > 0) {
            return data;
          } else {
            return false;
          }
        })

      }
    })

    })

    

  });

}