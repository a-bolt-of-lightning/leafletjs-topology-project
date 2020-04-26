/**
 * 
 * @param {*} mymap mapVar
 * @param {*} dataVar an empty variable, the data instead of being returned is stored in thsi variable.
 */

function addNodeToMainMap(mymap, dataVar) {

    var markerList = [];

    featureGroup = L.featureGroup();
    console.log(featureGroup);
    featureGroup.addTo(mymap);

    var data;
    var marker;

    var div = document.createElement("div");

    var menu = L.control({ position: 'topright' });
    var closeBtn = document.createElement("button");
    var addNodeBtn = document.createElement("button");
    var doneBtn = document.createElement("button");
    var addLinkbtn = document.createElement("button");


    closeBtn.addEventListener("click", e =>{
        
        featureGroup.remove();
        div.remove();
    });

    addNodeBtn.addEventListener("click", e => {
        marker = L.marker(mymap.getCenter(), {draggable: true});
        
        marker.on("click", e => {
            console.log(e.target);
            markerList.push(e.target);
        } );
        featureGroup.addLayer(marker);
    });

    doneBtn.addEventListener("click", e => {
        // sendBack = true;
        //set marker coords and data to some variable
        featureGroup.eachLayer(layer => {

            if(layer instanceof L.Marker)
                layer.dragging.disable();
        });
        div.remove();
        console.log(data);  
        dataVar = {
            "node-param": nodeParamsIn.value,
            "link-param": linkParamsIn.value,
            "featureGroup": featureGroup
        };
        console.log(dataVar);
        // return data;

    });

    var nodeParamsIn = document.createElement("input");
    nodeParamsIn.value = "def-param-node";
    nodeParamsIn.placeholder = "param-node";
    var linkParamsIn = document.createElement("input");
    linkParamsIn.value = "def-param-link";
    linkParamsIn.placeholder = "param-link";
    nodeParamsIn.setAttribute("type", "text");
    linkParamsIn.setAttribute("type", "text");

    doneBtn.innerHTML = "Done!";
    addNodeBtn.innerHTML = "Create!";
    closeBtn.innerHTML = "x";
    addLinkbtn.innerHTML = "add Link!"

    addLinkbtn.addEventListener("click", e => {

        console.log(markerList);

        latlngs = [
            markerList[markerList.length - 1].getLatLng(),
            markerList[markerList.length - 2].getLatLng(),
        ];
        console.log(latlngs);

        var link = L.polyline(latlngs, {color: 'red'});
        featureGroup.addLayer(link);

    });


    menu.onAdd = function (map) {

        div.appendChild(doneBtn);
        div.appendChild(addLinkbtn);
        div.appendChild(addNodeBtn);
        div.appendChild(closeBtn);
        div.appendChild(nodeParamsIn);
        div.appendChild(linkParamsIn);
        
        return div;
    };

    menu.addTo(mymap);

}