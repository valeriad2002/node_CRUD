const { response } = require('express');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const app = http.createServer(async (request, response) => {
    const metrhod = request.method;
    const url = request.url;
    console.log(url, metrhod);
    const jsonPath = path.resolve('./files/users.json')
    if (url === '/users') {
        //obtencion de usuarios
        if (metrhod === "GET") {
            //leer archivo
            const jsonFile = await fs.readFile(jsonPath, 'utf8');
            //responder con la informacion de archivo
            response.setHeader('Content-Type', 'application/json');
            response.write(jsonFile);
        } if (metrhod === "POST") {

            //crear un usuario es post
            //1- leer la infofrmacion  o el body
            //de la peticion event emiter
            //LEER el archivo users.json
            const jsonFile = await fs.readFile(jsonPath,'utf8');
            const userArray = JSON.parse(jsonFile);
            request.on('data', (data) => {

                //el json convertir en obj o arreglo
                const user = JSON.parse(data);
                
                userArray.push(user);
                //convertir en un json
                const newJson= JSON.stringify(userArray);
                //escrcibir el json en el archivo
                fs.writeFile(jsonPath,newJson);
            })
        }
       /*if (metrhod === "GET") {

        } if (metrhod === "GET") {

        }*/
    } else {
        response.write('recusro no disponible');
    }

    response.end();
   
});
app.put('/users', async(req,res)=>{
    //obtener el arreglo
    const userArray= JSON.parse(await fs.readFile(jsonPath,'utf8'));
    const{nema,age,contry,id}=req.body;
    //buscar el id del usuario 
    const userIndex= userArray.findIndex(user=> user.id)
    console.log(userIndex)
    if(userIndex>=0){
        userArray[userIndex].nema=nema;
        userArray[userIndex].age = age;
        userArray[userIndex].contry= contry;

    }
    console.log(userArray);
    //escribir el arrglo en el archivo
    await fs.writeFile(jsonPath, JSON.stringify(userArray));
    res.send('Usuario actualizado');
})
app.delete('/users', async(req,res)=>{
     //obtener el arreglo
     const userArray= JSON.parse(await fs.readFile(jsonPath,'utf8'));
     const {id}= req.body;
     //buscar el id del usuario 
    const userIndex= userArray.findIndex(user=> user.id);
    //se elimina el arreglo
    userArray.splice(userIndex,1);
    //se escrribe en el json
    await fs.writeFile(jsonPath, JSON.stringify(userArray));
    res.end();


})
const PORT = 8000;
app.listen(PORT,()=>{
    console.log('Servidor escuchando')
});
