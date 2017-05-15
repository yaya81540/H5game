//获取游戏区域
var game_main=document.getElementById('game_main')
//数字部件
function NumTo(){
	this.odiv=document.createElement("div");
	this.posX=parseInt(Math.random()*4+1);
	this.posY=parseInt(Math.random()*4+1);
	this.num=parseInt(Math.random()*2+1)*2;
}
//初始化&&判断当前位置是否有数字块
NumTo.prototype.init=function(){
	function isNewPosition(){
		if(mynum.length==16){
			alert('you lose!');
			return
		}
		for(var i=0;i<mynum.length-1;i++){
//			if(mynum[i].num==2048)alert('you win!');return
			if(mynum[i].posX==this.posX&&mynum[i].posY==this.posY)return false
		}
		return true
	}
	console.log(!isNewPosition());
	while(!isNewPosition()){
		console.log(this.posX+'-'+this.posY)
		this.posX=parseInt(Math.random()*4+1);
		this.posY=parseInt(Math.random()*4+1);
	}
}
NumTo.prototype.writeIn=function(){
	this.odiv.className='grid gridNum-'+this.num+' gridP-'+this.posX+'-'+this.posY;
	this.odiv.innerHTML=this.num;
	game_main.appendChild(this.odiv);
}
//判断数字块的移动
function toMove(direction){
	switch(direction){
		case 'top':yMove([1,2,3,4]);break;
		case 'bottom':yMove([4,3,2,1]);break;
		case 'left':xMove([1,2,3,4]);break;
		case 'right':xMove([4,3,2,1]);
	}
	console.log(mynum)
}
var arr=[[],[],[],[]];
var delet=[];
//纵向移动
function yMove(pos){//pos为数组[1,2,3,4]或 [4,3,2,1]
	var order=''
	if(pos==[1,2,3,4]){
		order='small';
	}else{
		order='big';
	}
	mynum.sort(rank('posY',order)).sort(rank('posX','small'))
	arr=[[],[],[],[]];
	delet=[];
	for(i in mynum){
		for(var j=0;j<4;j++){
			if(mynum[i].posX==j+1)arr[j].push(i);
		}
	}
	for(i in arr){
		if(arr[i].length==1){
			mynum[arr[i][0]].posY=pos[0];
		}else if(arr[i].length==2){
			if(mynum[arr[i][0]].num==mynum[arr[i][1]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][0]].posY=pos[0];
				delet.push(arr[i][1])
			}else{
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][1]].posY=pos[1];
			}
		}else if(arr[i].length==3){
			if(mynum[arr[i][0]].num==mynum[arr[i][1]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][2]].posY=pos[1];
				delet.push(arr[i][1])
			}else if(mynum[arr[i][1]].num==mynum[arr[i][2]].num){
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][2]].posY=pos[1];
				delet.push(arr[i][1])
			}else{
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][1]].posY=pos[1];
				mynum[arr[i][2]].posY=pos[2];
			}
		}else if(arr[i].length==4){
			if(mynum[arr[i][0]].num==mynum[arr[i][1]].num&&mynum[arr[i][2]].num==mynum[arr[i][3]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][2]].posY=pos[1];
				delet.push(arr[i][1]);
				delet.push(arr[i][3])
			}else if(mynum[arr[i][0]].num==mynum[arr[i][1]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][2]].posY=pos[1];
				mynum[arr[i][3]].posY=pos[2];
				delet.push(arr[i][1])
			}else if(mynum[arr[i][1]].num==mynum[arr[i][2]].num){
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][2]].posY=pos[1];
				mynum[arr[i][3]].posY=pos[2];
				delet.push(arr[i][1])
			}else if(mynum[arr[i][2]].num==mynum[arr[i][3]].num){
				mynum[arr[i][0]].posY=pos[0];
				mynum[arr[i][1]].posY=pos[1];
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][2]].posY=pos[2];
				delet.push(arr[i][3])
			}
		}
	}
	delet.sort(function(a,b){return a-b})
	for(i in delet){
		mynum.splice(delet[i],1);
	}
}
//横向移动
function xMove(pos){//pos为数组[1,2,3,4]或 [4,3,2,1]
	var order=''
	if(pos==[1,2,3,4]){
		order='small';
	}else{
		order='big';
	}
	mynum.sort(rank('posX',order)).sort(rank('posY','small'))
	console.log(mynum)
	arr=[[],[],[],[]];
	for(i in mynum){
		for(var j=0;j<4;j++){
			if(mynum[i].posY==j+1)arr[j].push(i);
		}
	}
	for(i in arr){
		console.log(arr[i])
		if(arr[i].length==1){
			mynum[arr[i][0]].posX=pos[0];
		}else if(arr[i].length==2){
			if(mynum[arr[i][0]].num==mynum[arr[i][1]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][0]].posX=pos[0];
				delet.push(arr[i][1])
			}else{
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][1]].posX=pos[1];
			}
		}else if(arr[i].length==3){
			if(mynum[arr[i][0]].num==mynum[arr[i][1]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][2]].posX=pos[1];
				delet.push(arr[i][1])
			}else if(mynum[arr[i][1]].num==mynum[arr[i][2]].num){
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][2]].posX=pos[1];
				delet.push(arr[i][1])
			}else{
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][1]].posX=pos[1];
				mynum[arr[i][2]].posX=pos[2];
			}
		}else if(arr[i].length==4){
			if(mynum[arr[i][0]].num==mynum[arr[i][1]].num&&mynum[arr[i][2]].num==mynum[arr[i][3]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][2]].posX=pos[1];
				delet.push(arr[i][1])
				delet.push(arr[i][3])
			}else if(mynum[arr[i][0]].num==mynum[arr[i][1]].num){
				mynum[arr[i][0]].num=mynum[arr[i][0]].num*2;
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][2]].posX=pos[1];
				mynum[arr[i][3]].posX=pos[2];
				delet.push(arr[i][1])
			}else if(mynum[arr[i][1]].num==mynum[arr[i][2]].num){
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][2]].posX=pos[1];
				mynum[arr[i][3]].posX=pos[2];
				delet.push(arr[i][1])
			}else if(mynum[arr[i][2]].num==mynum[arr[i][3]].num){
				mynum[arr[i][0]].posX=pos[0];
				mynum[arr[i][1]].posX=pos[1];
				mynum[arr[i][2]].num=mynum[arr[i][2]].num*2;
				mynum[arr[i][2]].posX=pos[2];
				delet.push(arr[i][3])
			}
		}
	}
	delet.sort(function(a,b){return a-b})
	for(i in delet){
		mynum.splice(delet[i],1);
	}
}
//排序函数
function rank(name,order){//posX||posY
	return function(s,t){
		var a,b;
		if(name=='posX'){
			a=s.posX;
			b=t.posX;
		}else if(name=='posY'){
			a=s.posY;
			b=t.posY;
		}
		if(order=='small'){
			if(a<b)return -1;
			if(a>b)return 1;
		}else if(order=='big'){
			if(a<b)return 1;
			if(a>b)return -1;
		}
		return 0
	}
}
var mynum=[];
var start=end=null;
function startGame(){
	for(var i=0;i<2;i++){
		mynum[i]=new NumTo();
		mynum[i].init();
		mynum[i].writeIn();
		game_main.appendChild(mynum[i].odiv);
	}
	game_main.addEventListener('touchstart',mytouch,false)
}
function mytouch(event){
	start=event.touches[0];
	document.addEventListener('touchend',mytouchend,false)
	game_main.removeEventListener('touchstart',mytouch,false)
	game_main.addEventListener('touchstart',mytouch,false)
}
function mytouchend(event){
	end=event.changedTouches[0];
	if(start.clientX<end.clientX&&Math.abs(start.clientX-end.clientX)>Math.abs(start.clientY-end.clientY)){
		toMove('right');
	}else if(start.clientX>end.clientX&&Math.abs(start.clientX-end.clientX)>Math.abs(start.clientY-end.clientY)){toMove('left');}
	else if(start.clientY<end.clientY&&Math.abs(start.clientX-end.clientX)<Math.abs(start.clientY-end.clientY)){toMove('bottom');}
	else if(start.clientY>end.clientY&&Math.abs(start.clientX-end.clientX)<Math.abs(start.clientY-end.clientY)){toMove('top');}	
	mynum.push(new NumTo());
	mynum[mynum.length-1].init();
	game_main.innerHTML='';
	for(i in mynum){
		mynum[i].writeIn();	
	}
	document.removeEventListener('touchend',mytouchend,false)
}