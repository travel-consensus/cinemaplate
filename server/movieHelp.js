var rp = require('request-promise');
var Promise = require('bluebird');
var movie = module.exports;

movie.getMovieDB = function(redditObj){

    var anObject = {};
    var allCalls = [];

    //this allows for quick object lookup to verify that movieDB result matches the actual title from the reddit scrape
    var titlesArray = redditObj.forEach(function(obj){
        anObject[obj.title] = obj.url;
    })
    
    //rate limit - moviedb only allows 40 calls every 10 seconds
    //TODO add setInterval for more calls - time won't matter as this will only be a 1x a week population of the DB
    var arr = redditObj.slice(0,40);

    //build array for Promise.all
    //TODO - use bluebird's Promise.map instead
    for(var x = 0; x < arr.length; x++){
        var escaped = escape(arr[x].title);
        allCalls.push(rp('http://api.themoviedb.org/3/search/movie?query=' + escaped + '&api_key=' + process.env.MOVIEDB_TOKEN))
    }
    
    return Promise.all(allCalls)
            .then(function(res){
                return res.filter(function(obj){
                    var movie = JSON.parse(obj);
                    return movie.results.length !== 0 && anObject[movie.results[0].title];
                })    
            }).then(function(res){
                return res.map(function(obj){
                   var movie = JSON.parse(obj);
                   return {title:movie.results[0].title, summary: movie.results[0].overview, url: anObject[movie.results[0].title],
                       img: 'https://image.tmdb.org/t/p/w185/' + movie.results[0].poster_path};
               })
            })
             
}