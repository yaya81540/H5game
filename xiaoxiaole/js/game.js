var clientHeight=document.documentElement.clientHeight;
document.getElementById('wrap').style.height=clientHeight+'px';
var stage;
var imgList={};
var time,tempreture,control,result,share,record;
var imgData = [
    {name:"bg",path:"images/game/bg.png"},//游戏背景
    {name:"pumpkin1",path:"images/game/acc1.png"},
    {name:"pumpkin2",path:"images/game/acc2.png"},
    {name:"pumpkin3",path:"images/game/acc3.png"},
    {name:"pumpkin4",path:"images/game/acc4.png"},
    {name:"pumpkin5",path:"images/game/acc5.png"},
    {name:"pumpkin6",path:"images/game/acc6.png"},
    {name:"time",path:"images/game/time.png"},
    {name:"good",path:"images/game/good.png"},
    {name:"pause",path:"images/game/pause.png"},
    {name:"start",path:"images/game/start.png"},
    {name:"red",path:"images/game/red.png"},
    {name:"green",path:"images/game/green.png"},
    {name:"tip",path:"images/game/tip.png"},
    {name:"lose",path:"images/game/lose.png"},
    {name:"toprize",path:"images/game/toprize.png"},
    {name:"tointroduce",path:"images/game/tointroduce.png"},
    {name:"success",path:"images/game/success.png"},
    {name:"again",path:"images/game/again.png"},
    // {name:"share",path:"http://m.lrlz.com/h5/activity/fcjactivity/images/wx_share.png"},
    
];
function main(){
	//全屏操作
    LGlobal.align = LStageAlign.TOP_MIDDLE;
    LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
    LSystem.screen(LStage.FULL_SCREEN);
    
	//添加舞台
	stage = new LSprite();
    addChild(stage);
	//加载图片
    LLoadManage.load(
        imgData,
        function(progress){
        },
        imgInit
    ); 
    
    
}
//游戏分数
var gameData = {};
function resetgameData(){
    gameData.hot = 100;
    gameData.time = 30;
}
//背景图片加载
function imgInit(result){
	imgList=result;
    var bitmap = new LBitmap(new LBitmapData(imgList["bg"]));  
    stage.addChild(bitmap); 
    
    gameInit()
}
function gameInit(){
	resetgameData()
	//添加游戏区域
	gameLayer = new LSprite();
    gameLayer.x = 90;
    gameLayer.y = 330;
    gameLayer.graphics.drawRect(0,"#000",[0,0,575,640]);
    stage.addChild(gameLayer);
    
    
//	倒计时
    time=new Timeboard(imgList);
    time.count()
//  热度计
    tempreture=new Thermometer();
//  控制按钮
    control=new Control();
    control.btn.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
		control.btn.removeChild(control.btnimg)
		if(control.btndata=="start"){
			control.btndata="pause"
			time.count()
		}else{
			control.btndata="start"
			time.pause()
		}
		control.btnimg=new LBitmap(new LBitmapData(imgList[control.btndata]));
		control.btn.addChild(control.btnimg)
	})
    pumpkin.rang();
    record=new Record();
}
var pumpkin = {
    pArr:[],
    startPos:[],
    endPos:[],
    isMove:false,
    moveT:0.2,
    fallT:0.1,
    candyNum:2,
    isMoveCheck:true,
    disapearColArr:[],
    disapearRowArr:[],
    rang:function(){//排列南瓜
        var self = this;
        for(var i=0;i<5;i++){
            self.pArr[i] = [];
            for(var j=0;j<4;j++){
                self.pArr[i][j] = new Pumpkin(i,j,false);
                self.pArr[i][j].x = 115*i;
                self.pArr[i][j].y = 480-160*j;
            }
        }
        if(!self.checkCanMove()){
        	for(var i=0;i<5;i++){
    			for(var j=0;j<4;j++){
    				gameLayer.removeChild(self.pArr[i][j])
    			}
    		}
        	self.pArr=[]
        	self.rang();
        }
    },
    setMove:function(start,end){//设置第一步移动
        var self = this;
        var sP = self.pArr[start[0]][start[1]];
        var eP = self.pArr[end[0]][end[1]];
        var sx = sP.x;
        var sy = sP.y;
        var ex = eP.x;
        var ey = eP.y;
        if(start[0] == end[0]){//列相同
            if(start[1] >= end[1]+1){//向上
                console.log("up");
                self.isMove = true;
            }else if(start[1] <= end[1]-1){//向下
                console.log("down");
                self.isMove = true;
            }
        }
        if(start[1] == end[1]){//行相同
            if(start[0] >= end[0]+1){//向左
                console.log("left");
                self.isMove = true;
            }else if(start[0] <= end[0]-1){//向右
                console.log("right");
                self.isMove = true;
            }
        }
        if(self.isMove){
            LTweenLite.to(sP,self.moveT,{x:ex,y:ey,ease:LEasing.None.easeIn});
            LTweenLite.to(eP,self.moveT,{x:sx,y:sy,ease:LEasing.None.easeIn,onComplete:function(){
                var s_col = sP.col,s_row = sP.row;
                var e_col = eP.col,e_row = eP.row;
                pumpkin.pArr[start[0]][start[1]] = eP;
                pumpkin.pArr[start[0]][start[1]].col = s_col;
                pumpkin.pArr[start[0]][start[1]].row = s_row;
                pumpkin.pArr[end[0]][end[1]] = sP;
                pumpkin.pArr[end[0]][end[1]].col = e_col;
                pumpkin.pArr[end[0]][end[1]].row = e_row;

                self.isMoveCheck = true;
                self.checkDis();
            }});
        }
    },
    setBack:function(start,end){//设置移动返回
        var self = this;
        var sP = self.pArr[start[0]][start[1]];
        var eP = self.pArr[end[0]][end[1]];
        var sx = sP.x;
        var sy = sP.y;
        var ex = eP.x;
        var ey = eP.y;
        LTweenLite.to(sP,self.moveT,{x:ex,y:ey,ease:LEasing.None.easeIn});
        LTweenLite.to(eP,self.moveT,{x:sx,y:sy,ease:LEasing.None.easeIn,onComplete:function(){
            self.isMove = false;
            var s_col = sP.col,s_row = sP.row;
            var e_col = eP.col,e_row = eP.row;
            pumpkin.pArr[start[0]][start[1]] = eP;
            pumpkin.pArr[start[0]][start[1]].col = s_col;
            pumpkin.pArr[start[0]][start[1]].row = s_row;
            pumpkin.pArr[end[0]][end[1]] = sP;
            pumpkin.pArr[end[0]][end[1]].col = e_col;
            pumpkin.pArr[end[0]][end[1]].row = e_row;
        }});
    },
    checkDis2:function(pos){//判断有无南瓜可以消除
        var self = this;
        var type = self.pArr[pos[0]][pos[1]].type;
        self.disapearColArr = [];
        self.disapearColArr.push(self.pArr[pos[0]][pos[1]]);
        for(var l=1;l<5;l++){//判断左边个数
            if(self.isExis(pos[0]-l,pos[1]) && self.pArr[pos[0]-l][pos[1]].type == type){
                self.disapearColArr.push(self.pArr[pos[0]-l][pos[1]]);
            }else{
                break;
            }
        }
        for(var r=1;r<5;r++){//判断右边个数
            if(self.isExis(pos[0]+r,pos[1]) && self.pArr[pos[0]+r][pos[1]].type == type){
                self.disapearColArr.push(self.pArr[pos[0]+r][pos[1]]);
            }else{
                break;
            }
        }
        self.disapearRowArr = [];
        for(var t=1;t<5;t++){//判断上边个数
            if(self.isExis(pos[0],pos[1]-t) && self.pArr[pos[0]][pos[1]-t].type == type){
                self.disapearRowArr.push(self.pArr[pos[0]][pos[1]-t]);
            }else{
                break;
            }
        }
        for(var d=1;d<5;d++){//判断下边个数
            if(self.isExis(pos[0],pos[1]+d) && self.pArr[pos[0]][pos[1]+d].type == type){
                self.disapearRowArr.push(self.pArr[pos[0]][pos[1]+d]);
            }else{
                break;
            }
        }
        self.setDisapear();
    },
    checkCanMove:function(){
    	var self = this;
        for(var i=0;i<5;i++){
        	for(var j=0;j<4;j++){
        		var type = self.pArr[i][j].type;
        		if(self.isExis(i+1,j+1)){
        			if(self.pArr[i+1][j+1].type==type){
        				if(self.isExis(i+1,j-1))if(self.pArr[i+1][j-1].type==type)return true
	        			if(self.isExis(i,j-1))if(self.pArr[i][j-1].type==type)return true
	        			if(self.isExis(i-1,j))if(self.pArr[i-1][j].type==type)return true
	        			if(self.isExis(i-1,j+1))if(self.pArr[i-1][j+1].type==type)return true
	        			if(self.isExis(i,j+2))if(self.pArr[i][j+2].type==type)return true
	        			if(self.isExis(i+1,j+2))if(self.pArr[i+1][j+2].type==type)return true
	        			if(self.isExis(i+2,j))if(self.pArr[i+2][j].type==type)return true
	        			if(self.isExis(i+2,j+1))if(self.pArr[i+2][j+1].type==type)return true	
        			}	
        		}
        		if(self.isExis(i+1,j-1)){
        			if(self.pArr[i+1][j-1].type==type){
        				if(self.isExis(i+1,j+1))if(self.pArr[i+1][j+1].type==type)return true
	        			if(self.isExis(i,j+1))if(self.pArr[i][j+1].type==type)return true
	        			if(self.isExis(i-1,j))if(self.pArr[i-1][j].type==type)return true
	        			if(self.isExis(i-1,j-1))if(self.pArr[i-1][j-1].type==type)return true
	        			if(self.isExis(i,j-2))if(self.pArr[i][j-2].type==type)return true
	        			if(self.isExis(i+1,j-2))if(self.pArr[i+1][j-2].type==type)return true
	        			if(self.isExis(i+2,j))if(self.pArr[i+2][j].type==type)return true
	        			if(self.isExis(i+2,j-1))if(self.pArr[i+2][j-1].type==type)return true
        			}
        				
        		}
        	}
        }
        return false
    },
    checkDis:function(){
        var self = this;
        self.disapearColArr = [];
        self.disapearRowArr = [];
        //检查列
        for(var i=0;i<5;i++){
            self.disapearColArr[i] = [];
            var index = 0;
            self.disapearColArr[i][index] = [];
            var type = self.pArr[i][0].type;
            self.disapearColArr[i][index].push(self.pArr[i][0]);
            for(var j=1;j<4;j++){
                if(type == self.pArr[i][j].type){
                    if(j==3 && self.disapearColArr[i][index].length < 2){
                        self.disapearColArr[i][index] = [];
                    }else{
                        self.disapearColArr[i][index].push(self.pArr[i][j]);
                    }
                }else{
                    if(self.disapearColArr[i][index].length >= 3){
                        if(j != 3){
                            index++;
                            self.disapearColArr[i][index] = [];
                            self.disapearColArr[i][index].push(self.pArr[i][j]);
                        }
                    }else{
                        if(j==3){
                            self.disapearColArr[i][index] = [];
                        }else{
                            self.disapearColArr[i][index] = [];
                            self.disapearColArr[i][index].push(self.pArr[i][j]);
                            type = self.pArr[i][j].type;
                        }
                    }
                }
            }
        }
        //检查行
        for(var k=0;k<4;k++){
            self.disapearRowArr[k] = [];
            var rowindex = 0;
            self.disapearRowArr[k][rowindex] = [];
            var rowtype = self.pArr[0][k].type;
            self.disapearRowArr[k][rowindex].push(self.pArr[0][k]);
            for(var h=1;h<5;h++){
                if(rowtype == self.pArr[h][k].type){
                    if(h==4 && self.disapearRowArr[k][rowindex].length < 2){
                        self.disapearRowArr[k][rowindex] = [];
                    }else{
                        self.disapearRowArr[k][rowindex].push(self.pArr[h][k]);
                    }
                }else{
                    if(self.disapearRowArr[k][rowindex].length >= 3){
                        if(h != 4){
                            rowindex++;
                            self.disapearRowArr[k][rowindex] = [];
                            self.disapearRowArr[k][rowindex].push(self.pArr[h][k]);
                        }
                    }else{
                        if(h == 4){
                            self.disapearRowArr[k][rowindex] = [];
                        }else{
                            self.disapearRowArr[k][rowindex] = [];
                            self.disapearRowArr[k][rowindex].push(self.pArr[h][k]);
                            rowtype = self.pArr[h][k].type;
                        }
                    }
                }
            }
        }
        self.setDisapear2();
    },
    isExis:function(row,col){//当前格是否存在
        if(col < 0 || row < 0 || col > 3 || row > 4){
            return false;
        }
        return true;
    },
    setDisapear:function(){
        var self = this;
        var colLen = self.disapearColArr.length;
        var isback = true;
        console.log(colLen);
        if(colLen>=3){
            isback = false;
            for(var a=0;a<colLen;a++){
                gameLayer.removeChild(self.disapearColArr[a]);
            }
        }
        var rowLen = self.disapearRowArr.length;
        if(rowLen>=2){
            gameLayer.removeChild(self.disapearColArr[0]);
            for(var b=0;b<rowLen;b++){
                gameLayer.removeChild(self.disapearRowArr[b]);
            }
            isback = false;
        }

        if(isback){
            self.setBack(self.endPos,self.startPos);
        }
    },
    setDisapear2:function(isMoveCheck){
        var self = this;
        var isclear = false;
        var colnum = 0,rownum = 0;
        var item=null
        for(var i=0;i<self.disapearColArr.length;i++){
            for(var j=0;j<self.disapearColArr[i].length;j++){
                for(var h=0;h<self.disapearColArr[i][j].length;h++){
                    item = pumpkin.pArr[self.disapearColArr[i][j][h].col][self.disapearColArr[i][j][h].row];
                    pumpkin.pArr[self.disapearColArr[i][j][h].col][self.disapearColArr[i][j][h].row] = null;
                    gameLayer.removeChild(self.disapearColArr[i][j][h]);
                    self.disapearColArr[i][j][h].addframe();
                    isclear = true;
                    colnum++;
                }
            }
            if(item){
                var boom = new Boom(item.x,item.y+160,Math.floor((colnum+rownum)/3));
                record.change(item.type)
                item=null;
            }
        }
        for(var k=0;k<self.disapearRowArr.length;k++){
            for(var l=0;l<self.disapearRowArr[k].length;l++){
                for(var m=0;m<self.disapearRowArr[k][l].length;m++){
                    if(pumpkin.pArr[self.disapearRowArr[k][l][m].col][self.disapearRowArr[k][l][m].row]) {
                        item = pumpkin.pArr[self.disapearRowArr[k][l][m].col][self.disapearRowArr[k][l][m].row];
                        pumpkin.pArr[self.disapearRowArr[k][l][m].col][self.disapearRowArr[k][l][m].row] = null;
                        gameLayer.removeChild(self.disapearRowArr[k][l][m]);
                        isclear = true;
                        rownum++;
                    }
                }
            }
            if(item){
                var boom = new Boom(item.x-115,item.y,Math.floor((colnum+rownum)/3));	
                record.change(item.type)
                item=null;
            }
        }
        if(!isclear){
            if(self.isMoveCheck){//是否是移动完后的第一次检查
                self.setBack(self.endPos,self.startPos);
            }else{
                self.isMove = false;
                if(!self.checkCanMove()){
	            	for(var i=0;i<5;i++){
	        			for(var j=0;j<4;j++){
	        				gameLayer.removeChild(self.pArr[i][j])
	        			}
	        		}
	            	self.pArr=[]
	            	self.rang();
	            }
            }
        }else{
            setTimeout(function(){
                self.addNewItem();
            },200)
        }
    },
    addNewItem:function(){
        var self = this;
        for(var i=0;i<5;i++){
            var misCount = 0;
            for(var j=0;j<pumpkin.pArr[i].length;j++){
                var _pumpkin = pumpkin.pArr[i][j];
                if(!_pumpkin){
                    pumpkin.pArr[i][4+misCount] = new Pumpkin(i,4+misCount,true);
                    pumpkin.pArr[i][4+misCount].x = i*115;
                    pumpkin.pArr[i][4+misCount].y = 480-160*(4+misCount);
                    misCount++;
                }else{
                    var fallLen = misCount;
                    if(fallLen) {
                        var t = self.fallT * misCount;
                        _pumpkin.row -= misCount;
                        pumpkin.pArr[i][j] = null;
                        pumpkin.pArr[i][_pumpkin.row] = _pumpkin;
                        LTweenLite.to(_pumpkin, t, {y: 480-_pumpkin.row * 160, ease: LEasing.None.easeIn});
                    }
                }
            }

            for(var k=self.pArr[i].length;k>=4;k--){
                self.pArr[i].splice(k,1);
            }
        }
        setTimeout(function(){
            self.isMoveCheck = false;
            tempreture.change();
            self.checkDis();
            
        },t*1000);
    },
};


