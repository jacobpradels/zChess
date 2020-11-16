//Make the object in hand always on top
var offsetX = -50;
var offsetY = -50;
var holding = false;
var target, targetSquare;
window.onclick = e => {
    if (holding)
    {
        //Finding the square that piece is dropped on
        //Storing that square in targetSquare
        var mouseX = e.pageX, mouseY = e.pageY;
        target.style.pointerEvents = "none";
        targetSquare = getSquareUnderPieces(mouseX,mouseY);
        target.style.pointerEvents = "auto";

        //Storing information about the piece
        var piece = target.id; 
        
        target = null;
        holding = false;

        //Calling move piece function
        var file = targetSquare.id.substring(0,1);
        var rank = parseInt(targetSquare.id.substring(1,2),10);

        console.log("piece: " + piece + "position : " + file + rank);
        movePiece(piece,file,rank);
        updateBoard();

        
    } else {
        if (e.target.classList.contains("piece"))
        {
            // target.style.pointerEvents = "unset";
            console.log(e.target.id);  // to get the element tag name alone
            target = document.getElementById(e.target.id);
            target.style.left = e.pageX + offsetX + "px";
            target.style.top = e.pageY + offsetY + "px";
            holding = true;
        }
    }
} 


const onMouseMove = (e) => {
    if (target != null)
    {
        // console.log("target x :" + target.style.left + " mouse x : " + e.pageX);
        target.style.left = e.pageX + offsetX + "px";
        target.style.top = e.pageY + offsetY + "px";
    }
}

function getSquareUnderPieces(mouseX,mouseY)
{
    var pieces = [];
    var current = document.elementFromPoint(mouseX,mouseY);
    while (current.classList.contains("piece"))
    {
        pieces.push(current);
        current.style.pointerEvents = "none";
        current = document.elementFromPoint(mouseX,mouseY);
    }
    for (var i = 0; i < pieces.length; i++)
    {
        pieces[i].style.pointerEvents = "auto";
    }
    return current;
}

document.addEventListener('mousemove', onMouseMove);