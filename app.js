var connection = require('./config/connection');
var app = require('./routes/routes');
app.listen(3000, () => {
    console.log("server started at 3000");
})