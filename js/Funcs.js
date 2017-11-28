//加载层
var LoadingDoufen = (function(){
    function LoadingDoufen() {
        base(this,LSprite,[]);
        var s = this;

        s.bgpic = new LBitmap(new LBitmapData(loadinglist["L_bg"]));
        s.addChild(s.bgpic);

        s.logo = new LBitmap(new LBitmapData(loadinglist["L_logo"]));
        s.logo.x = (LGlobal.width - s.logo.getWidth())/2;
        s.logo.y = 350 - s.logo.getHeight()/2;
        s.addChild(s.logo);

        s.progressbg = new LBitmap(new LBitmapData(loadinglist["L_icons"],0,0,470,16));
        s.progressbg.x = (LGlobal.width - s.progressbg.getWidth())/2;
        s.progressbg.y = 650;
        s.addChild(s.progressbg);

        s.cover = new LSprite();
        s.cover.graphics.drawRect(0,"#F00",[0,0,0,16]);
        s.cover.x = s.progressbg.x;
        s.cover.y = 650;

        s.progressline = new LBitmap(new LBitmapData(loadinglist["L_icons"],0,37,470,16));
        s.progressline.x = (LGlobal.width - s.progressline.getWidth())/2;
        s.progressline.y = 650;
        s.progressline.mask = s.cover;
        s.addChild(s.progressline);

        s.snail = new LBitmap(new LBitmapData(loadinglist["L_icons"],485,0,98,55));
        s.snail.x = s.progressbg.x-38;
        s.snail.y = 650-14;
        s.addChild(s.snail);

        s.start = s.progressbg.x-38;

        var txt = new LTextField();
        txt.text = loadingTXT;
        txt.color = loading_COLOR;
        txt.size = 30;
        txt.textAlign = "center";
        txt.x = LGlobal.width/2;
        txt.y = 890;
        s.addChild(txt);
    }
    LoadingDoufen.prototype.setProgress = function(value){
        var s = this;
        s.cover.graphics.clear();
        s.cover.graphics.drawRect(0,"#F00",[0,0,470*(value/100),16]);

        s.snail.x = s.start+s.progressline.getWidth()*(value/100);
    };
    return LoadingDoufen;
})();

//分享弹层
function shareInit(){
    sharelayer = new LSprite();
    stage.addChild(sharelayer);
    sharelayer.graphics.drawRect(0,"#000",[0,0,640,960],true,"rgba(0,0,0,0.5)");

    var pic = new LBitmap(new LBitmapData(imglist["share"]));
    pic.x = 350;
    pic.y = 50;
    pic.scaleX = 0.5;
    pic.scaleY = 0.5;
    sharelayer.addChild(pic);

    sharelayer.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
        stage.removeChild(sharelayer);
    });
}

//元素居中
function setCenter(){
    return (LGlobal.width-this.getWidth())/2;
}

//背景
function Background(){
    base(this,LBitmap,[]);
    var self = this;

    var bgpic = new LBitmapData(null,0,0,640,960,LBitmapData.DATA_CANVAS);
    var bgData = new LBitmapData(imglist["bg"]);
    var adData = new LBitmapData(imglist["ad"]);
    bgpic.copyPixels(bgData,new LRectangle(0,0,640,960),new LPoint(0,0));
    bgpic.copyPixels(adData,new LRectangle(0,0,128,60),new LPoint(90,833));

    self.bitmapData = bgpic;
}

//南瓜道具
function Pumpkin(col,row,israndom){
    base(this,LBitmap,[]);
    var self = this;
    self.col = col;
    self.row = row;
    self.setType(israndom);
    self.bitmapData = new LBitmapData(imglist["pumpkin"+self.type]);
    ppkLayer.addChild(self);
}
Pumpkin.prototype.setType = function(israndom){
    var self = this;
    if(pumpkin.candyNum == 0 || pumpkin.candyNum > 2){
        self.type = Math.floor(1+Math.random()*5);
    }else{
        if(self.row == 0){
            self.type = Math.floor(1+Math.random()*5);
        }else {
            if (Math.random() > 0.9) {
                self.type = 6;
                pumpkin.candyNum--;
            } else {
                self.type = Math.floor(1 + Math.random() * 5);
            }
        }
    }

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
};
Pumpkin.prototype.addframe = function(){
    var self = this;
    LTweenLite.to(self,1,{rotate:360,ease:LEasing.None.easeIn,onComplete:function(){
        ppkLayer.removeChild(self);
    }});
};
Pumpkin.prototype.sethit = function(){
    var self = this;
    LTweenLite.to(self,1,{rotate:360,loop:true,ease:LEasing.None.easeIn}).to(self,0,{rotate:0,loop:true,ease:LEasing.None.easeIn});
    var tx = timeboard.witch.x-self.getWidth()/2;
    var ty = 780+timeboard.witch.y-self.getHeight()/2;
    LTweenLite.to(self,0.5,{x:tx,y:ty,ease:LEasing.None.easeIn,onComplete:function(){
        gameData.candy++;
        pointboard.candy.text = gameData.candy;
        pumpkin.candyNum++;
        ppkLayer.removeChild(self);
        timeboard.hitback();
    }});
};

