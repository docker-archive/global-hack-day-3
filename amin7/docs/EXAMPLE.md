## Example Command Line Use

```
niall@devbox:~/Projects/chorus$ chorus hosts
192.168.99.10	Currently idle.
192.168.99.9	Currently idle.
niall@devbox:~/Projects/chorus$ chorus schedule dockerfiles/apache 5
You requested 5 instances of this dockerfile, but you have only 2 machines free right now.
192.168.99.10: OK (dockerfiles/apache)
192.168.99.9: OK (dockerfiles/apache)
niall@devbox:~/Projects/chorus$ chorus hosts
192.168.99.10	CID: -----	UP: 0.00	Building: apache
192.168.99.9	CID: -----	UP: 0.00	Building: apache
niall@devbox:~/Projects/chorus$ chorus hosts
192.168.99.10	CID: 4d813	UP: 0.00	Running: apache
192.168.99.9	CID: ef50c	UP: 0.00	Running: apache
niall@devbox:~/Projects/chorus$
```
