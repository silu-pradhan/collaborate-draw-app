import {WebSocketServer} from "ws"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,request) {
  // ws.on('error', console.error);
   const url=request.url; //ws://localhost:3000?token=12121
  //  ["ws://localhost:3000","token=12121"]
   if(!url){
    return;
   }
   const queryParams=new URLSearchParams(url.split('?')[1]);
    const token=queryParams.get("token") ||"";
   
    const decoded=jwt.verify(token,JWT_SECRET )
    if(!decoded  || !(decoded as JwtPayload).userId){
      ws.close();
      return;
    }
    
  ws.on('message', function message(data) {
    ws.send('pong');
  });

 
});