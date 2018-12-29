if(process.env.NODE_ENV === 'production') {
    module.exports = { 
        mongoURI: 'mongodb://danielfo:danielfo89@ds145474.mlab.com:45474/vidjot-prod' 
    };
} else {
    module.exports = { 
        mongoURI: 'mongodb://localhost/vidjot-dev' 
    };
}