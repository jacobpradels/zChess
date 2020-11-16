/**
 * zChess functionality script
 * @author Jacob Pradels
 * @version 0.09
 * 
 * @todo add movement for Queen, King
 * @todo add check implementation
 * @todo Fix the update script to remove pieces from the board
 * @todo allow front end movement of pieces 
 */
window.onload = init;

var temp_board;
var enpassant = false;

var dr0Moved = false, dr1Moved = false, dkMoved = false, lr0Moved = false, lr1Moved = false, lkMoved = false;

var board = [
    ["dr0","dn0","db0","dq","dk","db1","dn1","dr1"],
    ["dp0","dp1","dp2","dp3","dp4","dp5","dp6","dp7"],
    ["n","n","n","n","n","n","n","n"],
    ["n","n","n","n","n","n","n","n"],
    ["n","n","n","n","n","n","n","n"],
    ["n","n","n","n","n","n","n","n"],
    ["lp0","lp1","lp2","lp3","lp4","lp5","lp6","lp7"],
    ["lr0","ln0","lb0","lq","lk","lb1","ln1","lr1"],
    []
]

function drawBoard()
{

}

/**
 * Updates the locations of the HTML elements representing pieces
 * based on their location in the board array
 */
function updateBoard()
{
    for (var y = 0; y < 9; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            if (board[y][x] != "n" && board[y][x] != "e")
            {
                var elmnt = document.getElementById(board[y][x]);
                if (elmnt != null)
                {
                    if (y == 8)
                    {
                        elmnt.style.opacity = 0;
                    }
                    elmnt.style.top = y*5 + "vw";
                    elmnt.style.left = x*5 + "vw";
                }
            } else if (board[y][x] == "e")
            {
                if (enpassant)
                {
                    enpassant = false;
                } else {
                    board[y][x] = "n";
                }
            }
        }
    }
}

/**
 * Finds the location of piece in the board array
 * @param {string} piece - The piece to be found
 * @returns {number|array} The coordinates in the board array of the piece in (y,x) format 
 */
function findPiece(piece)
{
    for (var y = 0; y < 8; y++)
    {
        for (var x = 0; x < 8; x++)
        {
            if (board[y][x] == piece)
            {
                return [y,x];
            }
        }
    }
}


/**
 * Converts standard chess notation to the program's coordinate system
 * @param {string} file 
 * @param {int} rank 
 * @return array containing the y,x coordinates
 */
function coordToChess(file, rank)
{
    var files = ["a","b","c","d","e","f","g","h"];
    var ranks = [8,7,6,5,4,3,2,1]
    return [ranks.indexOf(rank),files.indexOf(file)];
}

/**
 * This function updates the board array
 * The piece is then visually moved by the updateBoard function
 * @param {string} piece - the name of the piece to be moved
 * @param {int} y - the y location to move the piece to
 * @param {int} x - the x location to move the piece to
 */
