
/*
the following codes are to be injected into the html file:
 
inside header: 	

	<!--leaflet.js cdn-->
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
		integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
        crossorigin="" />
        
	<!-- Make sure you put this AFTER Leaflet's CSS -->
	<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
		integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
		crossorigin=""></script>

	<link rel="stylesheet" href="style.css" />


inside body:

    <div id="mapid"></div>


    <script src="main.js"></script>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"
	    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
 */



//dummy data
var dummyData = [
    // [
    //     [33.51, 55.68],
    //     [33.51, 57.68]
    // ],
    // [
    //     [32.44, 50.40],
    //     [30.30, 60.00]
    // ],
    // [
    //     [30.51, 55.68],
    //     [33.51, 57.68]
    // ],
    // [
    //     [32.44, 56.40],
    //     [34.30, 60.00]
    // ]
];


//map configs 
popupOptions = {
    maxWidth: "auto"
};

lineOptions = {
    color: 'red'
};


//main map
var mymap = L.map('mapid').setView([33.6, 53.7], 13);

//map tile-layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 6,
    id: 'mapbox/streets-v11',
    // x: 53,
    // y: 33,
    // z: 1,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGl0Y2xhaXIiLCJhIjoiY2s3MDZmZGcwMDB1NDNtcDBmZ3pjdWp2NyJ9.MC35oYwFqBb-Zndvv2yiHQ'
}).addTo(mymap);




//mandatory globals, need to be added to the code
var wrapper = document.createElement("div");
var canvas = document.createElement("canvas");
canvas.setAttribute("class", "focusArea");
var displayArea = document.createElement('div');
// displayArea.textContent = " ";
displayArea.setAttribute("id", "displayArea");
displayArea.innerHTML = "Wavelength Number: ";
canvas.height = 50;
canvas.width = 420
wrapper.appendChild(canvas);
wrapper.appendChild(displayArea);


//dummy markers
var markersGroup = new L.LayerGroup();
var pathToIcon = "img/server_blue.png";
var marker = L.marker([33.51, 55.68], { icon: createCustomIcon(pathToIcon)}).addTo(markersGroup);
var marker = L.marker([34.51, 54.68], {icon: createCustomIcon(pathToIcon)}).addTo(markersGroup);
mymap.addLayer(markersGroup);

drawLines(dummyData, handleMouseOverLines);

createLegend(mymap);

// handleMouseOverLines();


// const drawBtn = document.getElementById("drawLinkBtn");
// drawBtn.addEventListener("click", e => drawLinkBetweenNodes(e, mymap));
// drawLinkBetweenNodes(mymap);

var globalVar;
var dataVar = "l";
const addTopBtn = document.getElementById("topology-menu-btn");

addTopBtn.addEventListener("click", e => {
    console.log('globar var: ');
    console.log(globalVar);
    // dataVar = dataVar + "p";
    if (document.getElementById("topology-panel") !== null)
        return;
    topologyMenuHandler(mymap, dataVar, pathToIcon);
});

// console.log(topologyMenuHandler(mymap, dataVar));


/**
 * handles mouse events over the lines
 */
function handleMouseOverLines(lambdaList) {

    canvas.addEventListener("mousemove", e => showLineNumberInBox(e, lambdaList));
    canvas.addEventListener("mouseleave", unshowLineNumberInBox);
}

/**
 * addes legend to the given map
 */
function createLegend(mymap) {
    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.style.backgroundColor = 'WHITE';

        div.innerHTML += '<p>Number of Links<b>: XX</b></p>';
        div.innerHTML += '<p>xxxx  xxxx xxxx<b>: XX</b></p>';

        return div;
    };

    legend.addTo(mymap);
}




/**
 * 
 * @param data: an array of arrays containing two double values
 * 
 * example:
 * var dummyData = [
    [
        [33.51, 55.68],
        [33.51, 57.68]
    ],
    [
        [32.44, 50.40],
        [30.30, 60.00]
    ],
    [
        [30.51, 55.68],
        [33.51, 57.68]
    ],
    [
        [32.44, 56.40],
        [34.30, 60.00]
    ]
];
 */
