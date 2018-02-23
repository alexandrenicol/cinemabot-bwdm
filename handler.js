'use strict';

const moment = require('moment');
const _ = require('lodash');
const AWSLambdaRouter = require('aws-lambda-router-wn');
const Facebook = require('./Facebook.js');
const ApiaiPromised = require('./ApiaiPromised.js');
const Data = require('./Data.js');

const app = new AWSLambdaRouter();

const sendMoviesListResponse = (senderId, movies) => {
  const moviesTrailerUrl = movies.map((movie) => movie.url);
  Facebook.sendWhiteListedDomains(moviesTrailerUrl);
  const response = 'Currently, these are the movies you can see at the cinema:';
  Facebook.sendTextMessage(senderId, response);
  Facebook.sendGenericTemplates(senderId, movies);
}



app.get('/', (request, response) => {
  response(null, 'Hello world');
});

app.get('/bot', (request, response) => {
  response(null, request.queryStringParameters['hub.challenge']);
}, {responseType: 'text/html'});

app.post('/bot', (request, response) => {
  const data = request.body;

  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          Facebook.sendTypingOn(event.sender.id);

          //Sending the request to Dialogflow
          ApiaiPromised.run(event.message.text, event.sender.id)
          .then(apiaiData => {
            console.log(JSON.stringify(apiaiData));
            if (apiaiData.result.source === "domains" || apiaiData.result.actionIncomplete) {
              // if the result comes from a domain, or is a prompt, then we just pass the fulfillment
              Facebook.sendTextMessage(event.sender.id, apiaiData.result.fulfillment.speech);
            } else {
              // otherwise we process the action
              let message = '';
              switch (apiaiData.result.action) {

                case 'helloworld':
                  Facebook.sendTextMessage(event.sender.id, 'Bonjour!');
                  break;

                case 'listMovies':
                  let movies = undefined;

                  if (apiaiData.result.parameters.date !== '' && apiaiData.result.parameters.Cinemas !== '') {
                    movies = Data.getMoviesAtDateAndCinema(apiaiData.result.parameters.Cinemas, apiaiData.result.parameters.date);
                  } else if (apiaiData.result.parameters.date !== '') {
                    movies = Data.getMoviesAtDate(apiaiData.result.parameters.date);
                  } else if (apiaiData.result.parameters.Cinemas !== '') {
                    movies = Data.getMoviesAtCinema(apiaiData.result.parameters.Cinemas);
                  } else {
                    movies = Data.getMovies();
                  }
                  if(movies) sendMoviesListResponse(event.sender.id, movies);

                  break;
                case 'screeningsTime':
                  var movie = apiaiData.result.parameters.Movies;
                  var contextDate = apiaiData.result.parameters.date;
                  var contextCinemas = apiaiData.result.parameters.Cinemas;

                  var dayFormatted = moment(contextDate).format('dddd');
                  Facebook.sendTextMessage(event.sender.id, 'These are the screenings for '+movie+' at '+ contextCinemas +' on '+ dayFormatted +':');
                  Facebook.sendTypingOn(event.sender.id);
                  var screenings = Data.getScreeningsFromNameAndDateAndCinema(movie, contextDate, contextCinemas).screenings.hours;
                  message = screenings.join(', ');
                  setTimeout(function() {Facebook.sendTextMessage(event.sender.id, message)}, 1000);
                  break;
                case 'getMovieScreenings':
                  var movie = apiaiData.result.parameters.Movies;
                  Facebook.sendTextMessage(event.sender.id, 'This is where and when you can see '+movie+':');
                  Facebook.sendTypingOn(event.sender.id);
                  var screenings = Data.getScreeningsFromName(movie).screenings;
                  var screeningMessages = [];
                  for (let cinema in screenings){
                    let screeningsForCinema = screenings[cinema];
                    screeningsForCinema = screeningsForCinema.map(screening => moment(screening).format('dddd'));
                    screeningMessages.push(`• ${cinema}: on ${screeningsForCinema.join(' and ')}`);
                  }
                  message = screeningMessages.join('\r\n');
                  setTimeout(function() {Facebook.sendTextMessage(event.sender.id, message)}, 1000);
                  break;

                case 'triggerevent':
                  ApiaiPromised.event('FEEDBACK', event.sender.id)
                  .then(apiaiData => {
                    Facebook.sendQuickReply(event.sender.id, 'Do you like me?', ['💔','❤️']);
                  });
                  break;
                case 'feedback.positive':
                  Facebook.sendTextMessage(event.sender.id, '❤️');

                  break;
                case 'feedback.negative':
                  Facebook.sendQuickReply(event.sender.id,'💔');

                  break;


                default:
                  message = 'Oops, I tripped! Maybe try again :)';
                  Facebook.sendTextMessage(event.sender.id, message);
                  break;
              }
            }
          })
        } else if (event.postback) {
          let payload = JSON.parse(event.postback.payload);
          console.log(payload);
          if (payload.type === "WHERE_AND_WHEN"){
            let movie = payload.data.movie;
            Facebook.sendTypingOn(event.sender.id);
            ApiaiPromised.run(`Where can I see ${movie}`, event.sender.id)
            .then(apiaiData => {
              console.log(JSON.stringify(apiaiData));

              const contextInfo = _.find(apiaiData.result.contexts, {"name": "info"})
              let contextDate = undefined;
              let contextCinemas = undefined;
              if(contextInfo){
                if(contextInfo.parameters.date !== "") {
                  contextDate = contextInfo.parameters.date;
                }
                if(contextInfo.parameters.Cinemas !== "") {
                  contextCinemas = contextInfo.parameters.Cinemas;
                }
              }

              console.log('info', contextDate, contextCinemas, movie);

              if (contextDate && contextCinemas) {
                // give screening for this movie at this cinema for this day
                const dayFormatted = moment(contextDate).format('dddd');
                Facebook.sendTextMessage(event.sender.id, 'These are the screenings for '+movie+' at '+ contextCinemas +' on '+ dayFormatted +':');
                Facebook.sendTypingOn(event.sender.id);
                const screenings = Data.getScreeningsFromNameAndDateAndCinema(movie, contextDate, contextCinemas).screenings.hours;
                const message = screenings.join(', ');
                setTimeout(function() {Facebook.sendTextMessage(event.sender.id, message)}, 1000);

              } else if (contextDate) {
                // give screening for this movie at one date
                const dayFormatted = moment(contextDate).format('dddd')
                Facebook.sendTextMessage(event.sender.id, 'These are the screenings for '+movie+' on '+ dayFormatted +':');
                Facebook.sendTypingOn(event.sender.id);
                const screenings = Data.getScreeningsFromNameAndDate(movie, contextDate).screenings;
                const screeningMessages = [];
                for (let cinema in screenings){
                  let screeningsForCinemaAnDate = screenings[cinema][0].hours;
                  screeningMessages.push(`• ${cinema}: at ${screeningsForCinemaAnDate.join(', ')}`);
                }

                const message = screeningMessages.join('\r\n');
                setTimeout(function() {Facebook.sendTextMessage(event.sender.id, message)}, 1000);

              } else if (contextCinemas) {
                // give screening for this movie at the cinema
                Facebook.sendTextMessage(event.sender.id, 'These are the screenings for '+movie+' at '+ contextCinemas +':');
                Facebook.sendTypingOn(event.sender.id);
                const screenings = Data.getScreeningsFromNameAndCinema(movie, contextCinemas).screenings[contextCinemas];
                const screeningMessages = [];
                screenings.forEach(screeningDate => {
                  screeningMessages.push(`• ${moment(screeningDate.date).format('dddd')}: at ${screeningDate.hours.join(', ')}`);
                })
                const message = screeningMessages.join('\r\n');
                setTimeout(function() {Facebook.sendTextMessage(event.sender.id, message)}, 1000);

              } else {
                Facebook.sendTextMessage(event.sender.id, 'This is where and when you can see '+movie+':');
                Facebook.sendTypingOn(event.sender.id);
                const screenings = Data.getScreeningsFromName(movie).screenings;
                const screeningMessages = [];
                for (let cinema in screenings){
                  let screeningsForCinema = screenings[cinema];
                  screeningsForCinema = screeningsForCinema.map(screening => moment(screening).format('dddd'));
                  screeningMessages.push(`• ${cinema}: on ${screeningsForCinema.join(' and ')}`);
                }
                const message = screeningMessages.join('\r\n');
                setTimeout(function() {Facebook.sendTextMessage(event.sender.id, message)}, 1000);
              }

            })
            .catch(error => {
              console.log(error);
              Facebook.sendTextMessage(event.sender.id, ':(');
            })
          }
        }
      })
    })
  }
  response(null, true);
});

module.exports.cinemabot = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  app.serve(event, callback);
};
