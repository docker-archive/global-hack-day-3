![Owler](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/owler.png?raw=true)
# Owler - The Docker Mobile Management App
Owler is a multiplatform mobile app to manage docker using the Docker Remote API. It aim to facilitate the management and the monitoring of containers.
## Screenshots
![Dashboard](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/dashboard.png?raw=true)
![Containers](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/containers.png?raw=true)
![Container Stop](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/containerStop.png?raw=true)
![Container Inspect](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/containerInspect.png?raw=true)
![Container Logs](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/containerLogs.png?raw=true)
![Monitoring](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/containerMonitoring.png?raw=true)
![Monitoring](https://github.com/GabrielRoquigny/global-hack-day-3/blob/master/Owler/images/monitoring.gif?raw=true)
## Dependencies 
* Docker API v1.19+ (for stats with a stream to false)
* A running docker daemon with -api-enable-cors flag

## Quickstart
1. Run Docker (Don't forget to activate the REST API) :

  ```
    docker -H tcp://0.0.0.0:4243 -H unix:///var/run/docker.sock -api-enable-cors -d
  ```

2. [Android users] Install the apk file (available in dist folder) manually or using adb

  ```
    adb install Owler.apk
  ```

3. [Other devices] Buy an android ;) Or you can build the app manually using ionic.

  ```
    ionic build ios
  ```

## Stack
* [Ionic](http://ionicframework.com/)
* [AngularJS](https://angularjs.org/)
* [Angular-chart.js](http://jtblin.github.io/angular-chart.js/)