function drawLines(data, callback) {
    lambda = [1, 4, 55];
    for (var i = 0; i < data.length; i++) {
        var polyline = L.polyline(data[i], lineOptions).addTo(mymap);
        polyline.bindPopup(drawDetailBox(lambda), popupOptions);
    }
    callback(lambda)
}

/**
 * draws a popup box with lines inside it.
 * retuns an html element (div)
 */
function drawDetailBox(lambda) {

    var h = canvas.height;
    console.log(h);

    var ctx = canvas.getContext("2d");

    for (var i = 1; i <= 100; i++) {

        ctx.beginPath();
        ctx.moveTo(i * 4, 0);
        ctx.lineTo(i * 4, h);
        ctx.lineWidth = 2;
        if (lambda.includes(i))
            ctx.strokeStyle = "black"
        else
            ctx.strokeStyle = "gray";
        ctx.stroke();

    }

    return wrapper;
}


/**
 * adds a number to the bootom of the popup box when mouse is over the corresponding line
 * @param  e: event 
 */
function showLineNumberInBox(e, lambdaList) {
    // console.log(e.target.getContext("2d"));
    x = e.clientX;
    y = e.clientY;
    var lineNum = 0;
    const xOff = e.offsetX;
    if (xOff % 4 <= 2) {
        cursor = " ";
        lineNum = parseInt(xOff / 4);
        if (lambdaList.includes(lineNum)) {
            cursor = lineNum;
        }
    } else {
        cursor = " ";
    }
    document.getElementById("displayArea").style.display = 'block';
    document.getElementById("displayArea").innerHTML = 'Wavelength Number: ' + cursor;
    document.getElementById("displayArea").style.right = x + 'px';
    document.getElementById("displayArea").style.top = y + 'px';
}

/**
 * removes the line number created in method showLineNumberInBox when mouse leaves the line
 */
function unshowLineNumberInBox() {
    document.getElementById("displayArea").innerHTML = "Wavelength Number: ";
}


//////////

// function drawLinkBetweenNodes(mymap) {

//     // var res = mymap.on("click", event => addLink(event));

//     // console.log('wtf');
//     // console.log(res);

//     return 4;

// }

function topologyMenuHandler(mymap, dataVar, pathToIcon) {

    var markers = [];
    var links = [];

    var markerList = [];

    featureGroup = L.featureGroup();
    console.log(featureGroup);
    featureGroup.addTo(mymap);

    var addNodeForm = createAddNodeForm(featureGroup, markers, markerList, mymap, pathToIcon);
    var addLinkForm = createAddLinkForm(featureGroup, links, markerList, mymap);

    var div = document.createElement("div");
    div.setAttribute("id", "topology-panel");

    var menu = L.control({ position: 'topright' });
    var closeBtn = document.createElement("button");
    closeBtn.setAttribute("class", "mainmap-util-closebtn");
    var addNodeBtn = document.createElement("button");
    addNodeBtn.setAttribute("class", "mainmap-util-btn");
    var addLinkbtn = document.createElement("button");
    addLinkbtn.setAttribute("class", "mainmap-util-btn");
    var doneBtn = document.createElement("button");
    doneBtn.setAttribute("class", "mainmap-util-btn");

    closeBtn.addEventListener("click", e => {

        markers = [];
        markerList = [];
        links = [];
        featureGroup.remove();

        div.remove();
    });


    addNodeBtn.addEventListener("click", e => {

        if (document.getElementById("addLinkForm").style.display === "block")
            return;
        document.getElementById("addNodeForm").style.display = "block";
    });

    updateVar = "";

    doneBtn.addEventListener("click", e => {
        // sendBack = true;
        //set marker coords and data to some variable
        featureGroup.eachLayer(layer => {
            if (layer instanceof L.Marker)
                layer.dragging.disable();
        });

        div.remove();
        console.log(markers);
        console.log(links);

        // send layers to map, delete the local featureGroup
        addLayersToMap(featureGroup, mymap);

        globalVar = {
            "nodes": markers,
            "links": links,
            "featureGroup": featureGroup
        }

    });

    doneBtn.innerHTML = "Done";
    addNodeBtn.innerHTML = "Add Node";
    closeBtn.innerHTML = "x";
    addLinkbtn.innerHTML = "Add Link"

    addLinkbtn.addEventListener("click", e => {

        if (document.getElementById("addNodeForm").style.display === "block")
            return;
        document.getElementById("addLinkForm").style.display = "block";
    });

    menu.onAdd = function (map) {

        div.appendChild(doneBtn);
        div.appendChild(addLinkbtn);
        div.appendChild(addNodeBtn);
        div.appendChild(closeBtn);
        div.appendChild(addNodeForm);
        div.appendChild(addLinkForm);

        return div;
    };

    menu.addTo(mymap);
}


