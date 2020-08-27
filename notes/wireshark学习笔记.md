## Packet Details Pane(数据包详细信息)

- Frame: 物理层数据帧概况

- Ethernet II: 数据链路层以太网帧头部信息
- Internet Protocol Version 4: 互联网层IP包头部信息
- Transmission Control Protocol: 传输层T的数据段头部信息
- Hypertext Transfer Protocol: 应用层的信息



## wireshark过滤器表达式的规则

1. 抓包过滤器语法和实例
   - 抓包过滤器：
     - 类型Type：
       1. host
       2. net
       3. port
      - 方向Dir：
        1. src
        2. dst
     - 协议Protocol：
       1. ether
       2. ip
       3. tcp
       4. udp
       5. http
       6. icmp
       7. ftp
       8. ...
     - 逻辑运算符
       1. && 逻辑与
       2. || 逻辑或
       3. ！ 逻辑非
   - 协议过滤（直接在过滤框中输入协议名称）
     - TCP
     - HTTP
     - ICMP
   - IP过滤
     - host xxx.xxx.xxx.xxx
     - src host xxx.xxx.xxx.xxx
     - dst host xxx.xxx.xxx.xxx
   - 端口过滤
     - host xxx.xxx.xxx.xxx
     - src host xxx.xxx.xxx.xxx
     - dst host xxx.xxx.xxx.xxx
   - 逻辑运算符 && 逻辑与、|| 逻辑或、！ 逻辑非
     - src host xxx.xxx.xxx.xxx && dst port 80 抓取主机地址为xxx.xxx.xxx.xxx 目标端口为 80的数据包
     - host xxx.xxx.xxx.xxx || host yyy.yyy.yyy.yyy 抓取主机地址为xxx.xxx.xxx.xxx或者主机地址为yyy.yyy.yyy.yyy 的数据包
     - !broadcast 不抓取广播数据包
2. 显示过滤器语法和实例