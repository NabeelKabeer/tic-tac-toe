var td_ref = document.getElementsByTagName("td");
var new_game = document.getElementById('new_game');
var win = document.getElementById('winner');

var  PLAYER_ONE = -1;
var PLAYER_TWO = 1;

var human = PLAYER_ONE;
var ai = PLAYER_TWO;


var handle = PLAYER_ONE;

//setting up game functions...

function get_sum(total, num)
{
	return total + num;
}

function create_board()
{
	var b = new Array();
	for(var i =0;i < 3;i++){
		
		b[i] = new Array();
		
		for(var j =0;j < 3;j++)
			
			b[i][j] = 0;
	}
	return b;
}


function is_win_state(b,value)
{
    //check row wise...
	for(var i = 0;i < 3;i++)
		if( b[i].reduce(get_sum) == 3 * value)
			return true;
		
	//check col wise...
	var sum;
	for(var j =0;j < 3;j++){
		sum = 0;
		for(var i = 0;i < 3;i++)
			sum += b[i][j];
		if(sum == value * 3)
			return true;
	}
	
	//check diagonal wise...
	sum =0;
	for(var i =0;i < 3;i++)
		sum += b[i][i];
	if( sum == value * 3)
		return true;
	
	//check off diagonal wise...
	sum = 0;
	for(var i =0;i < 3;i++)
	    sum += b[i][2-i];
	if(sum == value * 3)
		return true;
	
	return false;
}
	
function is_win(b){
	if(is_win_state(b,PLAYER_ONE) || is_win_state(b,PLAYER_TWO))
		return true;
	return false;
}
	
function check_draw(b){
	for(var i =0;i < 3;i++)
		for(var j =0;j < 3;j++)
			if(b[i][j] == 0)
				return false;
	return true;
}

function game_over(board)
{
	return is_win(board) || check_draw(board);
}

function repaint_board(board)
{
	
	if(!game_over(board) && !confirm('Do you want to forfeit the game?'))
		return ;
	//initalize handle
	handle = PLAYER_ONE;
	win.textContent = '';
	//clear internal board state
	for(var i =0;i < 3;i++)
		for(var j = 0;j <3;j++)
			board[i][j] = 0;
	//clear visible game board
	
	td_elem = document.getElementsByTagName('td');
	for(var i =0;i< td_elem.length;i++)
		td_elem[i].textContent = '';
	
}


//to set visible board with corresponding letter
function handle_letter(handle)
{
	if(handle == -1)
		return 'X';
	else
		return 'O';
}
	
function is_valid_pos(board,x,y)
{
	if(board[x][y] != 0)
		return false;
	return true;
}

//to trigger event to register corresponding move
function register_move(board,k)
{
	return function(){
		//handle *= -1;
		x = Math.floor(k/3);
		y = k%3;
		//window.alert('x value is: '+x);
		//window.alert('y value is: ' +y);
		var win = document.getElementById('winner');
		if(is_valid_pos(board,x,y) && !is_win(board)){
			this.textContent = handle_letter(handle);
			board[x][y] = handle;
			if(is_win(board)){
				if( handle == -1)
					win.textContent = 'player 1 wins...';
				else
					win.textContent = 'player 2 wins...';
				//repaint_board(board);
		
			}
			else if(check_draw(board)){
				win.textContent = 'draw situation...';
				//repaint_board(board);
			}
			handle *= -1;
		}
	}
}

//select the next possible move
function minimax(temp_board,player)
{
	//check if any player won the game
	if(is_win_state(temp_board,human)) return {score: -10};
	else if(is_win_state(temp_board,ai)) return {score: 10};
	else if(check_draw(temp_board)) return {score: 0};
	
	var ai_max = -1000;
	var human_min = 10000;
	var move = {};
	//select all empty spots and select the one which maximizes output
	for(var i=0;i < 3;i++){
		for(var j=0;j < 3;j++){
			if(temp_board[i][j] == 0){
				temp_board[i][j] = player;
				var temp_score = minimax(temp_board,player * -1).score;
				if(player == ai && temp_score > ai_max){
					move.x = i;
					move.y = j;
					move.score = temp_score;
					ai_max = move.score;
					//console.log(move);
					//if(move.score == 10) break;
				}
				else if(player == human && temp_score < human_min){
					move.x = i;
					move.y = j;
					move.score = temp_score;
					human_min = move.score;
					//if(move.score == -10) break;
				}
				//rollback state for next simulation
				temp_board[i][j] = 0;
			}
		}
	}
	return move;
}
					
				
			
function register_move_one(board,k){
	//let the human register his move
	return function(){
		x = Math.floor(k/3);
		y = k%3;
		if(!is_valid_pos(board,x,y) || is_win(board))
			return;
		board[x][y] = human;
		this.textContent = handle_letter(human);
		if(is_win(board)) {win.textContent = 'Player one wins...';return;}
		else if(check_draw(board)) {win.textContent = 'Game Draw...';return;}
		
		ai_move = minimax(board,ai);
		console.log(ai_move);
		board[ai_move.x][ai_move.y] = ai;
		td_ref[ai_move.x * 3 + ai_move.y].textContent = handle_letter(ai);
		if(is_win(board)) {win.textContent = 'Player two wins...';return;}
		else if(check_draw(board)) {win.textContent = 'Game Draw...';return;}
		//print board state
		for(var i=0;i < 3;i++)
			console.log(board[i]);
	}
}
		

//game starts...

var board = create_board();
var i;
for(i =0;i < td_ref.length;i++){
	td_ref[i].addEventListener("click",my_fun= register_move_one(board,i),false);
}

new_game.addEventListener("click",function(){ repaint_board(board);},false);