function createAddNodeForm(featureGroup, markers, markerList, mymap, pathToIcon) {

    var div = document.createElement("div");
    div.setAttribute("id", "addNodeForm");
    div.setAttribute("class", "vertical");

    var inputParams = {
        "paramNames": ["RANDOM_Type"],
        "paramValues": ["Directionless"]
    }

    var srcNodepopup = L.popup({ closeOnClick: false, autoClose: false, offset: new L.Point(1, -20) }).setContent("Source Node");
    var destNodepopup = L.popup({ closeOnClick: false, autoClose: false, offset: new L.Point(1, -20) }).setContent("Destination Node");

    var nodeParams = createParamsInputs(inputParams.paramNames, inputParams.paramValues);

    var doneBtn = document.createElement("button");
    doneBtn.setAttribute("id", "submitNodeForm");
    doneBtn.setAttribute("class", "mainmap-util-btn");
    doneBtn.innerHTML = "Done";

    var closeBtn = document.createElement("button");
    closeBtn.setAttribute("id", "closeNodeForm");
    closeBtn.setAttribute("class", "mainmap-util-btn");
    closeBtn.innerHTML = "Close";

    closeBtn.addEventListener("click", e => {
        // console.log(featureGroup);
        document.getElementById("addNodeForm").style.display = "none";
    });

    doneBtn.addEventListener("click", e => {

        var nodeData;
        var marker;

        nodeData = onSubmitForm(inputParams.paramValues, inputParams.paramNames);
        marker = L.marker(mymap.getCenter(), { 
            draggable: true,
            icon: createCustomIcon(pathToIcon)
        });

        marker.on("click", e => {
            console.log(e.target);
            //possible bug when clicking on something other than the marker
            var isSrc = setLinkSrcAndDest(markerList, marker);
            console.log(isSrc);
            console.log("markerList", markerList);

            if (isSrc) {
                console.log(srcNodepopup);
                mymap.closePopup()
                srcNodepopup.setLatLng(e.target.getLatLng()).openOn(mymap);
            } else {
                destNodepopup.setLatLng(e.target.getLatLng()).openOn(mymap);
            }
        });


        var connectedLinks = [];
        var markerInitLatLng;

        marker.on("dragstart", e => {

            connectedLinks = []
            markerInitLatLng = e.target.getLatLng();

            getConnectedLinks(e.target, featureGroup, connectedLinks);
        });

        marker.on("drag", e => {

            console.log(e.target.getLatLng());
            markerInitLatLng = connectLinkToNode(e.target, connectedLinks, markerInitLatLng);
        })

        marker.on("dragend", e => {

            markerInitLatLng = connectLinkToNode(e.target, connectedLinks, markerInitLatLng);
        });

        featureGroup.addLayer(marker);
        markers.push({
            "node": marker,
            "nodeData": nodeData
        });
        // console.log(markers);
        div.style.display = "none";
    });

    for (var i = 0; i < nodeParams.length; i++) {
        div.appendChild(nodeParams[i].label);
        div.appendChild(nodeParams[i].param);
    }
    div.appendChild(doneBtn);
    div.appendChild(closeBtn);
    div.style.display = "none";
    return div;
}


