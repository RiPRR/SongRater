# [SongRater](https://songrater.herokuapp.com/)
A system used to collect sentiment analysis on song lyrics


## RESEARCH PAPER

[COMPREHENSIVE SYSTEM OVERVIEW/EXPERIMENTS]()

## API

### SUPPORTED QUERIES

##### `...` in the below examples refers to localhost:port if you're self serving or `https://songrater.herokuapp.com` if you wish to query from my set

#### Ratings for a particular song
* Send a `GET` request to `.../ratingsApi/song/:Song` where `:Song` should be replaced with the name of the song 

* ie: `.../ratingsApi/song/isolation` should return a list of ratings objects associated with the song `isolation`

#### Ratings for a particular user
* Send a `GET` request to `.../ratingsApi/user/:User` 

* where `:User` should be replaced with the name of the user

* ie: `.../ratingsApi/song/admin` should return a list of ratings by user `admin`

#### Ratings for a particular song and within a correlation threshold
* Send a `GET` request to `.../ratingsApi/correlation/:Song/:Low/:High` 

* where `:Song` should be replaced with the name of the song
`:Low` should be replaced with the lower bound of correlation and `:High` should be the upper bound. This should return all ratings for a song that resulted in a total correlation score that includes the lower bound and excludes the upper.

* ie: `.../ratingsApi/correlation/:what_i_got/:20/:40` should return a list of ratings for the song `what_i_got` with a correlation between 20 and 40 

### SONG NAMES
as of right now there are 5 songs in the database: below is thr real name of the song associated with the name you should use to query.
* "What I Got" by Sublime : `what_i_got`
* Isolation" by Ty Segall : `isolation`
* "Where Is My Mind" by The Pixies : `where_is_my_mind`
* "Intro/Stronger than me" by Amy Winehouse : `intro_-_stronger_than_me`
* "You Never Give Me Your Money" by The Beatles : `you_never_give_me_your_money`



