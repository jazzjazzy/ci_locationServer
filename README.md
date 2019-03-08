To start Location server  
  
start with docker
=============
`$> docker-compose up -d`  
docker should setup nodejs mongo and mongo-express containers and start the server.js script. so you only need to run this and your ready to go.

Get server IP
=============
if network not connectioned check address is correct for client against this server, to get the ip  
`$> docker inspect nodejs`   
find address in json path  
{NetworkSettings: { Networks: {IPAddress : [ipaddress] }}}   


Manual start
=============
if you need to start server manually you will need to connect to the nodejs container shell and run server.js  
`$> docker exec -it nodejs bash`  
`$> node ws`  