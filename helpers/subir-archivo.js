const path = require('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png','jpg','jpeg'], carpeta='') =>{

    return new Promise((resolve, reject) => {
        const{archivo} = files;
        const nombreSeparado = archivo.name.split('.');
        const extension = nombreSeparado[nombreSeparado.length - 1];

        //Validar extensiones

        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${extension} no es permitida`);
        }

        const nombreTemporal = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        archivo.mv(uploadPath, function(err) {
            if (err) {
            return reject(err);
            }

            resolve(nombreTemporal);
        });
    })
    
}

module.exports = subirArchivo;