//元素居中
function setCenter(){
    return (LGlobal.width-this.getWidth())/2;
}
$('#mask').click(function(){
	console.log('哈喽')
	$('#mask').hide()
	init(50,'gamebox',750,1206,main)
})


//获取游戏结果
function getResult(score){
	toResult(score,2,111,0)
}
function toResult(score,award,act_id,firstAward){
	result=new LSprite();
	stage.addChild(result);
	
	var resultbg=new LBitmap(new LBitmapData('rgba(0,0,0,0.3)',0,0,750,1206))
	result.addChild(resultbg);
	var resultimg=null;
	if(score<=0){
		resultimg=new LBitmap(new LBitmapData(imgList['success']))
		resultimg.x=65;
		resultimg.y=245;
		result.addChild(resultimg);
		var tochoujiang=new LBitmap(new LBitmapData(imgList['toprize']))
		tochoujiang.x=140;
		tochoujiang.y=650;
		result.addChild(tochoujiang);
		result.addEventListener(LMouseEvent.MOUSE_DOWN,function(e){
			if(e.selfX>140&&e.selfY>650&&e.selfX<600&&e.selfY<830){
				
			}
		})
	}else{
		resultimg=new LBitmap(new LBitmapData(imgList['lose']))
		resultimg.x=60;
		resultimg.y=115;
		result.addChild(resultimg);
		var again=new LBitmap(new LBitmapData(imgList['again']))
		again.x=150;
		again.y=530;
		result.addChild(again);
		var introduce=new LBitmap(new LBitmapData(imgList['tointroduce']))
		introduce.x=140;
		introduce.y=680;
		result.addChild(introduce);
		result.addEventListener(LMouseEvent.MOUSE_DOWN,function(e){
			console.log(e.selfX+','+e.selfY)
			if(e.selfX>150&&e.selfY>530&&e.selfX<570&&e.selfY<640){
				sharepage()
			}
			if(e.selfX>140&&e.selfY>680&&e.selfX<580&&e.selfY<790){
				window.location.href='introduce.html'
			}
		})
	}
}
function sharepage(){
	share=new LSprite();
	stage.addChild(share);
	
	var sharebg=new LBitmap(new LBitmapData('rgba(0,0,0,0.3)',0,0,750,1206))
	share.addChild(sharebg);
	
	var shareimg=new LBitmap(new LBitmapData(imgList['share']))
	shareimg.x=100
	share.addChild(shareimg)
	share.addEventListener(LMouseEvent.MOUSE_DOWN,function(e){
		stage.removeChild(share);
	})
}

