var stage;

var loadinglist = {};
var loadingData = new Array(
    {name:"L_bg",path:userData.loading_page},//加载背景
    {name:"L_icons",path:imgsrc+"images/loadingicons.png"},//加载显示条(非替换)
    {name:"L_logo",path:userData.logo}//加载页面logo
);

var imglist = {};
var imgData = new Array(
    {name:"share",path:imgsrc+"images/yindao2.png"},
    {name:"ad",path:userData.game_ad},//广告图片
    {name:"bg",path:userData.gameBackground},//游戏背景
    {name:"startbt",path:userData.startButton},//开始按钮

    {name:"grid",path:imgsrc+"images/grid.jpg"},
    {name:"boom",path:imgsrc+"images/boom.png"},

    {name:"hit",path:imgsrc+"images/dog2.png"},
    {name:"pumpkin1",path:userData.daoju1},
    {name:"pumpkin2",path:userData.daoju2},
    {name:"pumpkin3",path:userData.daoju3},
    {name:"pumpkin4",path:userData.daoju4},
    {name:"pumpkin5",path:userData.daoju5},
    {name:"pumpkin6",path:userData.daoju6},
    // {name:"pumpkin7",path:userData.daoju7},
    {name:"tool1",path:userData.daoju7},
    // {name:"pumpkin7",path:imgsrc+"./images/candy.png"},

    {name:"title",path:userData.start_logo},//开始游戏页面标题logo
    {name:"frame",path:userData.endBackground},//结束弹窗
    {name:"endbt1",path:userData.againButton},//再来一次按钮
    {name:"endbt2",path:userData.shareButton},//分享按钮
    {name:"endbt3",path:userData.userButton},//自定义按钮
    {name:"s_clear",path:"css/clear.mp3",type:"sound"},
    {name:"s_over",path:"css/over.wav",type:"sound"}
);

var gameData = {};
function resetgameData(){
    gameData.point = 0;
    gameData.time = 180;
}

function main(){
    LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN,true);
    LMouseEventContainer.set(LMouseEvent.MOUSE_UP,true);
    //全屏操作
    LGlobal.align = LStageAlign.TOP_MIDDLE;
    LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
    LSystem.screen(LStage.FULL_SCREEN);

    //添加舞台
    stage = new LSprite();
    addChild(stage);
    //addChild(new FPS());
    //添加加载层
    LLoadManage.load(
        loadingData,
        function(progress){

        },
        function(result){
            loadinglist = result;
            loading_gameData();
        }
    );
}

function loading_gameData(){
    //添加加载层
    var loadinglayer = new LoadingDoufen();
    stage.addChild(loadinglayer);
    LLoadManage.load(
        imgData,
        function(progress){
            loadinglayer.setProgress(progress);
        },
        function(result){
            imglist = result;
            stage.removeChild(loadinglayer);
            loadinglayer = null;
            stage.addChild(new Background());
            resetgameData();
            startInit();
            s_clear = new LSound();
            s_clear.load(imglist["s_clear"]);
            s_over = new LSound();
            s_over.load(imglist["s_over"]);
        }
    );
}

function startInit(){
    startLayer = new LSprite();
    startLayer.graphics.drawRect(0,"#000",[0,0,640,960],true,"rgba(0,0,0,0.5)");
    stage.addChild(startLayer);

    var title = new LBitmap(new LBitmapData(imglist["title"]));
    title.x = setCenter.call(title);
    title.y = 160;
    startLayer.addChild(title);

    var txt = new LTextField();
    txt.text = startTXT;
    txt.color = start_COLOR;
    txt.size = 30;
    txt.width = 480;
    txt.font = "微软雅黑";
    txt.setWordWrap(true,40);
    txt.x = setCenter.call(txt);
    txt.y = 380;
    startLayer.addChild(txt);

    var startbt = new LButton(new LBitmap(new LBitmapData(imglist["startbt"])));
    var btw = startbt.getWidth();
    if(btw > 443){
        startbt.scaleX = 443/btw;
        startbt.scaleY = 443/btw;
    }
    startbt.x = setCenter.call(startbt);
    startbt.y = 680;
    startLayer.addChild(startbt);
    startbt.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
        setTimeout(function(){

            var transParams = {type:LTransition.Blinds ,numStrips:5,duration:1,direction:LTransition.OUT,easing:Strong.easeOut,onComplete:function(){
                stage.removeChild(startLayer);
                document.getElementById("startbg").pause();
                gameInit();
            }};
            LTransitionManager.start(startLayer,transParams);
        },500);
    });
}

