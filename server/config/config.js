//=========================
//puerto
//========================

process.env.PORT = process.env.PORT || 3000;

//=======================
//Entorno
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=======================
// Bse de datos
//======================

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://denis:Nqj3t0CdPPisjT5b@cluster0.lzmod.mongodb.net/cafe';
}

process.env.URLDB = urlDB;