Bar chart delivery test for Fifty Five March 2017
=================================================

#### Installation and project launch
Classic install command for development project environment.
```
npm install
```
This command will run automatically gulp tasks to setup and run the project

##### Gulp Manual install
To install project dependencies, type this command to install<br>
the project through gulp.
```
npm run gulp
```
This will install all the necessary gulp suite as well as sass,<br>
compass mixins, and livere load web server.<br><br>
Once installed, the server will be launched and a watch task will<br>
run, meant for a webstorm or sublime text use.

#### Modifying the project
To modify the project and see results, just run this :
```
gulp
```
This will build the project, sending all resources to the dist directory,<br>
then launch the local web-server and run the watch task for live reloading.

#### About the project
This project was supposed to be delivered developed in native Javascript<br>
without any library or framework.

##### Exercise reminder
>The online Playing Platform exposes players scores over time.<br>
>It can provide you with data at the following url :<br>
>[http://cdn.55labs.com/demo/api.json](http://cdn.55labs.com/demo/api.json)<br><br>
> 
>The objective is to build a good looking HTML page which will query the service and display :
> - a bar chart comparing the scores of the players over time
> - clicking on a specific bar should populate a detail div and display aggregated numbers
> - not required but a plus : update url on details view, and enable direct url access
> 
> Constraints : no charting library should be used for this test.