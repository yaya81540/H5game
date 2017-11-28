//倒计时模版
function Timeboard(imgList){
	var self = this;
	self.maxTime = gameData.time;
	self.watch=new LSprite()
	self.watch.x=30;
	self.watch.y=20;
	stage.addChild(self.watch);
	self.pic = new LBitmap(new LBitmapData(imgList["time"]));
    self.watch.addChild(self.pic);
    self.timeText=new LTextField();
    self.timeText.x=66;
    self.timeText.size=50;
    self.timeText.color='#fff';
    self.timeText.text=gameData.time;
    self.watch.addChild(self.timeText);
    self.timeSecond=new LTextField();
    self.timeSecond.x=125;
    self.timeSecond.y=20;
    self.timeSecond.size=30;
    self.timeSecond.color='#fff';
    self.timeSecond.text='s';
    self.watch.addChild(self.timeSecond);
}
Timeboard.prototype.count = function(){
	function  setZero(number) {return number < 10 ? '0' + number : number;}
    var self = this;
    self.t = setInterval(function(){
        if(gameData.time == 0||gameData.hot==0){
            clearInterval(self.t);
            self.pause();
            getResult(gameData.hot)
        }else{
            gameData.time--;
            self.timeText.text = setZero(gameData.time);
        }
    },1000)
    gameLayer.addEventListener(LMouseEvent.MOUSE_DOWN,function(e){
//  	console.log(e.selfX+','+e.selfY)
        if(!pumpkin.isMove) {
            pumpkin.startPos[0] = Math.floor(e.selfX / 115);
            pumpkin.startPos[1] = 3-Math.floor(e.selfY / 160);
        }
//      console.log(pumpkin.startPos[0]+','+pumpkin.startPos[1])
        //pumpkin.pArr[pumpkin.startPos[0]][pumpkin.startPos[1]].sethit();
    });
    gameLayer.addEventListener(LMouseEvent.MOUSE_UP,function(e){
        if(!pumpkin.isMove){
            var ec = Math.floor(e.selfX/115);
            var er = 3-Math.floor(e.selfY/160);
            //判断抬起时是否为相邻南瓜
            if(ec > pumpkin.startPos[0]){
                ec = pumpkin.startPos[0]+1;
            }
            if(ec < pumpkin.startPos[0]){
                ec = pumpkin.startPos[0]-1;
            }
            if(er > pumpkin.startPos[1]){
                er = pumpkin.startPos[1]+1;
            }
            if(er < pumpkin.startPos[1]){
                er = pumpkin.startPos[1]-1;
            }
            pumpkin.endPos[0] = ec;
            pumpkin.endPos[1] = er;
            pumpkin.setMove(pumpkin.startPos,pumpkin.endPos);
            console.log(1)
        }
    });
};
Timeboard.prototype.pause=function(){
	var self = this;
	clearInterval(self.t);
	gameLayer.removeEventListener(LMouseEvent.MOUSE_DOWN)
	gameLayer.removeEventListener(LMouseEvent.MOUSE_UP)
}
//热度计
function Thermometer(){
	var self = this;
	self.therm=new LSprite()
	self.therm.x=45;
	self.therm.y=145;
	stage.addChild(self.therm);
	
	self.green=new LBitmap(new LBitmapData(imgList["green"]));
	self.therm.addChild(self.green);
	
	self.reddata=new LBitmapData(imgList["red"])
	self.reddata.width=Math.floor((gameData.hot/100)*643)
	self.red=new LBitmap(self.reddata);
	self.therm.addChild(self.red);
	
	self.tip=new LBitmap(new LBitmapData(imgList["tip"]));
	self.tip.x=610;
	self.tip.y=-15;
	self.therm.addChild(self.tip);
	
	self.temtext=new LTextField();
    self.temtext.x=110;
    self.temtext.y=-10
    self.temtext.size=30;
    self.temtext.color='#0066ff';
    self.temtext.text='热度值';
    self.temtext.stroke=true;
    self.temtext.lineWidth = 5;
	self.temtext.lineColor = "#fff";
    self.therm.addChild(self.temtext);
    
    self.temnum=new LTextField();
    self.temnum.x=450;
    self.temnum.y=-10
    self.temnum.size=40;
    self.temnum.color='#eb6877';
    self.temnum.text=gameData.hot+'%';
    self.temnum.stroke=true;
    self.temnum.lineWidth = 8;
	self.temnum.lineColor = "#fff";
    self.therm.addChild(self.temnum);
}
Thermometer.prototype.change=function(){
	if(gameData.hot>0)gameData.hot=gameData.hot-10
	var self=this;
	self.temnum.text=gameData.hot+'%';
	self.reddata.width=Math.floor((gameData.hot/100)*643);
	console.log(gameData.hot)
}
//暂停开始按钮
function Control(){
	var self=this;
	self.btn=new LSprite()
	self.btn.x=645;
	self.btn.y=16;
	stage.addChild(self.btn);
	
	self.btndata="pause";
	self.btnimg=new LBitmap(new LBitmapData(imgList[self.btndata]));
	self.btn.addChild(self.btnimg)
}
//游戏对象
function Pumpkin(col,row,israndom){
	base(this,LBitmap,[]);
	var self=this;
	self.col = col;
    self.row = row;
    self.setType(israndom);
    self.bitmapData = new LBitmapData(imgList["pumpkin"+self.type]);
    gameLayer.addChild(self);
}
Pumpkin.prototype.setType = function(israndom){
	var self = this;
	self.type = Math.floor(1 + Math.random() * 6);
	if(!israndom){
        if(self.col-2 >=0 && self.row-2 >=0){
            while(self.type == pumpkin.pArr[self.col-2][self.row].type || self.type == pumpkin.pArr[self.col][self.row-2].type){
                self.type = Math.floor(1+Math.random()*5);
            }
        }else if(self.col-2 >=0 && self.row-2 <=0){
            while(self.type == pumpkin.pArr[self.col-2][self.row].type){
                self.type = Math.floor(1+Math.random()*5);
            }
        }else if(self.col-2 <=0 && self.row-2 >=0){
            while(self.type == pumpkin.pArr[self.col][self.row-2].type){
                self.type = Math.floor(1+Math.random()*5);
            }
        }
    }
}
Pumpkin.prototype.addframe = function(){
    var self = this;
    LTweenLite.to(self,1,{rotate:360,ease:LEasing.None.easeIn,onComplete:function(){
        gameLayer.removeChild(self);
    }});
};
Pumpkin.prototype.sethit = function(){
    var self = this;
    LTweenLite.to(self,1,{rotate:360,loop:true,ease:LEasing.None.easeIn}).to(self,0,{rotate:0,loop:true,ease:LEasing.None.easeIn});
    var tx = timeboard.witch.x-self.getWidth()/2;
    var ty = 780+timeboard.witch.y-self.getHeight()/2;
    LTweenLite.to(self,0.5,{x:tx,y:ty,ease:LEasing.None.easeIn,onComplete:function(){
        gameData.hot=gameData.hot-10;
        gameLayer.removeChild(self);
    }});
};
//爆炸效果
function Boom(x,y,num){
	var self=this
	self.boom =new LSprite()
	self.boom.x=x;
	self.boom.y=y;
	gameLayer.addChild(self.boom);
    self.boomimg =new LBitmap(new LBitmapData(imgList["good"]));
    self.boom.addChild(self.boomimg)
    self.boomnum=new LTextField();
    self.boomnum.x=250;
    self.boomnum.y=-20
    self.boomnum.size=50;
    self.boomnum.color='#0066ff';
    self.boomnum.text='+'+num;
    self.boomnum.stroke=true;
    self.boomnum.lineWidth = 8;
	self.boomnum.lineColor = "#fff";
    self.boom.addChild(self.boomnum);
    setTimeout(function(){
    	gameLayer.removeChild(self.boom);
    },500)
}
var recodNo=[0,0,0,0,0,0]
//记录类型
function Record(){
	var self=this
	self.record =new LSprite()
	self.record.y=1020;
	stage.addChild(self.record);
	self.recordnum=[]
	for(var i=0;i<recodNo.length;i++){
		self.recordnum[i]=new LTextField();
	    self.recordnum[i].x=105+i*120;
	    self.recordnum[i].size=40;
	    self.recordnum[i].color='#0066ff';
	    self.recordnum[i].text='x'+recodNo[i];
	    self.recordnum[i].stroke=true;
	    self.recordnum[i].lineWidth = 8;
		self.recordnum[i].lineColor = "#fff";
	    self.record.addChild(self.recordnum[i]);
	}
}
Record.prototype.change=function(type){
	var self=this
	recodNo[type-1]++;
	console.log(recodNo)
	self.recordnum[type-1].text='x'+recodNo[type-1]
}