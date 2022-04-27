### Citadel System Design 

##Table of Contents

- [Table of Contents](#table-of-contents)
- [General Info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)

## General Info

Citadel System Design is a backend system able to withstand hundreds of requests per second while outputting single digit response times and generating over 99% success rate. 
The backend architecture consists of a PostgreSQL database connected by 3 Amazon Web Services (AWS) EC2 t2.micro instances all managed by an AWS Load Balancer. 
Loader.io was used to conduct the load balancer's stress test. 
While there is no demo due to AWS operational costs, there is a github link to show the exact code that made this robust backend.

## Technologies

Project is created with:

- PostgreSQL
- Express
- Node.js
- Artillery.io
- Loader.io

## Setup

To run this project, open a terminal and on the root directory run the commands:

```
npm install
npm run start
```

