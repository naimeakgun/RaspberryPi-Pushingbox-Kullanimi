```ruby
pi@raspberrypi:~ $ sqlite3 data.db

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
