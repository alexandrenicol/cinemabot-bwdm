const apiai = require('apiai');

class ApiaiPromised {
  static run(text, sessionId, contexts = null){
    return new Promise(function(resolve, reject){
      const app = apiai('6f5aa4270dab421bb12d6563b7d86352');
      var request = app.textRequest(text, {
        sessionId: sessionId
      });

      request.on('response', function(response) {
        resolve(response);
      });

      request.on('error', function(error) {
        reject(error);
      });

      request.end();
    });
  }

  static event(eventName, sessionId) {
    return new Promise(function(resolve, reject){
      const app = apiai('6f5aa4270dab421bb12d6563b7d86352');
      var event = {
        name: eventName
      }
      var request = app.eventRequest(event, {
        sessionId: sessionId
      });

      request.on('response', function(response) {
        resolve(response);
      });

      request.on('error', function(error) {
        reject(error);
      });

      request.end();
    });
  }
}

module.exports = ApiaiPromised;
