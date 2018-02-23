const _ = require('lodash');

const data = {
  movies: [
    {
      title: "Black Panther",
      url: "https://www.youtube.com/watch?v=xjDjIWPwcPU",
      image: "https://www.verdict.co.uk/wp-content/uploads/2018/02/black_panther_11.jpg",
      screenings : [
        {
          date: "2018-02-24",
          hours: ["11:30", "14:30", "18:00", "21:00"],
          cinema: "Komedia"
        },
        {
          date: "2018-02-25",
          hours: ["11:00", "14:00", "17:00", "20:00"],
          cinema: "Komedia"
        },
        {
          date: "2018-02-24",
          hours: ["10:20", "11:40", "13:20", "14:40", "16:20", "17:40", "19:20", "20:40"],
          cinema: "Cineworld"
        },
        {
          date: "2018-02-25",
          hours: ["10:20", "11:40", "13:20", "14:40", "16:20", "17:40", "19:20", "20:40"],
          cinema: "Cineworld"
        },
        {
          date: "2018-02-24",
          hours: ["10:15", "13:00", "14:00", "16:15", "17:15", "19:30", "20:30"],
          cinema: "Odeon"
        },
        {
          date: "2018-02-25",
          hours: ["13:00", "14:00", "16:15", "17:15", "19:30", "20:30"],
          cinema: "Odeon"
        }
      ]
    },
    {
      title: "The Shape of Water",
      url: "https://www.youtube.com/watch?v=XFYWazblaUA",
      image: "https://www.cartoonbrew.com/wp-content/uploads/2017/12/shapeofwater_main-1280x600.jpg",
      screenings : [
        {
          date: "2018-02-24",
          hours: ["15:00", "21:30"],
          cinema: "Komedia"
        },
        {
          date: "2018-02-25",
          hours: ["15:00", "20:30"],
          cinema: "Komedia"
        },
        {
          date: "2018-02-24",
          hours: ["13:00", "18:15"],
          cinema: "Duke"
        },
        {
          date: "2018-02-25",
          hours: ["13:00", "18:15"],
          cinema: "Duke"
        },
        {
          date: "2018-02-24",
          hours: ["14:00", "16:50", "19:40"],
          cinema: "Cineworld"
        },
        {
          date: "2018-02-25",
          hours: ["14:00", "16:50", "19:40"],
          cinema: "Cineworld"
        }
      ]
    },
    {
      title: "I, Tonya",
      url: "https://www.youtube.com/watch?v=OXZQ5DfSAAc",
      image: "http://ichef.bbci.co.uk/wwfeatures/wm/live/1280_640/images/live/p0/5q/hv/p05qhvg5.jpg",
      screenings : [
        {
          date: "2018-02-24",
          hours: ["12:00"],
          cinema: "Komedia"
        },
        {
          date: "2018-02-25",
          hours: ["17:45"],
          cinema: "Komedia"
        }
      ]
    },
    {
      title: "Lady Bird",
      url: "https://www.youtube.com/watch?v=cNi_HC839Wo",
      image: "https://spectator.imgix.net/content/uploads/2018/02/17Febnewfilm.jpg?auto=compress,enhance,format&crop=faces,entropy,edges&fit=crop&w=820&h=550",
      screenings : [
        {
          date: "2018-02-24",
          hours: ["16:00", "21:00"],
          cinema: "Duke"
        },
        {
          date: "2018-02-25",
          hours: ["10:30", "16:00", "21:00"],
          cinema: "Duke"
        }
      ]
    },
    {
      title: "The Greatest Showman",
      url: "https://www.youtube.com/watch?v=AXCTMGYUg9A",
      image: "https://assets.vogue.com/photos/598de5ef068a3216afff9d06/master/pass/01-the-greatest-showman-hugh-jackman-vogue-september-issue-2017.jpg",
      screenings : [
        {
          date: "2018-02-24",
          hours: ["15:30"],
          cinema: "Odeon"
        },
        {
          date: "2018-02-25",
          hours: ["15:30"],
          cinema: "Odeon"
        }
      ]
    },
    {
      title: "Finding Your Feet",
      url: "https://www.youtube.com/watch?v=6-Cp6ba2Y0g",
      image: "https://www.entertainment-focus.com/wp-content/uploads/2017/07/Webp.net-resizeimage-8-770x433.jpg",
      screenings : [
        {
          date: "2018-02-24",
          hours: ["12:00", "14:50", "17:40", "20:20"],
          cinema: "Odeon"
        }/*,
        {
          date: "2018-02-25",
          hours: ["12:00", "14:50", "17:40", "20:20"],
          cinema: "Odeon"
        }*/
      ]
    }
  ],
  cinemas: [
    {
      name: "Odeon",
      url: "https://www.odeon.co.uk/cinemas/brighton/71/"
    },
    {
      name: "Cineworld",
      url: "https://www.cineworld.co.uk/cinemas/brighton"
    },
    {
      name: "Duke",
      url: "https://www.picturehouses.com/cinema/Duke_Of_Yorks/Whats_On"
    },
    {
      name: "Komedia",
      url: "https://www.picturehouses.com/cinema/Dukes_At_Komedia/Whats_On"
    }
  ]
}