function gameInit(){
    gameLayer = new LSprite();
    stage.addChild(gameLayer);

    var grid = new LBitmap(new LBitmapData(imglist["grid"]));
    grid.x = setCenter.call(grid);
    grid.y = 75;
    gameLayer.addChild(grid);

    ppkLayer = new LSprite();
    ppkLayer.x = grid.x;
    ppkLayer.y = 75;
    ppkLayer.graphics.drawRect(0,"#000",[0,0,607,693]);
    gameLayer.addChild(ppkLayer);
    ppkLayer.addEventListener(LMouseEvent.MOUSE_DOWN,function(e){
        if(!pumpkin.isMove) {
            pumpkin.startPos[0] = Math.floor(e.selfX / 87);
            pumpkin.startPos[1] = 7 - Math.floor(e.selfY / 87);
        }
        //pumpkin.pArr[pumpkin.startPos[0]][pumpkin.startPos[1]].sethit();
    });
    ppkLayer.addEventListener(LMouseEvent.MOUSE_UP,function(e){
        if(!pumpkin.isMove){
            var ec = Math.floor(e.selfX/87);
            var er = 7-Math.floor(e.selfY/87);
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
        }
    });

    pointboard = new Pointboard();

    timeboard = new Timeboard();
    timeboard.count();

    pumpkin.rang();

    var transParams = {type:LTransition.Blinds ,numStrips:8,dimension:1,duration:1,direction:LTransition.IN,easing:Strong.easeOut};
    LTransitionManager.start(gameLayer,transParams);
}
//南瓜
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
        for(var i=0;i<7;i++){
            self.pArr[i] = [];
            for(var j=0;j<8;j++){
                self.pArr[i][j] = new Pumpkin(i,j,false);
                self.pArr[i][j].x = 87*i;
                self.pArr[i][j].y = 606-87*j;
            }
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
        for(var l=1;l<7;l++){//判断左边个数
            if(self.isExis(pos[0]-l,pos[1]) && self.pArr[pos[0]-l][pos[1]].type == type){
                self.disapearColArr.push(self.pArr[pos[0]-l][pos[1]]);
            }else{
                break;
            }
        }
        for(var r=1;r<7;r++){//判断左边个数
            if(self.isExis(pos[0]+r,pos[1]) && self.pArr[pos[0]+r][pos[1]].type == type){
                self.disapearColArr.push(self.pArr[pos[0]+r][pos[1]]);
            }else{
                break;
            }
        }
        self.disapearRowArr = [];
        for(var t=1;t<7;t++){//判断上边个数
            if(self.isExis(pos[0],pos[1]-t) && self.pArr[pos[0]][pos[1]-t].type == type){
                self.disapearRowArr.push(self.pArr[pos[0]][pos[1]-t]);
            }else{
                break;
            }
        }
        for(var d=1;d<7;d++){//判断下边个数
            if(self.isExis(pos[0],pos[1]+d) && self.pArr[pos[0]][pos[1]+d].type == type){
                self.disapearRowArr.push(self.pArr[pos[0]][pos[1]+d]);
            }else{
                break;
            }
        }
        self.setDisapear();
    },
    checkDis:function(){
        var self = this;
        self.disapearColArr = [];
        self.disapearRowArr = [];
        //检查列
        for(var i=0;i<7;i++){
            self.disapearColArr[i] = [];
            var index = 0;
            self.disapearColArr[i][index] = [];
            var type = self.pArr[i][0].type;
            self.disapearColArr[i][index].push(self.pArr[i][0]);
            for(var j=1;j<8;j++){
                if(type == self.pArr[i][j].type){
                    if(j==7 && self.disapearColArr[i][index].length < 2){
                        self.disapearColArr[i][index] = [];
                    }else{
                        self.disapearColArr[i][index].push(self.pArr[i][j]);
                    }
                }else{
                    if(self.disapearColArr[i][index].length >= 3){
                        if(j != 7){
                            index++;
                            self.disapearColArr[i][index] = [];
                            self.disapearColArr[i][index].push(self.pArr[i][j]);
                        }
                    }else{
                        if(j==7){
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
        for(var k=0;k<8;k++){
            self.disapearRowArr[k] = [];
            var rowindex = 0;
            self.disapearRowArr[k][rowindex] = [];
            var rowtype = self.pArr[0][k].type;
            self.disapearRowArr[k][rowindex].push(self.pArr[0][k]);
            for(var h=1;h<7;h++){
                if(rowtype == self.pArr[h][k].type){
                    if(h==6 && self.disapearRowArr[k][rowindex].length < 2){
                        self.disapearRowArr[k][rowindex] = [];
                    }else{
                        self.disapearRowArr[k][rowindex].push(self.pArr[h][k]);
                    }
                }else{
                    if(self.disapearRowArr[k][rowindex].length >= 3){
                        if(h != 6){
                            rowindex++;
                            self.disapearRowArr[k][rowindex] = [];
                            self.disapearRowArr[k][rowindex].push(self.pArr[h][k]);
                        }
                    }else{
                        if(h == 6){
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
    isExis:function(col,row){//当前格是否存在
        if(col < 0 || row < 0 || col > 6 || row > 7){
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
                ppkLayer.removeChild(self.disapearColArr[a]);
            }
        }
        var rowLen = self.disapearRowArr.length;
        if(rowLen>=2){
            ppkLayer.removeChild(self.disapearColArr[0]);
            for(var b=0;b<rowLen;b++){
                ppkLayer.removeChild(self.disapearRowArr[b]);
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
        for(var i=0;i<self.disapearColArr.length;i++){
            for(var j=0;j<self.disapearColArr[i].length;j++){
                for(var h=0;h<self.disapearColArr[i][j].length;h++){
                    var item = pumpkin.pArr[self.disapearColArr[i][j][h].col][self.disapearColArr[i][j][h].row];
                    var boom = new Boom(item.x,item.y,parseInt(colnum+rownum)+1);
                    pumpkin.pArr[self.disapearColArr[i][j][h].col][self.disapearColArr[i][j][h].row] = null;
                    ppkLayer.removeChild(self.disapearColArr[i][j][h]);
                    self.disapearColArr[i][j][h].addframe();
                    isclear = true;
                    colnum++;
                }
            }
        }
        for(var k=0;k<self.disapearRowArr.length;k++){
            for(var l=0;l<self.disapearRowArr[k].length;l++){
                for(var m=0;m<self.disapearRowArr[k][l].length;m++){
                    if(pumpkin.pArr[self.disapearRowArr[k][l][m].col][self.disapearRowArr[k][l][m].row]) {
                        var item = pumpkin.pArr[self.disapearRowArr[k][l][m].col][self.disapearRowArr[k][l][m].row];
                        var boom = new Boom(item.x,item.y,parseInt(colnum+rownum)+1);
                        pumpkin.pArr[self.disapearRowArr[k][l][m].col][self.disapearRowArr[k][l][m].row] = null;
                        ppkLayer.removeChild(self.disapearRowArr[k][l][m]);
                        isclear = true;
                        rownum++;
                    }
                }
            }
        }
        if(!isclear){
            if(self.isMoveCheck){//是否是移动完后的第一次检查
                self.setBack(self.endPos,self.startPos);
            }else{
                self.checkCandy();
                self.isMove = false;
            }
        }else{
            s_clear.play();
            gameData.point += 5*(rownum+colnum)+(rownum+colnum-3)*5;
            pointboard.txt.text = gameData.point;
            setTimeout(function(){
                self.addNewItem();
            },200)
        }
    },
    addNewItem:function(){
        var self = this;
        for(var i=0;i<7;i++){
            var misCount = 0;
            for(var j=0;j<pumpkin.pArr[i].length;j++){
                var _pumpkin = pumpkin.pArr[i][j];
                if(!_pumpkin){
                    pumpkin.pArr[i][8+misCount] = new Pumpkin(i,8+misCount,true);
                    pumpkin.pArr[i][8+misCount].x = i*87;
                    pumpkin.pArr[i][8+misCount].y = 606-87*(8+misCount);
                    misCount++;
                }else{
                    var fallLen = misCount;
                    if(fallLen) {
                        var t = self.fallT * misCount;
                        _pumpkin.row -= misCount;
                        pumpkin.pArr[i][j] = null;
                        pumpkin.pArr[i][_pumpkin.row] = _pumpkin;
                        LTweenLite.to(_pumpkin, t, {y: 606-_pumpkin.row * 87, ease: LEasing.None.easeIn});
                    }
                }
            }

            for(var k=self.pArr[i].length;k>=8;k--){
                self.pArr[i].splice(k,1);
            }
        }
        setTimeout(function(){
            self.isMoveCheck = false;
            self.checkDis();
        },t*1000);
    },
    checkCandy:function(){
        var self = this;
        var hasTarget = false;
        for(var i=0;i<7;i++){
            if(pumpkin.pArr[i][0].type == 6){
                pumpkin.pArr[i][0].sethit();
                pumpkin.pArr[i][0] = null;
                hasTarget = true;
            }
        }
        if(hasTarget){
            self.addNewItem();
        }
    }
};

function endInit(){
    s_over.play();

    endLayer = new LSprite();
    endLayer.graphics.drawRect(0,"#000",[0,0,640,960],true,"rgba(0,0,0,0.5)");
    stage.addChild(endLayer);

    var frame = new LBitmap(new LBitmapData(imglist["frame"]));
    frame.x = (LGlobal.width - frame.getWidth())/2;
    frame.y = 70;
    endLayer.addChild(frame);

    var txt = new LTextField();
    txt.text = "我在游戏中获得"+gameData.point+"分,收集"+gameData.candy+"礼包,目前最高是"+best+"分,打败全国"+beat+"%人！"+endTXT;
    txt.color = endTXT_COLOR;
    txt.size = 30;
    txt.width = 350;
    txt.setWordWrap(true,50);
    txt.x = setCenter.call(txt);
    txt.y = 120;
    endLayer.addChild(txt);

    var btreplay = new LButton(new LBitmap(new LBitmapData(imglist["endbt1"])));
    btreplay.x = (LGlobal.width - btreplay.getWidth())/2;
    btreplay.y = 560;
    endLayer.addChild(btreplay);
    btreplay.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
        setTimeout(function(){
            stage.removeChild(endLayer);
            stage.removeChild(gameLayer);
            resetgameData();
            gameInit();
        },500);
    });

    var btshare = new LButton(new LBitmap(new LBitmapData(imglist["endbt2"])));
    btshare.x = (LGlobal.width - btshare.getWidth())/2;
    btshare.y = 680;
    endLayer.addChild(btshare);
    btshare.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
        setTimeout(function(){
            shareInit();
        },500);
    });

    var btattention = new LButton(new LBitmap(new LBitmapData(imglist["endbt3"])));
    btattention.x = (LGlobal.width - btattention.getWidth())/2;
    btattention.y = 800;
    endLayer.addChild(btattention);
    btattention.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
        setTimeout(function(){
            if(activityType == 1 || activityType == 2){
                window.location = attention_addr+'&score='+gameData.point;
            }else{
                window.location = attention_addr;
            }
        },500);
    });
}