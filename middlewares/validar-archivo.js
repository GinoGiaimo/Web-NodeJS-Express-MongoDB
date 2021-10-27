

const validarArchivo = (req, res, next) =>{
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json('No se encontraron archivos.');
        return;
    }

    if (!req.files.archivo) {
        res.status(400).json('No se encontraron archivos.');
        return;
    }

    next();
}

module.exports=validarArchivo;