---
layout: post
title: Orvibo Java SDK
date: 'Sat Nov 19 2016 03:00:00 GMT+0300 (MSK)'
published: true
excerpt_separator: <!-- cut -->
---
It's so fun to turn lights just saying: "Ok, Siri. Turn on the light". But sometime you may want to do it remotely. Most convenient way for me is send simple command to personal telegram bot. There is many libraries in different languages for contolling your Orvibo socket:

* [Go-orvibo](https://github.com/Grayda/go-orvibo)
* [Simple PHP class](https://github.com/pcp135/Orvibo)
* [Powerful PHP library](https://github.com/fernadosilva/orvfms)
* [Perl implementation](http://pastebin.com/7wwe64m9)
* [Quite well Java library](https://github.com/tavalin/orvibo-sdk)

Last one is great but it has a lot of code for networking. And it isn't so hard to write Orvibo client using Netty. In addition you will get http interface almost for free.
<!-- cut -->

I will use reverse engeneered [protocol specification](https://stikonas.eu/wordpress/2015/02/24/reverse-engineering-orvibo-s20-socket/). It's well described. Complete source and examples you can find on [Github](http://github.com/pochemuto/orvibo).

Add netty to dependencies to your build.gradle:

```groovy
compile group: 'io.netty', name: 'netty-all', version: '4.1.6.Final'
```

First, we need to initialize channel. Orvibo uses UDP protocol and Netty has special channel implementations: `OioDatagramChannel`, `NioDatagramChannel` and `EpollDatagramChannel`. Difference between them is only in their internal blocking behaviour, your choice should be based on your perfomance requirements. 

```java
EventLoopGroup loopGroup = new NioEventLoopGroup();
Bootstrap bootstrap = new Bootstrap();
bootstrap.group(loopGroup).channel(NioDatagramChannel.class);
bootstrap.option(ChannelOption.SO_BROADCAST, true); // we need to send broadcast discovery
```

Then we should configure pipeline. Each message, incoming or outgoing, passes through channel's handlers chain. Incoming passes from first to last handler, outgoing in opposite direction.

```java
bootstrap.handler(new ChannelInitializer<NioDatagramChannel>() {
     @Override
     protected void initChannel(NioDatagramChannel ch) throws Exception {
                             initChannelPipeline(ch);
            ch.pipeline()
              .addLast(new DatagramEncoder(RECIPIENT))
              .addLast(new MessageDecoder())
              .addLast(new MessageEncoder())
     }
});
```

Netty has many handful handlers, one of the most interesting of them for us is `MessageToMessageEncoder`. `DatagramChannel` produces `DatagramPacket` for each UDP packet. We could do all our stuff in single handler, but it would lead to hard supportable code. Fortunately, each orvibo message contains header with command it and we can separate processing different command to different handlers:

```
BREAKDOWN:
  68 64 - Magic Key 
  00 18 - Full Message Length = 24bytes 
  63 6C - Command ID ?
```

`MessageDecoder` consumes `DatagramPacket`, extracts message id and writes simple data class back to the channel:

```java
public class MessageDecoder extends MessageToMessageDecoder<DatagramPacket> {

    @Override
    protected void decode(ChannelHandlerContext ctx, DatagramPacket msg, List<Object> out) throws Exception {
        ByteBuf content = msg.content();
        ByteBuf magicBytes = content.readBytes(2);
        int length = content.readShort(); // short holds also 2 bytes
        ByteBuf commandBytes = content.readBytes(2);

        Message message = new Message();
        // ... fill message
        out.add(message); // pass produced message forward through pipeline
    }

}
```

For support sending same message container we have to add message to ByteBuf converter and ByteBuf to DatagramPacket. And again, we would just encode Message to DatagramPacket, but I think it is better to separate them:

```java
public class MessageEncoder extends MessageToMessageEncoder<Message> {
    @Override
    protected void encode(ChannelHandlerContext ctx, Message msg, List<Object> out) throws Exception {
        ByteBuf buf = Unpooled.buffer();
        buf.writeBytes(Message.MAGIC);
        buf.writeShort(msg.getLength());
        buf.writeBytes(msg.getCommandId().getBytes());
        buf.writeBytes(msg.getBytes());
        out.add(buf);
    }
}
```

`DatagramEncoder` implementation is pretty straightforward so I will skip it. From now, we can send `Message` but not reveive them because pipeline doesn't have handler for them. But before, add converter from generic `Message` to `DiscoveryResponse`. As before, extend `MessageToMessageDecoder<Message>` but now we don't need to catch all `Message`. We want to skip messages which have command id different from discovery. It's very easy to do, just override `acceptInboundMessage`:

```java
@Override
public boolean acceptInboundMessage(Object msg) throws Exception {
    if (!super.acceptInboundMessage(msg)) {
        return false;
    }

    // from now we can be sure that there is a Message instance
    CommandId commandId = ((Message) msg).getCommandId();
    return commandId == CommandId.DISCOVERY;
}
```

Then we can add handlers for each type of message very easy:

```java
public class DiscoveryHandler extends SimpleChannelInboundHandler<DiscoveryResponse> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, DiscoveryResponse msg) throws Exception {
        // handle msg
    }
}
```

Finally initialize channel and use channel:

```java
channel = bootstrap.bind(10000).sync().channel();
Message message = getCommand(); // discovery command
channel.write(message);
```
