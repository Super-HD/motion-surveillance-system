# Welcome to our Motion Surveillance System App

> Our Project is a Motion Surveillance System. The Premise is that there will be a central server, and multiple client video cameras. Client Cameras will send their live stream data to the central server, and the server will be able to monitor all live streams from all cameras. If any motion has been detected from any of these cameras, a motion-snapshot clip will be recorded upon time of detection, which will be uplodaded to the server for checking.

## Architecture

> The Project is split up into Four Modules. Firstly, is the Front-End Web App which the user interacts with as the central server. This is created using a MEAN Stack model utilizing MongoDB, Express.js, Angular.js & Node.js. Secondly, is the Video Capture + Video File Creation Module. We used a popular real-time image-processing library called OpenCV for this module. Thirdly, is the Database Module. We developed a Database Model via MongoDB for storing all required information the server requires of its clients, and also hosted an AWS S3 Bucket for storing motion-snapshot clips. Lastly is the server. The server is powered using Node.js, and connects with the front-end app using RESTFul endpoints. To enable our app to be deployed online, we used AWS S3 bucket for storing motion clips on the cloud, DigitalOcean Virtual Server for hosting our web application online, and a MongoDB Atlas Cluster for storing database-related information online. These technologies have all integrated and connected as one.

## Instructions

The Project is split into three components, the back-end folder, front-end folder, & the client-folder (where the client will initiate their camera for live stream). Each folder contains a separate node_modules folder which you will have to call npm install in order to install all the required packages.

To simulate a client-server environment locally, You will need to configure your HTTP endpoints into localhost, Otherwise, you can perform the same integration steps we used and instead deploy a DigitalOcean server online, alongside an AWS S3 Bucket for storing video Clips, & a MongoDB Atlas Cluster for storing database information.

Note that there are several environmental variables you will have to configure if you are following our integration methodology. These are shown in the .env files you can fill out.

## Demo

> http://161.35.110.201:4200/

## Install

```sh
npm install
```

## Usage

```sh
npm start
```

## Authors

👤 **Terence Ng**

* Website: https://www.terencehh.engineer/
* Github: [@terencehh](https://github.com/terencehh)
* LinkedIn: [@terencenghh](https://linkedin.com/in/terencenghh)

👤 **Cheng Zeng**

* Github: [@czen0002](https://github.com/czen0002)

👤 **Peisong Yang**

* Github: [@ShawnYPS](https://github.com/ShawnYPS)
