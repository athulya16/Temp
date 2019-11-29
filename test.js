// const axios = require('axios');
// const cron = require('node-cron');


// axios.post('http://localhost:3000/api/user/login', {
//         email: 'athulyababu16@gmail.com',
//         password: 'damu'
//     })
//     .then((response) => {
//         console.log(response.data);
//     })
//     .catch((error) => {
//         console.log(error);
//     });


/*axios.post('http://localhost:3000/api/user/updatePassword', {
    newPassword: 'kattabad',
}, {
    headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF0aHVseWFiYWJ1MTZAZ21haWwuY29tIiwiaWF0IjoxNTc1MDAzODI1LCJleHAiOjE1NzUwOTAyMjV9.mya-d2BsJws7H9-YUVZEMq6ftNoaJvzTmN7aZtsjfNg',
    }
}).then((response) => {
    console.log(response.data);
}).catch((error) => {
    console.log(error);
})*/



// cron.schedule('*/5 * * * * *', async function() {
//   axios.post('http://localhost:3000/api/user/login', {
//         email: 'athulyababu16@gmail.com',
//         password: 'kattabad'
//     })
//     .then((response) => {
//         console.log(response.data);
//     })
//     .catch((error) => {
//         console.log(error);
//     });
// })



let date = Date.now()-2592000000;
let date2 = new Date(date);
console.log("date",date);
console.log("dateInUserformat",date2);
console.log("datetoString",date2.toString());
console.log("dateIsoString",date2.toISOString());
var month = new Date(date2.toString().split('GMT')[0]+" UTC").toISOString().split('-')[2].split('T')[0];
console.log(month);  