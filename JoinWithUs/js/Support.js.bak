documentWidth=window.screen.availWidth;
gridContainerWidth=0.92*documentWidth;
cellSideLength=0.18*documentWidth;
cellSpace=0.04*documentWidth;



function getPosTop(i,j){
	return cellSpace+i*(cellSpace+cellSideLength);
}

function getPosLeft(i,j){
	return cellSpace+j*(cellSpace+cellSideLength);
}

function getNumberBackgroundColor(number){
	switch(number){
	case 2:return "#eee4da"; break	;
	case 4:return "#ede0c8"; break	;
	case 8:return "#ec6624"; break	;
	case 16:return "#b2501d"; break;	
	case 32:return "#ef4c3b"; break;	
	case 64:return "#1e94c6"; break;
	case 128:return "#17a49c"; break;
	case 256:return "#939d3a"; break;	
	case 512:return "#8dbc01"; break;	
	case 1024:return "#2ba11e"; break;	
	case 2048:return "#f80e3a"; break	;
	case 4096:return "#8d38b8"; break	;
	case 8192:return "#f62d1e"; break	;
	}
	return "black"
}

function getNumberText(number){
	switch(number){
		case 2:return "兵"; break;
		case 4:return "班"; break;
		case 8:return "排"; break;
		case 16:return "连"; break;	
		case 32:return "营"; break;	
		case 64:return "团"; break;
		case 128:return "旅"; break;
		case 256:return "师"; break;	
		case 512:return "军"; break;	
		case 1024:return "军团"; break;	
		case 2048:return "战区"; break	;
		case 4096:return "全国军队"; break	;
		case 8192:return "全球军队"; break	;
	}
    return "black";
}
function getNumberColor(number){
	if(number<=4)
		return "#776e65";
		
	return "#ded0c2"
}

function nospace( board ){

    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ )
            if( board[i][j] == 0 )
                return false;

    return true;
}

function canMoveLeft(board){
	for(var i=0; i<4;i++)
		for(var j=0; j<4;j++)
			if(board[i][j]!=0)
				if(board[i][j-1]==0 || board[i][j-1]==board[i][j])
					return true;
					
		return false;	
}

function canMoveRight(board){
	for(var i=0; i<4;i++)
		for(var j=2; j>=0;j--)
			if(board[i][j]!=0)
				if(board[i][j+1]==0 || board[i][j+1]==board[i][j])
					return true;
					
		return false;	
}

function canMoveUp( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ )
            if( board[i][j] != 0 )
                if( board[i-1][j] == 0 || board[i-1][j] == board[i][j] )
                    return true;

    return false;
}

function canMoveDown( board ){

    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- )
            if( board[i][j] != 0 )
                if( board[i+1][j] == 0 || board[i+1][j] == board[i][j] )
                    return true;

    return false;
}



function noBlockHorizontal(row,coll,col2,board){
	for(var i=coll+1;i<col2;i++)
		if(board[row][i]!=0)
			return false;
	return true;
			
}

function noBlockVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != 0 )
            return false;
    return true;
}

function nomove(board){
	if(canMoveLeft(board)||
	canMoveRight(board)||
	canMoveUp(board)||
	canMoveDown(board))
	return false;
	
return true;
}
