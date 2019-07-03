


SubtitleParser = function() {

	this.init = function( object )
	{

		console.log(object)
		var r = new XMLHttpRequest();

	  	r.open( "GET", xml );
	    r.onreadystatechange = function () 
	    {
	        if ( r.readyState === 4 && r.status === 200 ) 
	        {
	            imsc1doc = imsc.fromXML( r.responseText );
	        }
	        else if ( r.readyState === 4 ) 
	        {
	        	console.error('Status = ' + r.status + ' xml = ' + xml);
	        }
	    };
	    r.send();


	}

	
}