function movePiece(piece, file, rank)
{
    var position = coordToChess(file,rank)
    var y = position[0];
    var x = position[1];
    var piece_position = findPiece(piece);
    var color = "dark";
    if (document.getElementById(piece).classList.contains("light"))
    {
        color = "light";
    }
    

    console.log(checkLegalMove(piece,y,x,piece_position, board)); //Prints true or false to show if move was valid
    if (checkLegalMove(piece,y,x,piece_position,board) == "e")
    {
        temp_board = JSON.parse(JSON.stringify(board)); // Deep copy board in case need to revert
        board[piece_position[0]][piece_position[1]] = "n";
        if (color == "light")
        {
            board[8].push(board[y+1][x]);
            board[y+1][x] = "n";
            board[y][x] = piece;
        } else if (color == "dark")
        {
            board[8].push(board[y-1][x])
            board[y-1][x] = "n";
            board[y][x] = piece;
        }
        
        if (checkCheck(color))
        {
            console.log("Illegal move. " + color + " king is in check");
            board = JSON.parse(JSON.stringify(temp_board)); // Revert the board to before the move
        }
    } else if (checkLegalMove(piece,y,x,piece_position,board) == "castle") 
    {
        var king_y = piece_position[0];
        var king_x = piece_position[1];
        if (x == king_x - 2) // Castle queen side
        {
            if (board[y][king_x-1] == "n" && board[y][king_x-2] == "n" && board[y][king_x-3] == "n")
            {
                if (!checkThreat(color, king_y, king_x) && !checkThreat(color,king_y,king_x-1) && !checkThreat(color,king_y,king_x-2) && !checkThreat(color,king_y,king_x-3));
                {
                    board[king_y][king_x] = "n";
                    board[y][x] = piece;
                    board[y][x+1] = board[y][x-2];
                    board[king_y][king_x - 4] = "n";
                    if (color == "dark")
                    {
                        dkMoved = true;
                    } else if (color == "light") {
                        lkMoved = true;
                    }
                }
            }
        } else if (x == king_x + 2) // Castle king side
        {
            if (board[y][king_x+1] == "n" && board[y][king_x+2] == "n")
            {
                if (!checkThreat(color,king_y,king_x) && !checkThreat(color,king_y,king_x+1) && !checkThreat(color,king_y,king_x+2))
                {
                    board[king_y][king_x] = "n";
                    board[y][x] = piece;
                    board[y][x-1] = board[king_y][king_x + 3];
                    board[king_y][king_x + 3] = "n";
                    if (color == "dark")
                    {
                        dkMoved = true;
                    } else if (color == "light") {
                        lkMoved = true;
                    }
                }
            }
        }
    } else if (checkLegalMove(piece,y,x,piece_position, board))
    {
        temp_board = JSON.parse(JSON.stringify(board)); // Deep copy board in case need to revert
        board[piece_position[0]][piece_position[1]] = "n";
        if (board[y][x] != "n")
        {
            board[8].push(board[y][x]);
        }
        board[y][x] = piece;
        
        var reset = false;
        if (checkCheck(color))
        {
            reset = true;
            console.log("Illegal move. " + color + " king is in check");
            board = JSON.parse(JSON.stringify(temp_board)); // Revert the board to before the move
        }
        if (!reset)
        {
            if (piece == "dr0") {
                dr0Moved = true;
            } else if  (piece == "dr1")
            {
                dr1Moved = true;
            } else if (piece == "lr0")
            {
                lr0Moved = true;
            } else if (piece == "lr1")
            {
                lr1Moved = true;
            }
        }

    } else {
        console.log("Illegal move. Piece is blocked or can't move like that.")
    }
}

function checkLegalMove(piece, y, x, pos)
{
    var piece_y = pos[0];
    var piece_x = pos[1];
    var piece_element = document.getElementById(piece);
    // console.log(y);
    // console.log(board[y]);
    var other_element = document.getElementById(board[y][x]);
    var other_pos = findPiece(board[y][x]);
    var returnVal = false;
    //Makes sure that the piece is valid
    if (!piece_element)
    {
        return false;
    //Check if player is attempting to take their own piece

    } else {
        /*
        * Seperate check for every piece
        * go through and check for piece in between
        * piece and target location
        */
        if (other_element != null)
        {
            if (piece_element.classList.contains("dark"))
            {
                if (other_element.classList.contains("dark"))
                {
                    return false;
                }
            } else if (piece_element.classList.contains("light"))
            {
                if (other_element.classList.contains("light"))
                {
                    return false;
                }
            }
        }
        //Rook implementation
        if (piece_element.classList.contains("rook"))
        {
            returnVal = checkRook(piece_y,piece_x,y,x);
            //Bishop implementation
        }else if (piece_element.classList.contains("bishop"))
        {            
            returnVal = checkBishop(piece_y, piece_x,y,x);
            //Pawn implementation
        } else if (piece_element.classList.contains("pawn"))
        { 
            returnVal = checkPawn(piece_y,piece_x,y,x,piece_element, other_element);
            /*
            * Knight functionality
            * 8 Possible moves
            * (y+2)(x+1), (y-2)(x+1), (y+2)(x-1), (y-2)(x-1), (y+1)(x+2), (y-1)(x-2), (y+1)(x-2), (y-1)(x-2)
            */
        } else if (piece_element.classList.contains("knight"))
        {
            returnVal = checkKnight(piece_y,piece_x,y,x,piece_element,other_element);
        } else if (piece_element.classList.contains("queen"))
        {
            returnVal = (checkRook(piece_y,piece_x,y,x) || checkBishop(piece_y, piece_x,y,x));
            //returnVal = checkBishop(piece_y, piece_x,y,x);
        } else if (piece_element.classList.contains("king"))
        {
            returnVal = checkKing(piece_y,piece_x,y,x, piece_element, other_element);
        }
    }
    
    return returnVal;
}

