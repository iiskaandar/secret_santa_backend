
import { Client } from 'pg';
import dotenv from 'dotenv';

export default {
    /**
    *  Query DB
    * @param {object} req
    * @param {object} res
    * @returns {object} object
    */
    query(queryText, params) {
    dotenv.config();
    var client = new Client(process.env.DATABASE_URL);
    return new Promise((resolve, reject) => {
     client.connect(err => {
         if (err) {
             reject(err);
         }
         if(params){
            client.query(queryText, [...params], (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data)
                }
                client.end();
            });
         } else {
            client.query(queryText, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data)
                }
                client.end();
            });
         }

     });
    })
    }
}