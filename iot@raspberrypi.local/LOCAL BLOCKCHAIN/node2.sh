geth --datadir node2/ --syncmode "full" --port 30312 --http --http.addr "localhost" --http.port 8502 --http.api "personal,db,eth,net,web3,txpool,miner,clique" --ws --ws.addr "localhost" --ws.port 8502 --ws.api "personal,db,eth,net,web3,txpool,miner,clique" --bootnodes "enode://c60f7ae2f866bdd1dd66153b7e9ad53c934a60dd28c5e4a3ab0ecf67abc7fc5580ea84b8a07866ec1f0db061d422dd16f0309508ba3a7c869c3de70d96d5f470@127.0.0.1:30311
" --networkid 1516 --miner.gasprice 1 --miner.gaslimit 94000000 --miner.etherbase "0x19990189B365CCca045619627B549c70b3AE0A3B" --allow-insecure-unlock -unlock "0x19990189B365CCca045619627B549c70b3AE0A3B" --password node2/password.txt --mine --authrpc.port 8552 --ipcdisable --verbosity=3



