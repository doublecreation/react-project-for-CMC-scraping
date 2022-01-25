require('dotenv').config()
const { mysql } = require('mysql')

let con = new mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DEFAULT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

exports.exec = async (query, data = []) => {
    try {
        const client = await con.connect()
        const result = await client.query(query, data)
        client.release()
        return result
    } catch (error) {
        console.log(error)
    }
}

exports.createMyDB = async (dbName) => {
    try {
        await this.exec(`DROP DATABASE IF EXISTS ${dbName};`)
        await this.exec(`CREATE DATABASE ${dbName};`)
        console.log(`${dbName} Database has been created`)
    } catch (error) {
        console.log(error);
    }
}

exports.createMyTBL = async (tblName) => {
    try {
        await this.exec(`DROP TABLE IF EXISTS ${tblName};`)
        await this.exec(`CREATE TABLE ${tblName}(
            ID                  INT         PRIMARY KEY     NOT NULL,
            ADDRESS             TEXT                        NOT NULL,
            CURRENT_QUANTITY    REAL                        NOT NULL,
            PREVIOUS_QUANTITY   REAL
        )`)
        console.log(`${tblName} Table has been created`)
    } catch (error) {
        console.log(error);
    }
}