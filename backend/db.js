import path from "path"
const dbPath=path.resolve(__dirname,'db/database.sqlite')
const knex=require('knex')({
    client:'sqlite3',
    connection:{
        filename:dbPath,
    },
    useNullAsDefault:true
})
//create table in the database called data
knex.schema.hasTable('data').then((exists)=>{
    if(!exists){
        return knex.schema.createTable('data',(table)=>{
            table.increments('id').primary()
            table.string('name')
            table.json('keyValuePairs');
        })
        .then(()=>{
            console.log('Table\'data\'created')
        })
        .catch((error)=>{
            console.log(`there is an error creating table:${error}`)
        })
    }
}).then(()=>{
    console.log("done")
})
.catch((error)=>{
    console.log(`there is an error setting up the database:${error}`)
})
//for checking and validation
knex.select('*').from('data')
.then(d=>console.log(d))
.catch((err=>console.log(err)))

module.exports=knex