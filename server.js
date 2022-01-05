const express = require('express');
const server = express();
const path = require('path');

server.all('/', (req, res)=>{
    res.send('The crackerkbot is now live!')
})

server.get('/redir.html', (req, res) => {
    res.sendFile(path.resolve('./redir.html'));
})
function keepAlive(){
    server.listen(3000, ()=>{console.log("Server side is ready!")});
}
module.exports = keepAlive;