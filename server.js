const express = require('express')
const app = express()
const fetch = require('cross-fetch');
const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('2adfabe3fdba84d28e50f402bc235c5e41ab0adc');
app.use(express.json())

const amazontracking = "deal110"
const flipkarttracking = "awdhesh21"

app.post('/', async (req,res) => {
	const userInputData = req.body.userInputData
	//console.log(userInputData)
    var expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
	try {
		var matches = userInputData.match(expression);
		var messageString = userInputData.split('http');
		var message = messageString[0];
	   console.log(message)
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
			//console.log(result)
		  res.json({message:message,data:result.link})
		})
		.catch(function(error) {
		  console.error(error);
		  res.json({message:"Url does not contain",data:" Amazon/Flipkart link"})
		});
	   
	}).catch(err=>{
		res.json({message:"something went wrong", data:err})
	})
	}

	catch {
		res.json({message:"Enter Text that Contains", data:" a Proper Message"})
	}
})

app.listen(9000,err=> {
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
	else if(url.includes('flipkart')) {
		var newurl = flipkarturl(url);
		
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

