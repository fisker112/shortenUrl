
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("shorten-url app listening at", addr.address + ":" + addr.port);
});
