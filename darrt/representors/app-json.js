/*****************************************
// bigco, inc company
// representation templates
// 2020-02-01 : mamund
 *****************************************/
 
// plain JSON response template 
exports.template = 
   { 
    format : "application/json", 
    view : 
    `
      { 
          "<%=type%>" : 
          [
            <%var x=0;%>
            <%rtn.forEach(function(item){%>
              <%if(x!==0){%>,<%}%>
              {
                <%var y=0;%>
                <%for(var p in item){%>
                  <%if(y!==0){%>,<%}%>"<%=p%>" : "<%=helpers.stateValue(item[p],item,request,item[p])%>"
                  <%y=1;%>
                <%}%>
              }
              <%x=1;%>
            <%});%>
          ]
       }
    `
  }

