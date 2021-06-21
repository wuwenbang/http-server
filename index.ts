import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import * as p from "path";
import * as fs from "fs";
import * as url from "url";
const publicDir = p.relative(__dirname, "public");

// 创建 http 服务
const server = http.createServer();
// 监听 request 事件
server.on("request", (request: IncomingMessage, response: ServerResponse) => {
  const { url: path, method, headers } = request;
  if (method !== "GET") {
    response.statusCode = 405;
    response.end("请求方法非法");
  }
  const { searchParams, pathname } = new url.URL(path, "http://localhost:8888");
  // console.log("searchParams", searchParams);
  // console.log("pathname", pathname);
  let filename = pathname.substr(1);
  response.setHeader("Cache-Control", "public, max-age=31536000");
  if (filename === "") filename = "index.html";
  fs.readFile(p.resolve(publicDir, filename), (error, data) => {
    if (error) {
      if (error.errno === -4058 || error.errno === -4068) {
        response.statusCode = 404;
        response.end("404 Not Found");
      } else {
        response.statusCode = 500;
        response.end("服务器崩溃了");
      }
    } else {
      response.end(data);
    }
  });

  // const array = [];
  // request.on("data", (chunk) => {
  //   array.push(chunk);
  // });
  // request.on("end", () => {
  //   const data = Buffer.concat(array).toString();
  //   console.log("data", data);
  //   response.end();
  // });
});
// 监听 8888 端口
server.listen(8888);
