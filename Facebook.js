const requemise = require('requemise');

class Facebook {
  static sendGenericTemplates(recipientId, templates) {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type:"generic",
            elements:[
            ]
          }
        }
      }
    };

    for (let template of templates){
      messageData.message.attachment.payload.elements.push({
        title: template.title,
        image_url: template.image,
        default_action: {
          type: "web_url",
          url: template.url,
          webview_height_ratio: "tall"
        },
        buttons:[
          {
            type:"web_url",
            url:template.url,
            title:"Trailer",
            webview_height_ratio: "tall"
          },{
            type: "postback",
            title: "Screenings",
            payload: JSON.stringify({
              type: "WHERE_AND_WHEN",
              data: {
                movie: template.title
              }
            })
          }
        ]
      })
    }
    Facebook.sendTypingOff(recipientId);
    Facebook.callSendAPI(messageData);
  }



  static sendQuickReply(recipientId, text, replies) {
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: text,
        quick_replies: []
      }
    };

    for (let reply of replies){
      messageData.message.quick_replies.push({
        content_type: 'text',
        title: reply,
        payload: reply
      })
    }
    Facebook.sendTypingOff(recipientId);
    Facebook.callSendAPI(messageData);
  }

  static sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText
      }
    };
    Facebook.sendTypingOff(recipientId);
    Facebook.callSendAPI(messageData);
  }

  static sendTypingOn(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: 'typing_on'
    };

    Facebook.callSendAPI(messageData);
  }

  static sendTypingOff(recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: 'typing_off'
    };

    Facebook.callSendAPI(messageData);
  }


  static callSendAPI(messageData) {
    requemise.req({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: '***' },
      method: 'POST',
      json: messageData

    }).then( function (body) {

      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    })
    .catch(function(err){
      console.error("Unable to send message.");
      console.error(err);
    });
  }

  static sendWhiteListedDomains(domains) {
    var messageData = {
      whitelisted_domains: domains
    }
    Facebook.callProfileAPI(messageData);
  }

  static callProfileAPI(messageData) {
    requemise.req({
      uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
      qs: { access_token: '***' },
      method: 'POST',
      json: messageData

    }).then( function (body) {

      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    })
    .catch(function(err){
      console.error("Unable to send message.");
      console.error(err);
    });
  }
}



module.exports = Facebook;
