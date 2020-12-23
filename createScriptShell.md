```bash
pi@raspberrypi:~ $ sudo nano push.sh
#!/bin/sh
sudo nano push.sh
```

--------------

```bash
pi@raspberrypi:~ $ sudo nano /etc/crontab
* 12   * * *    pi      /home/pi/push.sh
```
