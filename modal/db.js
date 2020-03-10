const { Client } = require('pg')
var validUrl = require('valid-url');
var shortid = require('shortid');




async function generateUrl(url) {
    try {
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'postgres',
            port: 5432,
          })

        await client.connect()
    
        if (validUrl.isUri(url)){
            let id = shortid.generate()
            let shortUrl = `http://localhost:5000/${id}`

            const res = await client.query('SELECT * from urlshorten where longurl = $1',[url])
            if( res.rowCount == 0) {
                await client.query('INSERT INTO urlshorten(id, shorturl, longurl) VALUES($1, $2, $3) RETURNING *', [id, shortUrl, url])
                await client.end()
                return shortUrl
            } else {
                let short = res.rows[0].shorturl;
                console.log(short)
                return short;
            }
            
        } else {
            return 'not a valid url'
        }

    } catch(err) {
        await client.end()
        console.log(err)
        return "500"
        process.exit(-1)
    }
    
}

async function checkUrl(shorturl) {
    try {
        const client = new Client({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'postgres',
            port: 5432,
          })

        await client.connect()
        const res = await client.query('SELECT longurl from urlshorten where shorturl = $1',[shorturl])
        if( res.rowCount !== 0) {
            let longUrl = res.rows[0].longurl;
            await client.end();
            return longUrl;
        } else {
            await client.end();
            return "404"
        }
        
        
    } catch(err) {
        await client.end();
        console.log(err)
        return "500"
        process.exit(-1)
    }
}


module.exports = {
    generateUrl,
    checkUrl
}