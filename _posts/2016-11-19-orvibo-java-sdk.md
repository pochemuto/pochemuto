---
layout: post
title: Orvibo Java SDK
date: 'Sat Nov 19 2016 03:00:00 GMT+0300 (MSK)'
published: true
excerpt_separator: <!-- cut -->
---
Is's so fun to turn lights just saying: "Ok, Siri. Turn on the light". But sometime you may want to do it remotely. Most convenient way for me is send simple command to personal telegram bot. There is many libraries in different languages for contolling your Orvibo socket:

* [Go-orvibo](https://github.com/Grayda/go-orvibo)
* [Simple PHP class](https://github.com/pcp135/Orvibo)
* [Powerful PHP library](https://github.com/fernadosilva/orvfms)
* [Perl implementation](http://pastebin.com/7wwe64m9)
* [Quite well Java library](https://github.com/tavalin/orvibo-sdk)

Last one is great but it has a lot of code for networking. And it isn't so hard to write Orvibo client using Netty. In addition you will get http interface almost for free.
<!-- cut -->

I will use reverse engeneered protocol specification: https://stikonas.eu/wordpress/2015/02/24/reverse-engineering-orvibo-s20-socket/. It's well described. 

Add netty to dependencies to start:

```groovy
compile group: 'io.netty', name: 'netty-all', version: '4.1.6.Final'
```
