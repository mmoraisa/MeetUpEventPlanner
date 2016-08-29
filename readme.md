# Meet-Up Event Planner

There is a repository to store my Meet-Up Event Planner Web Application for my nanodegree studies. This application is very simple, but I used some technologies on this.

  - Jade (node template engine)
  - Gulp (streaming build system)
  - LESS (dynamic style sheet language)
  - Bootstrap (UI boilerplate)

### How to run

The Meet-Up Event Planner requires [Node.js](https://nodejs.org/) v4+ to run.

Clone this repository.

```sh
$ git clone https://github.com/mmoraisa/MeetUpEventPlanner
```

Install the dependencies.

```sh
$ npm install
```

To fill location automatic you need to put a valid API_KEY from Google API in the src/js/app.js file.

Run gulp streaming build system...

```sh
$ gulp
```
It will create the /dist folder that contains the web application files. You can run some webapp servers and open the event.html or account.html files.
