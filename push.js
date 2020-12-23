var sqlite3 = require('sqlite3').verbose();
const http = require('http');
var file = 'data.db';
var db = new sqlite3.Database(file);
db.all("SELECT * FROM Persons", function(err, rows){
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let last = month + "-" + date;
        for(var i=0; i<rows.length; i++){
                let bd = rows[i].BirthDay;
                let last_bd = bd.substring(5);
                if(last_bd  == last ){
                        let url = 'http://api.pushingbox.com/pushingbox?devid=v81A2C081F8C1EA6&isim=';
                        let firstname = rows[i].FirstName;
                        let lastname = rows[i].LastName;
                        url = url.concat(firstname,' ', lastname);
                        var encoded_url = encodeURI(url);
                        http.get(encoded_url,(resp)=>{
                                console.log("Mail sent!");
                        }).on("error", (err)=>{
                        console.log("Errorrr");
                        });
                }
        }
});
