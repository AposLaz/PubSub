var amqp = require('amqplib');
var amqp_callback = require('amqplib/callback_api');


const fs = require('fs');
const csvWriter = require('csv-write-stream')

const write_in_csv_T2 = () => {
    if (!fs.existsSync('./routers/T2.csv'))
        writer2 = csvWriter({ headers: ["T2"]});
    else
        writer2 = csvWriter({sendHeaders: false});

    writer2.pipe(fs.createWriteStream('./routers/T2.csv', {flags: 'a'}));
    writer2.write({
    T2: Date.now(),
    });
    writer2.end();
}

const write_in_csv_error = () => {
    if (!fs.existsSync('./routers/Error.csv'))
        writer3 = csvWriter({ headers: ["Error"]});
    else
        writer3 = csvWriter({sendHeaders: false});

    writer3.pipe(fs.createWriteStream('./routers/Error.csv', {flags: 'a'}));
    writer3.write({
    Error: Date.now(),
    });
    writer3.end();
}


const RabbitSettings = {
    protocol: 'amqp',
    hostname: 'rabbitmq',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
    authMechanism: ['PLAIN','AMQPLAIN','EXTERNAL']
}
/*-----------------------------------------------------------------------
                             POST
-------------------------------------------------------------------------*/
const rabbit_direct_producer = async function connect(channel, ngsi,callback){

      var exchange = 'direct_exchange';

      var routing_key = "routingKeyA";


      channel.publish(exchange, routing_key, Buffer.from(JSON.stringify(ngsi)), {},async function (err,ok){
         if (err !== null){ 
           //console.warn('Message nacked!')
           await write_in_csv_error()
           callback(err,null)
          }
         else {
           //console.log('Message acked')
           await write_in_csv_T2()
           callback(null,ok)
         }
      });
}

module.exports = {
    rabbit_direct_producer
}
