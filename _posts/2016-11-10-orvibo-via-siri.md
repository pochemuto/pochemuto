---
layout: post
title: Control Orvibo Socket via Siri
date: '2016-11-10 12:53:09 +0300'
excerpt_separator: <!-- cut -->
published: true
---

Recently I got Wi-Fi socket Orvibo S20. It is quite well device, but it was made before Apple have released their Homekit. So it doesn't support it and you have to use their app to control socket. Let's try to change it.

<!-- cut -->
Our objective is to be able to turn on and turn off Orvibo S20 via Siri. There are many ways one of them is:

- Buy Apple Developer license
- Create app which implements Homekit and Orvibo protocols both
- Translate commands from Homekit to Orvibo commands and vice versa

Fortunately, there is project [Homebridge](https://github.com/nfarina/homebridge). It implements Homekit protocol and offers many plugins which will help you to connect your device to iOS device. Plugin for Orvibo platform [is also present](https://www.npmjs.com/package/homebridge-platform-orvibo)!

Install homebridge and homebridge orvibo platform support:

```bash
sudo npm install -g --unsafe-perm homebridge
sudo npm install -g homebridge-platform-orvibo
```

Configure plugin using configuration template:

```bash
cp `npm -g root`/homebridge/config-sample.json ~/.homebridge/config.json
```

```json
{
     "bridge": {
        "name": "HomeBridge",
        "username": "CC:32:31:A3:C0:30",
        "port": 51826,
        "pin": "031-61-150"
    },

    "description": "HomeBridge HTTP Status Control",

    "platforms": [{
      "platform": "Orvibo"
    }]
}
```

Replace `username` with random mac-address. You can generate it by [the online generator](http://www.miniwebtool.com/mac-address-generator/). Execute `homebridge`. You may see warnings like following:

```
*** WARNING *** The program 'node' uses the Apple Bonjour compatibility layer of Avahi.
*** WARNING *** Please fix your application to use the native API of Avahi!
*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node>
*** WARNING *** The program 'node' called 'DNSServiceRegister()' which is not supported (or only supported partially) in the Apple Bonjour compatibility layer of Avahi.
*** WARNING *** Please fix your application to use the native API of Avahi!
*** WARNING *** For more information see <http://0pointer.de/avahi-compat?s=libdns_sd&e=node&f=DNSServiceRegister>
```

It is ok, you may ignore them.
