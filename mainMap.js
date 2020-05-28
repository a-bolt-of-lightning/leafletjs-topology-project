
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
    maxZoom: 8,
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
var markersGroup = new L.FeatureGroup();
markersGroup.on("click", groupClick);
mymap.addLayer(markersGroup);
var linksGroup = new L.FeatureGroup();
mymap.addLayer(linksGroup);
linksGroup.on("click", link_click_event);

var pathToIcon = "img/server_blue.png";
var marker1 = L.marker([33.51, 55.68], { icon: createCustomIcon(pathToIcon) })
    .addTo(markersGroup).bindTooltip("<h3>" + "m1" + "</h3>");
var marker2 = L.marker([34.51, 54.68], { icon: createCustomIcon(pathToIcon) })
    .addTo(markersGroup).bindTooltip("<h3>" + "m2" + "</h3>");
var marker3 = L.marker([34.51, 51.68], { icon: createCustomIcon(pathToIcon) })
    .addTo(markersGroup).bindTooltip("<h3>" + "m3" + "</h3>");


var latlngs = [
    marker1.getLatLng(),
    marker2.getLatLng(),
];

var link = L.polyline(latlngs,
    {
        color: 'black',
        opacity: 0.8,
        weight: 3
    }
).addTo(linksGroup).bindTooltip("m1-m2");



drawLines(dummyData, handleMouseOverLines);

createLegend(mymap);

// handleMouseOverLines();

var globalVar;
var dataVar = "l";
const addTopBtn = document.getElementById("topology-menu-btn");

addTopBtn.addEventListener("click", e => {
    // console.log('globar var: ');
    // console.log(globalVar);

    if (document.getElementById("topology-panel") !== null)
        return;
    if (globalVar !== undefined) {
        globalVar.featureGroup.eachLayer(layer => {
            if (layer instanceof L.Marker)
                layer.addTo(markersGroup);
            else if (layer instanceof L.Polyline)
                layer.addTo(linksGroup);
        })
    }

    topologyMenuHandler(mymap, markersGroup, linksGroup, pathToIcon);
});


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


