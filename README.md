# Raspberry Pi ve Pushingbox Kullanımı

Raspberry Pi üzerinde Node.js ve SQLite kullanılarak Pushingbox API üzerinden HTTP GET metodu ile mail gönderme işlemi gerçekleştirilmiştir.

> Node.js Kurulumu
```bash
	pi@raspberrypi:~ $ sudo apt-get update
	pi@raspberrypi:~ $ sudo apt-get dist-upgrade
	pi@raspberrypi:~ $ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
	pi@raspberrypi:~ $ sudo apt-get install -y nodejs
	pi@raspberrypi:~ $ node -v
```

> SQLite Kurulumu
```bash
	pi@raspberrypi:~ $ sudo apt-get install sqlite3
```

> SQLite Üzerinde Database Oluşturulması ve Persons Tablosunun Oluşturulması ve Data Eklenmesi
```bash
	pi@raspberrypi:~ $ sqlite3 data.db
```
```ruby
	sqlite> CREATE TABLE Persons (
	      > PersonId INTEGER PRIMARY KEY,
	      > FirstName TEXT NOT NULL,
	      > LastName TEXT NOT NULL,
	      > BirthDay TEXT NOT NULL );
	sqlite> INSERT INTO Persons (
	      > FirstName, LastName, BirthDay) 
	      > VALUES
	      > ("Loyd", "Nikola", "2020-12-23"),
	      > ("Nuno", "Pantelis", "2020-12-24"),
	      > ("Tatiana", "Isi", "2020-12-25");
```	

> Push.js Dosyasının Oluşturulması ve İçeriğinin Düzenlenmesi
```bash
	pi@raspberrypi:~ $ sudo nano push.js
```	
```javascript
	var sqlite3 = require('sqlite3').verbose();
	const http = require('http');
  
 	//Bir onceki adimda olusturulan data.db path'i kullanildi
	var file = 'data.db';
  
  	//Database baglantisi kuruldu
	var db = new sqlite3.Database(file);
  
  	//Database verieri okundu
	db.all("SELECT * FROM Persons", function(err, rows){
	        let ts = Date.now();
	        let date_ob = new Date(ts);
	        let date = date_ob.getDate();
	        let month = date_ob.getMonth() + 1;
	        let year = date_ob.getFullYear();
          
          	//Guncel ay-gun bilgileri elde edildi
	        let last = month + "-" + date;
          
          	//Database okumasi ile gelen her tablo satiri donguye alindi
	        for(var i=0; i<rows.length; i++){
                  
                 	//Tablodahi dogum gunu tarihi degiskene aktarildi
	                let bd = rows[i].BirthDay;
                  
                  	//Dogum gunu kutlamasi icin yil onemli olmadigindan sadece ay-gun olacak sekilde alindi ve baska degiskene aktarildi
	                let last_bd = bd.substring(5);
                  
                  	//Tablodan elde edilen ay-gun seklindeki dogum gunu, guncel ay-gun ile kiyaslandi 
	                if(last_bd  == last ){
                  
                          	//Bir onceki yazida elde edilen Pushingbox API'ye HTTP GET yapılabilecek adres
	                        let url = 'http://api.pushingbox.com/pushingbox?devid=v81A2C081F8C1EA6&isim=';
                          
                         	//Dogum gunu, guncel gun ile ayni lan kisinin adi, degiskene aktarildi
	                        let firstname = rows[i].FirstName;
                          
                          	//Dogum gunu, guncel gun ile ayni olan kisinin soyadi, degiskene aktarildi
	                        let lastname = rows[i].LastName;
                          
                          	//API icin adres duzenlendi boylelikle degiskenleri kullanarak istek olusturulabilecek
	                        url = url.concat(firstname,' ', lastname);
                          
                          	//HTTP isteginin Turkce harf ile ilgili sorun yasanmamasi adina gerekli bir adim
	                        var encoded_url = encodeURI(url);
                          
                          	//Son olarak HTTP GET metodu ile API'ye istek yapildi
	                        http.get(encoded_url,(resp)=>{
	                                console.log("Mail sent!");
	                        }).on("error", (err)=>{
	                        console.log("Error");
	                        });
	                }
	        }
	});

```

> Push.sh Script Shell Oluşturulması ve Düzenlenmesi
```bash
	pi@raspberrypi:~ $ sudo nano push.sh
```
```bash
	#!/bin/sh
	node push.js
```	

> Crontab Oluşturulması ve Düzenlenmesi
```bash
	pi@raspberrypi:~ $ sudo nano /etc/crontab
```
```bash
	* 12   * * *    pi      /home/pi/push.sh
```	