var calls =0;
function checkRook(piece_y, piece_x, y, x)
{
    var color = "dark";
    if (document.getElementById(board[piece_y][piece_x]).classList.contains("light"))
    {
        color = "light";
    }
    if (piece_y == y)
    {
        for (var iter_x = 0; iter_x < 8; iter_x++)
        {
            if (board[y][iter_x] != "n")
            {
                if ((piece_x < iter_x && x > iter_x) || (piece_x > iter_x && x < iter_x))
                {
                    return false;
                }
            }
        }
        
        return true;
        //If the target position is vertically aligned with the rook
    } else if (piece_x == x)
    {
        for (var iter_y = 0; iter_y < 8; iter_y++)
        {
            if (board[iter_y][x] != "n")
            {
                if ((piece_y < iter_y && y > iter_y) || (piece_y > iter_y && y < iter_y))
                {
                    return false;
                }
            }
        }
        return true;
    }
}

function checkBishop(piece_y, piece_x, y, x)
{
    var slope = Math.abs((piece_y - y) / (piece_x - x));
    if (slope != 1)
    {
        return false;
    } else {
        var top_left = [piece_y,piece_x]
        var top_right = [piece_y,piece_x];
        while (top_left[0] != 0 && top_left[1] != 0)
        {
            top_left[0]--;
            top_left[1]--;
        }
        while (top_right[0] != 0 && top_right[1] != 0)
        {
            top_right[0]--;
            top_right[1]++;
        }
        for (var iter_x = 0; iter_x < 8; iter_x++)
        {
            var current_y = top_left[0];
            var current_x = top_left[1];
            if (current_y > 8)
            {
                break;
            }
            if (board[current_y][current_x] != "n")
            {
                if ((piece_x < current_x && piece_y < current_y) && (x > current_x && y > current_y))
                {
                    return false;
                } else if ((piece_x > current_x && piece_y > current_y) && (x < current_x && y < current_y))
                {
                    return false;
                }
            }
            var current_y = top_right[0];
            var current_x = top_right[1];
            if (board[current_y][current_x] != "n")
            {
                //piece_x = piece trying to move
                //current_x = where the iterator is at (piece in the way)
                //x = piece being checked if can move or attack there
                if ((piece_x < current_x && piece_y > current_y) && (x > current_x && y < current_y))
                {
                    return false;
                } else if ((piece_x > current_x && piece_y < current_y) && (x < current_x && y > current_y))
                {
                    return false;
                }

            }
            top_left[0]++;
            top_left[1]++;
            top_right[0]++;
            top_right[1]--;
        }
    }
    
    return true;
}

function checkPawn(piece_y,piece_x,y,x, piece_element, other_element)
{
    if (piece_element.classList.contains("dark"))
    {
        if (y == piece_y + 1 && board[y][x] == "n" && x == piece_x)
        {
            return true;
        } else if (y == piece_y + 2 && board[y][x] == "n" && (board[y-1][x] == "n" || board[y-1][x] == "e") && piece_y == 1 && x == piece_x)
        {
            enpassant = true;
            board[y-1][x] = "e";
            return true;
        } else if ((y == piece_y + 1 && x == piece_x + 1) || (y == piece_y + 1 && x == piece_x - 1))
        {
            if (other_element != null)
            {
                if (other_element.classList.contains("light"))
                {
                    return true;
                }
            } else if (board[y][x] == "e") // En passant check
            {
                return "e";
            }
        }
    } else if (piece_element.classList.contains("light"))
    {
        if (y == piece_y - 1 && board[y][x] == "n" && x == piece_x)
        {
            return true;
        } else if (y == piece_y - 2 && board[y][x] == "n" && (board[y-1][x] == "n") && piece_y == 6 && x == piece_x)
        {
            enpassant = true;
            board[y+1][x] = "e";
            return true;
        } else if ((y == piece_y - 1 && x == piece_x + 1) || (y == piece_y -1 && x == piece_x - 1))
        {
            if (other_element != null)
            {
                if (other_element.classList.contains("dark"))
                {
                    return true;
                }
            } else if (board[y][x] == "e")
            {
                return "e";
            }
        } 
    }
    return false;
}

