const express = require('express')
const app = express()
app.set("view engine", 'ejs');
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;
const BitlyClient = require('bitly').BitlyClient;
const bodyParser = require('body-parser')
const bitly = new BitlyClient(process.env.BITLY_TOKEN);
const LoginRoute = require('./login')

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))

const port = process.env.PORT || 9000;
const amazontracking = process.env.AMAZON_TRACKING
const flipkarttracking = process.env.FLIPKART_TRACKING
var output_data = {found:false}

app.get('/', (req,res) => {
	res.render('index', output_data);
})

app.post('/', async (req,res) => {
	const userInputData = req.body
	console.log(userInputData);
    /* var expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
	try {
		var matches = userInputData.match(expression);
		var messageString = userInputData.split('http');
		var message = messageString[0];
		var options = {
		   headers: {
			    'Access-Control-Allow-Headers':'*',
			    'Access-Control-Allow-Origin':'*',
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		   }
	   }
	   await fetch(matches[0],options).then((response)=> {
		const convertedUrl = linkConverter(response.url)
		bitly
		.shorten(convertedUrl)
		.then(function(result) {
			output_data = {
				found:true,
				old_message:userInputData,
				message:message,
				data:result.link
			}
		  //res.json({message:message,data:result.link})
		  return res.redirect('/')
		})
		.catch(function(error) {
		  console.error(error);
		  res.json({message:"Url does not contain",data:" Amazon/Flipkart link"})
		});
	   
	}).catch(err=>{
		res.json({message:"Check Your internet connection", data:err})
	})
	}

	catch {
		res.json({message:"Enter Text that Contains", data:" a Proper Message"})
	} */
});

app.post("/sendTelegram", async (req,res)=> {
	const textData = req.body.outputdata
	console.log("data sended"+textData);
	var splitdata = textData.split('http')
	var message = splitdata[0].replace('&','%26');
	var link = "http"+splitdata[1];
	
	const fullMessage = message + "\n\n" + link

	console.log(fullMessage)
	var telegram = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=@${process.env.TELEGRAM_CHANNEL}&text=` + message +"%0D%0A"+link;
	options = {
		headers:{
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin':'*'
		}
	}
	await fetch(telegram,options).then(res=> {
 		return res.json();
 	}).then(json => {
		output_data = {found:false}
		return res.redirect("/")
 	});
})

app.listen(port,err=> {
    console.log(`listening on port 9000`);
})

function linkConverter(url) {
	if(url.includes("amazon")) {
		if (url.includes('/s?')) {
			var newurl = searchurl(url);
			
		}
		else {
			var newurl = producturl(url);
			
		}
	}
	else {
		var newurl = "its nor an amazon or flipkart url";
	}
	return newurl;
}

function searchurl(link) {
	var searchUrl = link.replace(/&tag=\w+/,'&tag='+amazontracking);
	var searchUrl2 = searchUrl.replace(/&ascsubtag=\w+/, "");
	var searchUrl3 = searchUrl2.replace(/&linkId=\w+/, "");
	return searchUrl3;
}

function producturl(link) {
	var extUrl = link.replace(/tag=\w+/,'tag='+amazontracking)
	return extUrl;
}

function flipkarturl(link) {
	var flipkartUrl = link.replace(/affid=\w+/, 'affid='+flipkarttracking)
	return flipkartUrl;
}