class Data {
  static getMovies() {
    return data.movies;
  }
  static getMoviesTitle() {
    let movies = data.movies;
    let moviesTitle = movies.map((movie) => movie.title);
    return moviesTitle;
  }
  static getMoviesAtCinema(cinema) {
    let movies = data.movies;
    movies = _.filter(movies, (movie) => {
      let screenings = movie.screenings;

      if (_.find(screenings, {'cinema': cinema})){
        return true;
      } else {
        return false;
      }
    });
    let moviesTitle = movies.map((movie) => movie.title);
    return movies;
  }
  static getMoviesAtDate(date){
    let movies = data.movies;
    movies = _.filter(movies, (movie) => {
      let screenings = movie.screenings;

      if (_.find(screenings, {'date': date})){
        return true;
      } else {
        return false;
      }
    });
    let moviesTitle = movies.map((movie) => movie.title);
    return movies;
  }
  static getMoviesAtDateAndCinema(cinema, date){
    let movies = data.movies;
    movies = _.filter(movies, (movie) => {
      let screenings = movie.screenings;

      if (_.find(screenings, {'date': date, 'cinema': cinema})){
        return true;
      } else {
        return false;
      }
    });
    let moviesTitle = movies.map((movie) => movie.title);
    return movies;
  }
  static getScreeningsFromName(name) {
    let movies = data.movies;
    let movie = _.find(movies, {'title': name});
    if (movie.screenings) {
      let data = {
        title: name,
        screenings: {}
      }

      movie.screenings.forEach(screening => {
        if (data.screenings[screening.cinema]) {
          data.screenings[screening.cinema].push(screening.date);
        } else {
          data.screenings[screening.cinema] = [screening.date];
        }
      })
      return data;
    };
    return false;
  }
  static getScreeningsFromNameAndCinema(name, cinema) {
    let movies = data.movies;
    let movie = _.find(movies, {'title': name});

    if (movie.screenings) {
      let data = {
        title: name,
        cinema: cinema,
        screenings: {}
      }

      movie.screenings.forEach(screening => {
        if(screening.cinema === cinema){
          if (data.screenings[screening.cinema]) {
            data.screenings[screening.cinema].push(screening);
          } else {
            data.screenings[screening.cinema] = [screening];
          }
        }
      })
      return data;
    };
    return false;
  }
  static getScreeningsFromNameAndDate(name, date) {
    let movies = data.movies;
    let movie = _.find(movies, {'title': name});

    if (movie.screenings) {
      let data = {
        title: name,
        date: date,
        screenings: {}
      }

      movie.screenings.forEach(screening => {
        if(screening.date === date){
          if (data.screenings[screening.cinema]) {
            data.screenings[screening.cinema].push(screening);
          } else {
            data.screenings[screening.cinema] = [screening];
          }
        }
      })
      return data;
    };
    return false;
  }
  static getScreeningsFromNameAndDateAndCinema(name, date, cinema) {
    let movies = data.movies;
    let movie = _.find(movies, {'title': name});

    if (movie.screenings) {
      let data = {
        title: name,
        date: date,
        cinema: cinema,
        screenings: {}
      }

      movie.screenings.forEach(screening => {
        if(screening.date === date && screening.cinema === cinema){

          data.screenings = screening;

        }
      })
      return data;
    };
    return false;
  }
}

// console.log(JSON.stringify(Data.getMovies()));
// console.log(JSON.stringify(Data.getMoviesAtCinema('Duke')));
// console.log(JSON.stringify(Data.getMoviesAtDate('2018-02-25')));
// console.log(JSON.stringify(Data.getMoviesAtDate('2018-02-24')));
// console.log(JSON.stringify(Data.getMoviesAtDateAndCinema('Odeon', '2018-02-25')));
// console.log(JSON.stringify(Data.getMoviesAtDateAndCinema('Odeon', '2018-02-24')));
 //console.log(JSON.stringify(Data.getScreeningsFromName('Black Panther')));
 //console.log(JSON.stringify(Data.getScreeningsFromName('Finding Your Feet')));
 //console.log(JSON.stringify(Data.getScreeningsFromNameAndCinema('Black Panther', 'Odeon')));
 //console.log(JSON.stringify(Data.getScreeningsFromNameAndDate('Black Panther', '2018-02-25')));
 //console.log(JSON.stringify(Data.getScreeningsFromNameAndDateAndCinema('Black Panther', '2018-02-25', 'Odeon')));

module.exports = Data;
