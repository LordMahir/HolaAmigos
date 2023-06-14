geth --datadir node3/ --syncmode "full" --port 30313 --http --http.addr "localhost" --http.port 8503 --http.api "personal,db,eth,net,web3,txpool,miner,clique" --ws --ws.addr "localhost" --ws.port 8503 --ws.api "personal,db,eth,net,web3,txpool,miner,clique" --bootnodes "enode://a4fa30ad34ef15a8b53d557f4886e1d8d29a0a627a7cbd5c93404d0c4d9f23d6ccf95fdf01310a80e0326a4c7648caf1278b1d6e5e7f21717b35075fcb964cf3@127.0.0.1:30311" --networkid 1515 --miner.gasprice 1 --miner.gaslimit 94000000 --miner.etherbase "0xe4071b63c45a27cf7a8efbcf1e7ef69ebaa0b0a9" --allow-insecure-unlock -unlock "0xe4071b63c45a27cf7a8efbcf1e7ef69ebaa0b0a9" --password node3/password.txt --mine --authrpc.port 8553 --ipcdisable --verbosity=3



