window.onload = init;
var board = [
    ["dr0","dn0","db0","dq","dk","db1","dn1","dr1"],
    ["dp0","dp1","dp2","dp3","dp4","dp5","dp6","dp7"],
    ["n","n","n","n","n","n","n","n"],
    ["n","n","n","n","n","n","n","n"],
    ["n","n","n","n","n","n","n","n"],
    ["n","n","n","n","n","n","n","n"],
    ["lp0","lp1","lp2","lp3","lp4","lp5","lp6","lp7"],
    ["lr0","ln0","lb0","lq","lk","lb1","ln1","lr1"]
]


/**
 * Updates the locations of the HTML elements representing pieces
 * based on their location in the board array
 */
function updateBoard()
{
    for (var y = 0; y < board.length; y++)
    {
        for (var x = 0; x < board[0].length; x++)
        {
            if (board[y][x] != "n")
            {
                var elmnt = document.getElementById(board[y][x]);
                elmnt.style.top = y*5 + "vw";
                elmnt.style.left = x*5 + "vw";
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
    for (var y = 0; y < board.length; y++)
    {
        for (var x = 0; x < board[0].length; x++)
        {
            if (board[y][x] == piece)
            {
                return [y,x];
            }
        }
    }
}

/**
 * This function updates the board array
 * The piece is then visually moved by the updateBoard function
 * @param {string} piece - the name of the piece to be moved
 * @param {int} y - the y location to move the piece to
 * @param {int} x - the x location to move the piece to
 */
function movePiece(piece, y, x)
{
    var piece_position = findPiece(piece);
    console.log(checkLegalMove(piece,y,x,piece_position));
    if (checkLegalMove(piece,y,x,piece_position))
    {
        board[piece_position[0]][piece_position[1]] = "n";
        board[y][x] = piece;
    }
}

function checkLegalMove(piece, y, x, pos)
{
    var piece_y = pos[0];
    var piece_x = pos[1];
    var piece_element = document.getElementById(piece);
    var other_element = document.getElementById(board[y][x]);
    var other_pos = findPiece(board[y][x]);
    //Makes sure that the piece is valid
    if (!piece_element)
    {
        return false;
    //Check if player is attempting to take their own piece
    } else if (other_element != null) {
        if (other_element.classList.contains("dark") && piece_element.classList.contains("dark"))
        {
            return false;
        } else if (other_element.classList.contains("light") && piece_element.classList.contains("light"))
        {
            return false;
        }
    } else {
        /*
        * Seperate check for every piece
        * go through and check for piece in between
        * piece and target location
        */

        //Rook implementation
        if (piece_element.classList.contains("rook"))
        {
            //If the target position is horizontally aligned with the rook
            if (piece_y == y)
            {
                for (var iter_x = 0; iter_x < 8; x++)
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
        //Bishop implementation
        } else if (piece_element.classList.contains("bishop"))
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
                //This loop will go out of bounds, but javascript doesn't throw indexOutOfBounds so its okay and will just check the whole diagonal
                for (var iter_x = 0; iter_x < 8; iter_x++)
                {
                    var current_y = top_left[0];
                    var current_x = top_left[1];
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
                        if ((piece_x < current_x && piece_y < current_y) && (x > current_x && y > current_y))
                        {
                            return false;
                        } else if ((piece_x > current_x && piece_y > current_y) && (x < current_x && y < current_y))
                        {
                            return false;
                        }
                    }
                    top_left[0]++;
                    top_left[1]++;
                    top_right[0]++;
                    top_right[1]--;
                }
                return true;
            }
        }
    }
}
function init()
{
    updateBoard();
    console.log(findPiece("db0"));
    // movePiece("db0",5,7);
    updateBoard();
}
