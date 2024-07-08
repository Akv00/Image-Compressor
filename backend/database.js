import {Client} from pg

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'goto2hell',
    database: 'images',
})

client.connect()

client.query('SELECT * FROM images', (err, res)=> {
    if(!err){
        console.log(res.rows)
    }
    else {
        console.log(err.message);
    }
    client.end()
})