var tempMarkerlist = [];
var markers = [];
var links = [];
function topologyMenuHandler(mymap, markersGroup, linksGroup, pathToIcon) {



    featureGroup = new L.featureGroup();
    featureGroup.addTo(mymap);
    featureGroup.on("click", handleMarkerOnClick);

    //turn perivious methods off
    markersGroup.off("click", groupClick);
    linksGroup.off("click", link_click_event);

    markersGroup.on("click", handleMarkerOnClick);

    featureGroup.on("contextmenu", deleteOnRightClick);


    var addNodeForm = createAddNodeForm(featureGroup, markers, mymap, pathToIcon);
    var addLinkForm = createAddLinkForm(featureGroup, links, mymap, linksGroup);

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
        tempMarkerlist = [];
        links = [];

        featureGroup.remove();
        closeAllPopups();
        markersGroup.off("click", handleMarkerOnClick);
        restoreOldFeatureGroupEvents(markersGroup, linksGroup);

        div.remove();
    });


    addNodeBtn.addEventListener("click", e => {

        if (document.getElementById("addLinkForm").style.display === "block")
            return;
        document.getElementById("addNodeForm").style.display = "block";
    });

    updateVar = "";

    doneBtn.addEventListener("click", e => {

        // remove new markers drag events
        featureGroup.eachLayer(layer => {
            if (layer instanceof L.Marker)
                layer.dragging.disable();
        });

        featureGroup.off("click", handleMarkerOnClick);

        markersGroup.off("click", handleMarkerOnClick);

        closeAllPopups();

        div.remove();

        // send layers to linksGroup and markersGroup, delete the local featureGroup
        featureGroup.eachLayer(l => {
            if (l instanceof L.Marker) {
                l.addTo(markersGroup);
            }

            else if (l instanceof L.Polyline)
                l.addTo(linksGroup);
        });


        globalVar = {
            "nodes": markers,
            "links": links,
            "featureGroup": featureGroup
        }

        // markersGroup.eachLayer(l => console.log(l));
        restoreOldFeatureGroupEvents(markersGroup, linksGroup);
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

// check for links connected to marker, also delete the data. - params? - only works for new nodes now
function deleteOnRightClick(event) {
    console.log(event.layer);
    if (event.layer instanceof L.Marker) {
        //delete data, connected links;
    }

    else if (event.layer instanceof L.Polyline) {
        // delete data
    }

}

function createAddNodeForm(featureGroup, markers, mymap, pathToIcon) {

    var div = document.createElement("div");
    div.setAttribute("id", "addNodeForm");
    div.setAttribute("class", "vertical");

    var inputParams = {
        "paramNames": ["Node_Name", "ROADM_Type"],
        "paramValues": ["", "Directionless"],
        "paramAllValues": ["", ["Directionless", "CDC"]]
    }

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
        document.getElementById("addNodeForm").style.display = "none";
    });

    doneBtn.addEventListener("click", e => {

        var nodeData;
        var marker;

        //check for input param validity:
        if (!isNameValid(inputParams.paramNames[0], markers)) {
            popupAlert("Invalid Node name", mymap);
            return;
        }

        if (!areNodeParamsValid(inputParams.paramNames[1], inputParams.paramAllValues[1])) {
            popupAlert("Invalid parameter. \n" +
                "ROADM TYPE can have a value of \"Directionless\" or \"CDC\".", mymap);
            return;
        }

        markerName = document.getElementById(inputParams.paramNames[0]).value;

        nodeData = onSubmitForm(inputParams.paramValues, inputParams.paramNames);
        marker = L.marker(mymap.getCenter(), {
            draggable: true,
            icon: createCustomIcon(pathToIcon)
        });

        marker.bindTooltip("<h3>" + markerName + "</h3>");

        featureGroup.addLayer(marker);

        var connectedLinks = [];
        var markerInitLatLng;

        marker.on("dragstart", e => {

            connectedLinks = []
            markerInitLatLng = e.target.getLatLng();
            getConnectedLinks(e.target, featureGroup, connectedLinks);
        });

        marker.on("drag", e => {
            markerInitLatLng = connectLinkToNode(e.target, connectedLinks, markerInitLatLng);
        })

        marker.on("dragend", e => {
            markerInitLatLng = connectLinkToNode(e.target, connectedLinks, markerInitLatLng);
        });


        markers.push({
            "name": markerName,
            "layer": marker,
            "data": nodeData,
            "isNew": true
        });
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


function handleMarkerOnClick(event) {

    if (!(event.layer instanceof L.Marker)) {
        return;
    }

    var marker = event.layer;

    var srcNodepopup = L.popup(
        { closeOnClick: false, autoClose: false, offset: new L.Point(1, -15) })
        .setContent("Source Node");
    var destNodepopup = L.popup(
        { closeOnClick: false, autoClose: false, offset: new L.Point(1, -15) })
        .setContent("Destination Node");

    var isSrc = setLinkSrcAndDest(marker);

    if (isSrc) {
        closeAllPopups();
        srcNodepopup.setLatLng(marker.getLatLng()).openOn(mymap);
    } else {
        destNodepopup.setLatLng(marker.getLatLng()).openOn(mymap);
    }

}

function createAddLinkForm(featureGroup, links, mymap, linksGroup) {

    var div = document.createElement("div");
    div.setAttribute("id", "addLinkForm");
    div.setAttribute("class", "vertical");

    var inputParams = {
        "paramValues": ["0.0", "0", "0.2", "0", "1.40E-03", "3.16914E-19"],
        "paramNames": ["Length", "Fiber_Type", "Loss_Coefficient", "Beta", "Gamma", "Dispersion"]
    };

    //create link Params
    linkParams = createParamsInputs(inputParams.paramNames, inputParams.paramValues);

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
        // var linkValidity = checkLinkValidity(tempMarkerlist, featureGroup);

        // if (!linkValidity.isValid) {
        //     popupAlert(linkValidity.msg, mymap)
        //     return;
        // }

        if (tempMarkerlist.length === 0 || tempMarkerlist[tempMarkerlist.length - 1] == undefined || tempMarkerlist[tempMarkerlist.length - 2] == undefined) {
            popupAlert("No chosen nodes.", mymap);
            return;
        }
        else if (tempMarkerlist.length === 1) {
            popupAlert("Choose a destination node.", mymap);
            return;
        }

        if (tempMarkerlist[tempMarkerlist.length - 1] === tempMarkerlist[tempMarkerlist.length - 2]) {
            popupAlert("Choose a destination node.", mymap);
            return;
        }

        // valid length
        if (!isLengthValid(inputParams.paramNames[0])) {
            popupAlert("Invalid Link Length", mymap);
            return;
        }


        // put this to handle no returning out of the following loop, wtf is wrong with my code?
        var exitVar = false;

        //check the new featuregreoup for a duplicate link
        featureGroup.eachLayer(layer => {
            if (layer instanceof L.Polyline) {
                if (layer.getLatLngs().includes(
                    tempMarkerlist[tempMarkerlist.length - 1].getLatLng())
                    && layer.getLatLngs().includes(
                        tempMarkerlist[tempMarkerlist.length - 2].getLatLng())) {
                    popupAlert("Link already exists.", mymap);
                    exitVar = true;
                    return;
                }
            }

        });


        // check oldFeatureGroup fro a duplicate link
        linksGroup.eachLayer(layer => {
            if (layer instanceof L.Polyline) {
                if (layer.getLatLngs().includes(
                    tempMarkerlist[tempMarkerlist.length - 1].getLatLng())
                    && layer.getLatLngs().includes(
                        tempMarkerlist[tempMarkerlist.length - 2].getLatLng())) {
                    popupAlert("Link already exists.", mymap);
                    exitVar = true;
                    return;
                }
            }
        })

        if (exitVar) {
            return;
        }

        // just to make sure this line does not get executed after returning, js is acting funky again
        // console.log("exec?");

        var startMarker = tempMarkerlist[tempMarkerlist.length - 1];
        var endMarker = tempMarkerlist[tempMarkerlist.length - 2];

        var latlngs = [
            startMarker.getLatLng(),
            endMarker.getLatLng(),
        ];

        var link = L.polyline(latlngs,
            {
                color: 'black',
                opacity: 0.8,
                weight: 3
            }
        );

        closeAllPopups();

        linkName = getMarkerName(startMarker) + "-" + getMarkerName(endMarker);
        link.bindTooltip("<h3>" + linkName + "</h3>");
        featureGroup.addLayer(link);

        linkData = onSubmitForm(inputParams.paramValues, inputParams.paramNames);

        links.push({
            "name": linkName,
            "layer": link,
            "data": linkData,
            "isNew": true
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

    //set the default value if there is no input
    for (var i = 0; i < paramValues.length; i++) {
        var param = document.getElementById(paramNames[i]).value;
        if (param === "" || param === null)
            param = paramValues[i];
        params.push(param);
    }
    return params;
}

function isLengthValid(lengthId) {
    length = document.getElementById(lengthId).value;

    if (length == null)
        return false;
    if (isNaN(length) || length.toString().indexOf('.') == -1)
        return false;

    return true;
}

function isNameValid(nameId, inputList) {

    //also check that the name is not already in the input list

    name = document.getElementById(nameId).value;

    if (name === null || name === "")
        return false;

    for (i = 0; i < inputList.length; i++) {
        if (inputList[i].name.toLowerCase() === name.toLowerCase())
            return false;
    }
    return true;
}

function areNodeParamsValid(paramName, allValues) {

    nodeParam = document.getElementById(paramName);

    if (nodeParam.value === null || nodeParam.value === "") {
        return true;
    }

    for (i = 0; i < allValues.length; i++) {
        if (nodeParam.value.trim() === allValues[i])
            return true;
    }

    return false;

}

function getMarkerName(marker) {

    var tooltip = marker["_tooltip"];
    if (tooltip == null || tooltip == undefined) {
        return "no_name";
    }
    x = tooltip["_content"];
    var doc = new DOMParser().parseFromString(x, "text/xml");
    var z = doc.documentElement.textContent;
    NodeName = z.replace(/\s/g, '');
    return NodeName;
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
}

function connectLinkToNode(marker, connectedLinks, markerInitLatLng) {

    for (var i = 0; i < connectedLinks.length; i++) {
        var link = connectedLinks[i];
        // console.log("ll" + link.getLatLngs());
        // console.log("ma" + marker.getLatLng());

        var latLngStart = link._latlngs[0];
        var latLngEnd = link._latlngs[1];

        if (latLngEnd == markerInitLatLng) {

            link.setLatLngs([
                link.getLatLngs()[0],
                marker.getLatLng()
            ]);
        }
        else if (latLngStart == markerInitLatLng) {

            link.setLatLngs([
                marker.getLatLng(),
                link.getLatLngs()[1]
            ]);
        }
    }
    return marker.getLatLng();
}

function getConnectedLinks(marker, featureGroup, connectedLinks) {

    featureGroup.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
            if (layer._latlngs.includes(marker.getLatLng())) {
                connectedLinks.push(layer)
            }
        }
    });
}

function setLinkSrcAndDest(marker) {

    if (tempMarkerlist[0] == null) {
        // console.log('srccc   ');
        tempMarkerlist[0] = marker;
        return true;
    } else {
        if (tempMarkerlist[1] == null) {
            // console.log("desttt ");
            tempMarkerlist[1] = marker;
            return false;
        } else {
            // console.log("haha markers go recc recc");
            tempMarkerlist[0] = null;
            tempMarkerlist[1] = null;
            return setLinkSrcAndDest(marker);
        }
    }

}

function createLblTxtFromParamName(paramNames) {

    var lblTxts = [];
    for (var i = 0; i < paramNames.length; i++) {
        var txt = paramNames[i].replace(/_/g, " ");
        txt = txt.concat(": ");
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
function checkLinkValidity(featureGroup) {

    if (tempMarkerlist.length === 0) {
        return {
            "isValid": false,
            "msg": "No chosen nodes."
        };
    }
    else if (tempMarkerlist.length === 1) {
        return {
            "isValid": false,
            "msg": "Chose a destination node."
        };
    }

    if (tempMarkerlist[tempMarkerlist.length - 1] === tempMarkerlist[tempMarkerlist.length - 2]) {
        return {
            "isValid": false,
            "msg": "Chose a destination node."
        };
    }

    latlngs = [
        tempMarkerlist[tempMarkerlist.length - 1].getLatLng(),
        tempMarkerlist[tempMarkerlist.length - 2].getLatLng(),
    ];

    featureGroup.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
            if (layer.getLatLngs().includes(latlngs[0]) && layer.getLatLngs().includes(latlngs[1])) {
                // console.log("rep", layer.getLatLngs(), latlngs[0], latlngs[1]);
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
        iconSize: [30, 30],
        iconAnchor: [20, 30]
    });

    return myIcon;
}

function restoreOldFeatureGroupEvents(markersGroup, linksGroup) {
    markersGroup.on("click", groupClick);
    linksGroup.on("click", link_click_event);
}

function closeAllPopups() {
    mymap.eachLayer(l => {
        // console.log("JOJO");
        if (l instanceof L.Popup) {
            // console.log("KONO DIO DA");
            mymap.removeLayer(l);
        }
    });
}

// replacement functions - do not copy them into your code, you already have them.
function link_click_event(event) {
    console.log("works link");
}

function groupClick(event) {
    console.log("works node");
}