function createAddLinkForm(featureGroup, links, markerList, mymap) {

    var div = document.createElement("div");
    div.setAttribute("id", "addLinkForm");
    div.setAttribute("class", "vertical");

    var inputParams = {
        "paramValues": ["0", "0.2", "0", "1.40E-03", "3.16914E-19"],
        "paramNames": ["Fiber_Type", "Loss_Coefficient", "Beta", "Gamma", "Dispersion"]
    };

    //create link Params
    linkParams = createParamsInputs(inputParams.paramNames, inputParams.paramValues);
    console.log(linkParams);

    var doneBtn = document.createElement("button");
    doneBtn.setAttribute("id", "submitLinkForm");
    doneBtn.setAttribute("class", "mainmap-util-btn");
    doneBtn.innerHTML = "Done";

    var closeBtn = document.createElement("button");
    closeBtn.setAttribute("id", "closeLinkForm");
    closeBtn.setAttribute("class", "mainmap-util-btn");
    closeBtn.innerHTML = "Close";

    closeBtn.addEventListener("click", () => {
        document.getElementById("addLinkForm").style.display = "none";
    });

    doneBtn.addEventListener("click", () => {

        var linkData;

        // will uncomment this once I fixed the method
        // var linkValidity = checkLinkValidity(markerList, featureGroup);

        // if (!linkValidity.isValid) {
        //     popupAlert(linkValidity.msg, mymap)
        //     return;
        // }

        if (markerList.length === 0 || markerList[markerList.length - 1] == undefined || markerList[markerList.length - 2] == undefined) {
            popupAlert("No chosen nodes.", mymap);
            return;
        }
        else if (markerList.length === 1) {
            popupAlert("Choose a destination node.", mymap);
            return;
        }

        if (markerList[markerList.length - 1] === markerList[markerList.length - 2]) {
            popupAlert("Choose a destination node.", mymap);
            return;
        }


        // put this to handle no returning out of the following loop, wtf is wrong with my code?
        var exitVar = false;

        featureGroup.eachLayer(layer => {

            if (layer instanceof L.Polyline) {
                if (layer.getLatLngs().includes(
                    markerList[markerList.length - 1].getLatLng())
                    && layer.getLatLngs().includes(
                        markerList[markerList.length - 2].getLatLng())) {
                    popupAlert("Link already exists.", mymap);
                    exitVar = true;
                    return;
                }
            }

        });

        if (exitVar) {
            return;
        }

        // just to make sure this line does not get executed after returning, js is acting funky again
        console.log("exec?");

        var latlngs = [
            markerList[markerList.length - 1].getLatLng(),
            markerList[markerList.length - 2].getLatLng(),
        ];

        var link = L.polyline(latlngs, { color: 'red' });
        featureGroup.addLayer(link);

        linkData = onSubmitForm(inputParams.paramValues, inputParams.paramNames);

        links.push({
            "link": link,
            "linkData": linkData
        });

        div.style.display = "none";

    });

    //add link params list
    for (var i = 0; i < linkParams.length; i++) {
        div.appendChild(linkParams[i].label);
        div.appendChild(linkParams[i].param);
    }
    div.appendChild(doneBtn);
    div.appendChild(closeBtn);

    div.style.display = "none";
    return div;
}

function onSubmitForm(paramValues, paramNames) {

    params = [];

    for (var i = 0; i < paramValues.length; i++) {
        var param = document.getElementById(paramNames[i]).value;
        params.push(param);
    }
    return params;
}


function popupAlert(msg, mymap) {

    var div = document.createElement("div");
    div.setAttribute("class", "alert");
    var alertTxt = document.createElement("div");
    alertTxt.setAttribute("class", "alert-txt");
    var closeBtn = document.createElement("button");

    alertTxt.innerHTML = msg;
    closeBtn.innerHTML = "x";
    closeBtn.setAttribute("class", "mainmap-util-closebtn");

    closeBtn.addEventListener("click", () => div.remove());

    var alertBox = L.control({ position: 'bottomright' });

    alertBox.onAdd = function (map) {
        div.appendChild(alertTxt);
        div.appendChild(closeBtn);
        return div;
    };

    alertBox.addTo(mymap);
    console.log(msg);
}


