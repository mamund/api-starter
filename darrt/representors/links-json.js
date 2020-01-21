/*****************************************
// bigco, inc company
// representation templates
// 2020-02-01 : mamund
 *****************************************/
 
// links-json response template
exports.template =  
{
  format : "application/links+json", 
  view : 
  `
    { 
      "<%=type%>" : 
      { 
        "metadata" : 
        [
          <%var z=0;%>
          <%metadata.forEach(function(md){%>
            <%if(z!==0){%>,<%}%>
            {
              <%var w=0;%>
              <%for(var p in md){%>
                <%if(w!==0){%>,<%}%>"<%=p%>" : <%if(Array.isArray(md[p])){%>
            [
            <%var a=0;%>
     <%md[p].forEach(function(prop){%>
              <%if(a!==0){%>,<%}%>
		{
		  <%var b=0;%>
		  <%for(var pr in prop){%>
		    <%if(b!==0){%>,<%}%>"<%=pr%>" : "<%=helpers.stateValue(prop[pr],{},request,prop[pr])%>"
		    <%b=1;%>
		  <%}%>
		}
	      <%});%>
	      ]	      
            <%}else{%>"<%=helpers.stateValue(md[p],{},request,md[p])%>"<%}%>
                  <%w=1;%>
                <%}%>  
              }
              <%z=1;%>
            <%});%>
          ],
          "links" : 
          [
            <%var z=0;%>
            <%pForms.forEach(function(form){%>
              <%if(z!==0){%>,<%}%>
              {
                <%var w=0;%>
                <%for(var p in form){%>
                  <%if(w!==0){%>,<%}%>"<%=p%>" : <%if(Array.isArray(form[p])){%>
              [
              <%var a=0;%>
	      <%form[p].forEach(function(prop){%>
                <%if(a!==0){%>,<%}%>
                <%a=1%>
		{
		  <%var b=0;%>
		  <%for(var pr in prop){%>
		    <%if(b!==0){%>,<%}%>"<%=pr%>" : "<%=helpers.stateValue(prop[pr],{},request,prop[pr])%>"
		    <%b=1;%>
		  <%}%>
		}
	      <%});%>
	      ]	      
            <%}else{%>"<%=helpers.stateValue(form[p],{},request,form[p])%>"<%}%>
                  <%w=1;%>
                <%}%>  
              }
              <%z=1;%>
            <%});%>
          ],
          "items" : 
          [
            <%var x=0;%>
            <%rtn.forEach(function(item){%>
              <%if(x!==0){%>,<%}%>
              {
                <%var y=0;%>
                <%for(var p in item){%>
                  <%if(p==="id"){%>
                "links" : 
                [
                ]
                <%y=1;%><%}%>
                <%if(y!==0){%>,<%}%>"<%=p%>" : "<%=item[p]%>"
                <%y=1;%>
              <%}%>
            }
            <%x=1;%>
          <%});%>
          ]
        }
     }
  `
}