//爆炸效果
function Boom(x,y){
    var data = new LBitmapData(imglist["boom"]);
    var list = LGlobal.divideCoordinate(595,64,1,7);
    base(this,LAnimationTimeline,[data,list]);
    var self = this;
    self.x = x+(87-85)/2+ppkLayer.x;
    self.y = y+(87-64)/2+ppkLayer.y;
    gameLayer.addChild(self);
    self.speed = 4;
    self.setLabel("end",0,6,1,false);
    self.addFrameScript("end",function(){
        gameLayer.removeChild(self);
    })
}

//计分板
function Pointboard(){
    base(this,LSprite,[]);
    var self = this;
    self.graphics.drawRect(2,"rgba(61,111,180,0.6)",[0,0,640,50],true,"rgba(61,111,180,0.5)");
    self.graphics.drawRoundRect(0,"rgba(255,255,255,0.6)",[75,13,100,30,15],true,"#430252");
    self.graphics.drawRoundRect(0,"rgba(255,255,255,0.6)",[520,13,100,30,15],true,"#430252");
    self.y = 15;
    gameLayer.addChild(self);

    var icon = new LBitmap(new LBitmapData(imglist["pumpkin1"]));
    icon.scaleX = 0.5;
    icon.scaleY = 0.5;
    icon.x = 20;
    icon.y = 2;
    self.addChild(icon);

    var icon2 = new LBitmap(new LBitmapData(imglist["pumpkin6"]));
    icon2.scaleX = 0.5;
    icon2.scaleY = 0.5;
    icon2.x = 470;
    icon2.y = 2;
    self.addChild(icon2);

    self.txt = new LTextField();
    self.txt.text = gameData.point;
    self.txt.color = "#FFF";
    self.txt.size = 20;
    self.txt.x = 90;
    self.txt.y = 18;
    self.addChild(self.txt);

    self.candy = new LTextField();
    self.candy.text = gameData.candy;
    self.candy.color = "#FFF";
    self.candy.size = 20;
    self.candy.x = 540;
    self.candy.y = 18;
    self.addChild(self.candy);
}

//计时板
function Timeboard(){
    base(this,LSprite,[]);
    var self = this;
    self.graphics.drawRect(2,"rgba(255,255,255,0.6)",[0,0,640,165],true,"rgba(255,255,255,0.5)");
    self.graphics.drawRect(0,"rgba(255,255,255,0.6)",[17,130,606,25],true,"#f9da05");
    self.graphics.drawRect(0,"rgba(255,255,255,0.6)",[17,130,0,25],true,"#ff0000");
    self.y = 780;
    gameLayer.addChild(self);

    self.maxTime = gameData.time;

    self.witch = new LSprite();
    self.witch.x = 17;
    self.addChild(self.witch);
    self.pic = new LBitmap(new LBitmapData(imglist["tool1"]));
    self.pic.x = -self.pic.getWidth()/2+40;
    self.witch.addChild(self.pic);

    self.hit = new LBitmap(new LBitmapData(imglist["hit"]));
    self.hit.visible = false;
    self.witch.addChild(self.hit);

    self.time = new LTextField();
    self.time.text = gameData.time+"s";
    self.time.x = 320;
    self.time.y = 130;
    self.time.size = 22;
    self.time.color = "#FFF";
    self.time.textAlign = "center";
    self.addChild(self.time);

    self.isCounting = true;
//
//    self.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
//        self.hitback();
//    })
}
Timeboard.prototype.count = function(){
    var self = this;
    self.t = setInterval(function(){
        if(gameData.time == 0){
            clearInterval(self.t);
            resetRank();
        }else{
            gameData.time--;
            self.time.text = gameData.time+"s";
            self.setPos();
        }
    },1000)
};
Timeboard.prototype.setPos = function(){
    var self = this;
    var add = (self.maxTime-gameData.time)/self.maxTime*606;
    self.witch.x = 17+add;
    self.graphics.clear();
    self.graphics.drawRect(2,"rgba(255,255,255,0.6)",[0,0,640,165],true,"rgba(255,255,255,0.5)");
    self.graphics.drawRect(0,"rgba(255,255,255,0.6)",[17,130,606,25],true,"#f9da05");
    self.graphics.drawRect(0,"rgba(255,255,255,0.6)",[17,130,add,25],true,"#ff0000");
};
Timeboard.prototype.hitback = function(){
    var self = this;
    gameData.time += 10;
    if(self.isCounting) {
        clearInterval(self.t);
        self.isCounting = false;
        self.hit.visible = true;
        if (gameData.time > self.maxTime)gameData.time = self.maxTime;
        LTweenLite.to(self.witch, 0.1, {x: self.witch.x - 5, ease: LEasing.None.easeIn}).to(self.witch, 0.1, {x: self.witch.x + 10, ease: LEasing.None.easeIn}).to(self.witch, 0.1, {x: self.witch.x - 5, ease: LEasing.None.easeIn, onComplete: function () {
            self.isCounting = true;
            self.hit.visible = false;
            self.setPos();
            self.count();
        }});
    }
};