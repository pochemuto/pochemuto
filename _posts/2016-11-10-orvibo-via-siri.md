---
layout: post
title:  "Control Orvibo Socket via Siri"
date:   2016-11-10 12:53:09 +0300
excerpt_separator: <!-- cut -->
---

Recently I got Wi-Fi socket Orvibo S20. It is quite well device, but it was made before Apple have released their Homekit. So it doesn't support it and you have to use their app to control socket. Lets try to change it.

<!-- cut -->
Our objective is to be able to turn on and turn off Orvibo S20 via Siri. There is many ways one of them is:

- Buy Apple Developer license
- Create app which implements Homekit and Orvibo protocols both
- Translate commands from Homekit to Orvibo commands and vice versa

Fortunately, there is project [Homebridge](https://github.com/nfarina/homebridge). It implements Homekit protocol and offers many plugins which will help you to connect your device to iOS device. Plugin for Orvibo platform [is also present](https://www.npmjs.com/package/homebridge-platform-orvibo)! 