function checkKnight(piece_y,piece_x,y,x,piece_element,other_element)
{
    if ((y == piece_y + 2 && x == piece_x + 1) 
    || (y == piece_y - 2 && x == piece_x + 1) 
    || (y == piece_y + 2 && x == piece_x - 1) 
    || (y == piece_y - 2 && x == piece_x - 1) 
    || (y == piece_y + 1 && x == piece_x + 2) 
    || (y == piece_y - 1 && x == piece_x - 2) 
    || (y == piece_y + 1 && x == piece_x - 2) 
    || (y == piece_y - 1 && x == piece_x + 2)) 
    {
        if (other_element != null)
        {
            if (piece_element.classList.contains("dark"))
            {
                if (other_element.classList.contains("light"))
                {
                    return true
                }
            } else if (other_element.classList.contains("dark"))
            {
                return true;
            }
        } else {
            return true;
        }
    }
    return false;
}
/* 8 Moves around king, checks are handled seperately 
 *(y-1,x-1) (y-1, x==x), (y-1, x+1)
 * (y==y, x-1) --------- (y==y, x+1)
 * (y+1,x+1), (y+1, x==x), (y+1, x+1)
 */
function checkKing(piece_y, piece_x, y, x, piece_element, other_element)
{
    if ((y == piece_y - 1 && x == piece_x - 1) 
    || (y == piece_y - 1 && x == piece_x) 
    || (y == piece_y - 1 && x == piece_x + 1) 
    || (y == piece_y && x == piece_x - 1) 
    || (y == piece_y && x == piece_x + 1) 
    || (y == piece_y + 1 && x == piece_x - 1) 
    || (y == piece_y + 1 && x == piece_x) 
    || (y == piece_y + 1 && x == piece_x + 1))
    {
        if (other_element != null)
        {
            if (piece_element.classList.contains("dark"))
            {
                if (other_element.classList.contains("light"))
                {
                    dkMoved = true;
                    return true
                }
            } else if (other_element.classList.contains("dark"))
            {
                lkMoved = true;
                return true;
            }
        } else {
            return true;
        }
    } else if ((y == piece_y && x == piece_x + 2) || (y == piece_y && x == piece_x - 2))
    {
        if (piece_element.classList.contains("light") )
        {
            if (((!lkMoved && !lr0Moved) && x == piece_x - 2) || ((!lkMoved && !lr1Moved) && x == piece_x + 2))
            {
                return "castle"; //lkMoved=true will be set in the movePiece function because checkCheck needs to be called
            }
        } else if (piece_element.classList.contains("dark"))
        {
            if ((!dkMoved && !dr0Moved && x == piece_x - 2) || (!dkMoved && !dr1Moved && x == piece_x + 2))
            {
                return "castle";
            }
        }
    }
    return false;
}

function checkCheck(color)
{
    if (color == "dark")
    {
        var king = "dk";
        var kingPos = findPiece(king);
        for (var y = 0; y < 8; y++)
        {
            for (var x = 0; x < 8; x++)
            {
                if (board[y][x] != "n" && board[y][x].substring(0,1) != "d")
                {
                    if (checkLegalMove(board[y][x],kingPos[0],kingPos[1],findPiece(board[y][x])))
                    {
                        console.log("dark king in check");
                        return true;
                    }
                }
            }
        }
    } else if (color == "light")
    {
        var king = "lk";
        var kingPos = findPiece(king);
        for (var y = 0; y < 8; y++)
        {
            for (var x = 0; x < 8; x++)
            {
                if (board[y][x] != "n" && board[y][x].substring(0,1) != "l")
                {
                    if (checkLegalMove(board[y][x],kingPos[0],kingPos[1],findPiece(board[y][x])))
                    {
                        console.log("light king in check");
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function checkThreat(color, threatpos_y, threatpos_x)
{
    if (color == "dark")
    {
        for (var y = 0; y < 8; y++)
        {
            for (var x = 0; x < 8; x++)
            {
                if (board[y][x] != "n" && board[y][x].substring(0,1) != "d")
                {
                    if (checkLegalMove(board[y][x],threatpos_y,threatpos_x,findPiece(board[y][x])))
                    {
                        return true;
                    }
                }
            }
        }
    } else if (color == "light")
    {
        for (var y = 0; y < 8; y++)
        {
            for (var x = 0; x < 8; x++)
            {
                if (board[y][x] != "n" && board[y][x].substring(0,1) != "l")
                {
                    if (checkLegalMove(board[y][x],threatpos_y,threatpos_x,findPiece(board[y][x])))
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function init()
{
    updateBoard();
}