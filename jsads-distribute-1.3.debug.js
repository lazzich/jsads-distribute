/* Hide initial container */
document.getElementById("solads-adverts").style.height = "0px";
document.getElementById("solads-adverts").style.overflow = "hidden";
debug = (typeof solads_debug==='undefined')?false:true;
var online = navigator.onLine;

if(online) {
/* Wait for full content to be loaded */
  window.addEventListener("load", function() {
      sldsListen();
  });
}
else if (debug == true) {
  console.error("No internet connection")
}

/* Globale Variablen */
var sldsAdvertsContainer;
var sldsAdverts = new Array();

function sldsListen() {
  if(document.getElementsByClassName('m3_container').length>0) {
    sldsAddCSS();
    sldsRetrieveAdverts();
    // Custom Event //
    var event = document.createEvent('Event');
    event.initEvent('solads', true, true);
    document.dispatchEvent(event);

    /* Hide initial container */
    document.getElementsByClassName('m3_container')[0].style.display = "none";
    /* Get mode */
    var sldsMode = (typeof solads_mode==='undefined')?"auto":solads_mode;
      if(sldsMode==="auto") {
        sldsAdvertsContainer = (typeof solads_Acontainer==='undefined')?void(0):solads_Acontainer;
        if(sldsAdvertsContainer != undefined) {
          sldsAutoDistribute(sldsAdverts,sldsAdvertsContainer);
        }
        else if (debug == true) {
          console.error("The parameter 'solads_Acontainer' is not (correctly) defined in your advert parameter block.")
        }
      }
    } // end if m3_container
    else if (debug == true){
      console.error("No adverts loaded, please change your settings.")
    }
};

function sldsAddCSS() {
/* Load stylesheets */
var sldsAcss=(typeof solads_Acssurl==='undefined' || solads_Acssurl == '')?void(0):solads_Acssurl;

  if(sldsAcss) { sldsAcss.forEach(insertCSS); }

    function insertCSS(item,index) {
      var head  = document.getElementsByTagName('head')[0];
      var link  = document.createElement('link');
      link.id = index;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      var prtcl;      if(item.indexOf("http://") === 0) { item = item.replace("http://",""); prtcl = "http://"};
      if(item.indexOf("https://") === 0) { item = item.replace('https://',''); prtcl = "https://" };
      if(prtcl) link.href = prtcl+escape(item);
      else link.href = "//"+escape(item);
      link.media = 'all';
      if(link) {
        head.appendChild(link);
      }
    } // end insertCSS;

}; // end addCSS;

function sldsRetrieveAdverts() {
/* Get AdvertContainer array */
var m3_container = document.getElementsByClassName('m3_container');
var sldsZ = m3_container[0].childNodes[0].childNodes;

/* Write number of available adverts to array */
var i;
  for (i=0;i<sldsZ.length; i++) {
    var advert = sldsZ[i].className;
    if (advert.indexOf("a") == 0) {
      sldsAdverts.push(sldsZ[i].outerHTML);
    }
  }
}; // end retrieveAdverts;

/* Auto Distribute Adverts into specified containers */
function sldsAutoDistribute(sldsAdverts,sldsAdvertsContainer) {
  var sldsAdvertCount = sldsAdverts.length;

  for(i=0;i<sldsAdvertsContainer.length;i++) {
      sldsAutoFillAdverts(i,sldsAdvertCount);
      sldsAdvertCount = sldsAdvertCount-sldsAdvertsContainer[i][3];
  }
}

function sldsAutoFillAdverts(i,sldsAdvertCount) {
  var value = sldsAdvertsContainer[i];

  if(sldsAdverts[value[0]]) { /* Is advert available? */
    document.getElementById(value[1]).className += value[2];
    var i;
    for(i=0;i<value[3];i++) {
      sldsAdvertNum = sldsAdverts.length - sldsAdvertCount;
      if(sldsAdverts[sldsAdvertNum]) {
        document.getElementById(value[1]).innerHTML += "<div class='m3_container'>"+sldsAdverts[sldsAdvertNum]+"</div>";
        sldsAdvertCount = sldsAdvertCount-1;
      }
      else {
        document.getElementById(value[1]).style.display = "none"
      }
    } // end for
  } // end if
  else {
    document.getElementById(value[1]).style.display = "none"
  }
}; // end fillAdverts;

function sldsFillAdverts(sldsAdvertId,sldsContainerName,sldsContainerAddClass,sldsAdvertCount) {

  if(sldsAdverts[sldsAdvertId]) { /* Is advert available? */
    document.getElementById(sldsContainerName).innerHTML = "";
    document.getElementById(sldsContainerName).className += sldsContainerAddClass;
    var i;
    for(i=0;i<=sldsAdvertCount;i++) {
      if(sldsAdverts[sldsAdvertId]) {
        document.getElementById(sldsContainerName).innerHTML += "<div class='m3_container'>"+sldsAdverts[sldsAdvertId]+"</div>";
        sldsAdvertCount = sldsAdvertCount-1;
        sldsAdvertId = sldsAdvertId+1;
      }
      else {
        if(debug == true) {
          console.error("Advert ID"+sldsAdvertId+" not available");
        }
        document.getElementById(sldsContainerName).style.display = "none"
      }
    } // end for
  } // end if
  else {
    if(debug == true) {
      console.error("Advert ID"+sldsAdvertId+" not available, please change your settings");
    }
    document.getElementById(sldsContainerName).style.display = "none"
  }
}; // end triggerFill