function connectLinkToNode(marker, connectedLinks, markerInitLatLng) {

    for (var i = 0; i < connectedLinks.length; i++) {
        var link = connectedLinks[i];
        console.log("ll" + link.getLatLngs());
        console.log("ma" + marker.getLatLng());

        var latLngStart = link._latlngs[0];
        var latLngEnd = link._latlngs[1];

        if (latLngEnd == markerInitLatLng) {

            console.log("ee");
            link.setLatLngs([
                link.getLatLngs()[0],
                marker.getLatLng()
            ]);
        }
        else if (latLngStart == markerInitLatLng) {

            console.log("ss");
            link.setLatLngs([
                marker.getLatLng(),
                link.getLatLngs()[1]
            ]);
        }
    }
    console.log("init " + markerInitLatLng);
    return marker.getLatLng();


}

function getConnectedLinks(marker, featureGroup, connectedLinks) {

    featureGroup.eachLayer(layer => {
        if (layer instanceof L.Polyline) {

            console.log(layer._latlngs);
            if (layer._latlngs.includes(marker.getLatLng())) {
                console.log("layer" + layer._latlngs);
                connectedLinks.push(layer)
            }
        }

    });
}

function setLinkSrcAndDest(markerList, marker) {

    if (markerList[0] == null) {
        console.log('srccc   ');
        markerList[0] = marker;
        return true;
    } else {
        if (markerList[1] == null) {
            console.log("desttt ");
            markerList[1] = marker;
            return false;
        } else {
            console.log("haha markers go recc recc");
            markerList[0] = null;
            markerList[1] = null;
            return setLinkSrcAndDest(markerList, marker);
        }
    }

}

function createLblTxtFromParamName(paramNames) {

    var lblTxts = [];
    for (var i = 0; i < paramNames.length; i++) {
        var txt = paramNames[i].replace(/_/g, " ");
        txt = txt.concat(": ");
        console.log(txt);
        lblTxts.push(txt);
    }

    return lblTxts;
}

function createParamsInputs(paramNames, paramValues) {

    var paramLblTxts = createLblTxtFromParamName(paramNames);

    var paramElements = [];

    for (var i = 0; i < paramNames.length; i++) {
        var param = document.createElement("input");
        param.setAttribute("id", paramNames[i]);
        param.setAttribute("class", "mainmap-util-input");
        param.setAttribute("type", "text");
        param.placeholder = paramValues[i];
        // param.addEventListener("focus", param.setAttribute("placeholder", ""));
        // param.addEventListener("blur" , e => param.setAttribute("placeholder", "DFLT: "+paramValues[i]));

        var paramLbl = document.createElement("label");
        paramLbl.setAttribute("class", "mainmap-util-label");
        paramLbl.innerHTML = paramLblTxts[i];

        paramElements.push({
            "param": param,
            "label": paramLbl
        });
    }

    return paramElements;
}


// not using this now - codes's acting strange
function checkLinkValidity(markerList, featureGroup) {

    if (markerList.length === 0) {
        return {
            "isValid": false,
            "msg": "No chosen nodes."
        };
    }
    else if (markerList.length === 1) {
        return {
            "isValid": false,
            "msg": "Chose a destination node."
        };
    }

    if (markerList[markerList.length - 1] === markerList[markerList.length - 2]) {
        return {
            "isValid": false,
            "msg": "Chose a destination node."
        };
    }

    latlngs = [
        markerList[markerList.length - 1].getLatLng(),
        markerList[markerList.length - 2].getLatLng(),
    ];

    featureGroup.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
            if (layer.getLatLngs().includes(latlngs[0]) && layer.getLatLngs().includes(latlngs[1])) {
                console.log("rep", layer.getLatLngs(), latlngs[0], latlngs[1]);
                return {
                    "isValid": false,
                    "msg": "rep"
                };
            }
        }

    });

    return {
        "isValid": true,
        "msg": ""
    };

}

function addLayersToMap(featureGroup, mymap) {

    featureGroup.addTo(mymap);
}

function createCustomIcon(pathToIcon) {

    var myIcon = L.icon({
        iconUrl: pathToIcon, 
        iconSize: [38, 55],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        //shadowUrl: pathToIcon,
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    return myIcon;
}
