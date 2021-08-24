const axios = require('axios');
const http = require('http')
const fs = require('fs');

//urls
urlProveedores = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f /raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json';
urlClientes = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json';

//bases de datos
let BDProv = getBDProv();
let BDCli = getBDCli();

//carga json 
async function getBDProv() {
    try {
      const response = await axios.get(urlProveedores);
      //console.log(response.data[0]);
      BDProv = response.data;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function getBDCli() {
    try {
      const response = await axios.get(urlClientes);
      //console.log(response.data[0]);
      BDCli = response.data;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }


 

//Pintar HTML
const pintar = async (tipo) =>{

    cabeza = '<table class="table table-striped"><thead><tr><th scope="col">ID</th><th scope="col">Nombre</th><th scope="col">Contacto</th></tr></thead><tbody>';
    final = '</tbody></table>'

    if(tipo === 'clientes'){
       await BDCli;

        var count = Object.keys(BDCli).length;
        for (let index = 0; index < count; index++) {
    
            const element = BDCli[index];
            //console.log(element)
            var idCli = element.idCliente;
            var nomComp = element.NombreCompania;
            var nomCont = element.NombreContacto;
    
            cuerpo = '<tr> <th scope="row">'+idCli+'</th> <td>'+nomComp+'</td> <td>'+nomCont +'</td> </tr>'
    
            cabeza = cabeza + cuerpo;      
        }
        todo = cabeza+final;
        //console.log(todo)
        await escribirHTML(todo);
    }
    else if(tipo == 'proveedores'){

        await BDProv;

        var count = Object.keys(BDProv).length;
        for (let index = 0; index < count; index++) {
    
            const element = BDProv[index];
            //console.log(element)
            var idCli = element.idproveedor;
            var nomComp = element.nombrecompania;
            var nomCont = element.nombrecontacto;
    
            cuerpo = '<tr> <th scope="row">'+idCli+'</th> <td>'+nomComp+'</td> <td>'+nomCont +'</td> </tr>'
    
            cabeza = cabeza + cuerpo;      
        }
        todo = cabeza+final;
        //console.log(todo)
        await escribirHTML(todo);
    }

}

//Editar HTML
const escribirHTML = async (contenido) => {

    await fs.writeFile('index.html',contenido, (error) => {
        if(error){
            console.log('Error: ${error}')
        }
    });
}



//Servidor
const handleServer= async function(req,res){

    var url = req.url;

    res.writeHead(200,{'Content-type':'text/html'});

    if(url === '/api/clientes'){

        //Crear HTML
        await pintar('clientes');

        //Carga del HTML
        fs.readFile('./index.html',null, (error,data)=>{
            if(error){
                res.writeHead(404);
                res.write("archivo no encontrado");
            } else{
                res.write(data);
            }
            res.end();
        });


        //res.write('Estoy en Clientes');
        //res.end();

    }
    else if(url === '/api/proveedores'){
        
        //Crear HTML
        await pintar('proveedores');

        //Carga del HTML
        fs.readFile('./index.html',null, (error,data)=>{
            if(error){
                res.writeHead(404);
                res.write("archivo no encontrado");
            } else{
                res.write(data);
            }
            res.end();
        });
        
        //res.write('Estoy en PROVEEDORES');
        //res.end();
    };
}

//creacion del servidor
const server = http.createServer(handleServer);
server.listen(8081, function(){
    console.log('Servidor en el puerto 8081');
})