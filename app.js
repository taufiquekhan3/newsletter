const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",(req,res) => {
    res.sendFile(__dirname + "/signup.html");
})
app.post("/",(req,res) => {

    const FN = req.body.fName;
    const LN = req.body.lName;
    const E = req.body.email;

    const data = {
        members: 
        [{
          email_address:E,
          status:"pending",
          merge_fields:{
           FNAME:FN,
           LNAME: LN  
          }           
        }]
    }
    const JSONdata = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/88b7cf1083";
    const options = {
        method:"POST",
        auth:"tauf:65bdcd6abdce981f36f31e1697e82fc8-us9"
    }

    const request = https.request(url,options,(response) => {
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
            console.log("email has been sent");
        }
            else{
                res.sendFile(__dirname + "/failure.html"); 
        }
            response.on("data",(data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(JSONdata);
    request.end();
})

app.listen(process.env.PORT || 3000 ,() => {
    console.log("server is running");
})

