


function handleMouseOverLines() {

    canvas.addEventListener("mousemove", showLineNumberInBox);
    canvas.addEventListener("mouseleave", unshowLineNumberInBox);
}



function showLineNumberInBox(e) {
    x = e.clientX;
    y = e.clientY;
    const xOff = e.offsetX;
    if (xOff % 4 <= 2) {
        cursor = parseInt(xOff / 4);
        if(cursor == 0){
            cursor = " ";
        }
    } else {
        cursor = " ";
    }
    document.getElementById("displayArea").style.display = 'block';
    document.getElementById("displayArea").innerHTML = 'Wavelength Number: '+ cursor;
    document.getElementById("displayArea").style.right = x + 'px';
    document.getElementById("displayArea").style.top = y + 'px';
}



function unshowLineNumberInBox() {
    document.getElementById("displayArea").innerHTML = "Wavelength Number: ";
}