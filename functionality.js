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
function init()
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
    // for (var i = 0; i < pieces.length; i++)
    // {
    //     var elmnt = document.getElementById(pieces[i]);
    //     elmnt.style.top = 0 + "vw";
    //     elmnt.style.left = i*5 + "vw"
    // }
}