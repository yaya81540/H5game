var clientHeight=document.documentElement.clientHeight;
document.getElementById('gamebox').style.height=clientHeight+'px';
if(clientHeight<document.getElementById('game').offsetHeight){
	document.getElementById('game').style.height=clientHeight+'px';
}
function debounce(a,c){var b=0;return function(){var d=+new Date();if(d-b>c){a.apply(this,arguments);b=d}}};
/*
* 自定义tip提示 2秒自动关闭
* @param str {str}   传入的提示信息
*/	
function showMsg(str,delay){var alert_msg=document.getElementById("alert_msg");var delay=delay?delay:2000;if(!alert_msg){return}alert_msg.addEventListener("click",function(e){alert_msg.className="";alert_msg.innerHTML="";alert_msg.setAttribute("data-state","false");e.stopPropagation()});if(alert_msg.getAttribute("data-state")=="false"){alert_msg.setAttribute("data-state","true");alert_msg.innerHTML=str;alert_msg.className="alert_msg_show";setTimeout(function(){alert_msg.className="";alert_msg.innerHTML="";alert_msg.setAttribute("data-state","false")},delay)}}

var clientWidth=document.documentElement.clientWidth
//获得化肥皂盒
var soapBox=document.getElementById('soapBox');
//获得开始页
var start=document.getElementById('start');
//获得主页面
var main=document.getElementById('main');
//获取结束页
var result=document.getElementById('result');
//获取失败页
var lose=document.getElementById('lose');
//获取分数和时间
var timer=document.getElementById('timer'),
	score=document.getElementById('score')

//设置初始分数和时间
var scoreNum=0,mytime=30;
//类名处理
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
//掉落部件
function Wpdl(num){
	this.odiv=document.createElement("div");
	this.left=Math.random()*(clientWidth-50);
	this.top=0;
	this.num=num;
	this.v=Math.random()*2+3;
	this.death=false;
	this.init();
}
Wpdl.prototype.init=function(){
	var arr=['soap','bomb','carbon']
	this.odiv.className=arr[this.num];
	this.odiv.style.left=this.left+'px';
	this.odiv.style.top=this.top;
	if(this.num==1){
		if(Math.random()>0.5)this.odiv.style.transform='rotateY(180deg)';
	}else{
		this.odiv.style.transform='rotate('+Math.random()*360+'deg)';
	}	
	main.appendChild(this.odiv);
}
Wpdl.prototype.move=function(){
	this.top=this.top+this.v;
	this.odiv.style.top=this.top+'px';
}
Wpdl.prototype.judge=function(){
	if(this.death==false&&this.top>soapBox.offsetTop-60&&this.top<soapBox.offsetTop){
		if((soapBox.offsetLeft-this.left>0&&soapBox.offsetLeft-this.left<50)||(soapBox.offsetLeft-this.left<0&&this.left-soapBox.offsetLeft<100)){
			if(this.num==0){
				scoreNum=scoreNum+10;
			}else if(this.num==1){
				scoreNum=scoreNum-10;
			}else{
				scoreNum=scoreNum-5;
			}
			score.innerHTML=scoreNum;
			this.death=true
			this.odiv.remove();
		}
	}
}
//	刮开爱的抱抱
function getlose(){
	setTimeout(function(){
		result.style.display='none';
		lose.style.display='block';
		var i=0;
		$('.sharechat').show();
		var losetimer=setInterval(function(){
			var losechild=lose.children;
			if(i<losechild.length){
				losechild[i].className=losechild[i].className+' fadeInAnimated';
				i++
			}else{
				clearInterval(losetimer);
			}
		},900);
	},200)
}

//获取结果
function getResult(scoreNum){
	var price='',picurl='',btnstr='',share='';
	var haveprize='<p>(至安露莎天猫旗舰店使用)</p>';
	if(scoreNum<80){
		picurl='againchat';
		price='<span class="price" style="width:1.36rem;margin-left: -0.4rem;" onclick="getlose()" id="tolose"><img src="images/game/mark.png"></span>';
		btnstr='<div class="result_btn"><span style="width:2.54rem;margin-top:1.1rem;" onclick="getlose()"><img src="images/game/open.png"><span></div>'
		haveprize='';
	}else{
		var mylink='form.html';
		var resultType=0
		if(scoreNum<120){
			picurl='80chat';
			price='<span class="price">80元优惠券</span>'
			resultType=80;
			mylink='result.html';
			haveprize='';
		}else if(scoreNum<150){
			picurl='100chat';
			price='<span class="price">100元优惠券</span>'
			resultType=100;
		}else{
			picurl='150chat';
			price='<span class="price">150元优惠券</span>'
			resultType=150;
		}
		share='<div class="share"><img src="images/game/share.png"/></div>';
		btnstr='<p>游戏奖励仅限领取1次，熟能生巧挑战更高分吧！</p><div class="result_btn"><span class="toShare" id="toShare" again="'+status+'"><img src="images/game/again.png"/></span><span><a href="javascript:;"><img src="images/game/price.png"/></a></span></div>'
	}
	document.getElementById('result').innerHTML='<div id="myscore"><img src="images/game/'+picurl+'.png" class="chat"/><span class="myscore">'+scoreNum+'</span>'+price+haveprize+'</div>'+btnstr+share
	var tolose=document.getElementById('tolose');
	var mylose=false;
	if(tolose)tolose.addEventListener('touchmove',function(){if(!mylose){getlose(isFirst);mylose=true;}},false);
	$('.toShare').click(debounce(function(){
		startgame();
	},320))
	
}
//	创建掉落对象
var dlwp=[];
var mark=0;
//开始游戏
function begin(){
	mark++
	if(mark==30){
		var num=0
		var arr=[1,2]
		var rand=Math.random()*4;
		if(scoreNum>80){rand=Math.random()*6;arr=[1,3];}
		if(rand>arr[0])num=1;
		if(rand>arr[1])num=2;
		dlwp.push(new Wpdl(num));
		mark=0;
	}
	for(var i=0;i<dlwp.length;i++){
		dlwp[i].move();
		dlwp[i].judge();
		if(dlwp[i].top>600){
			dlwp[i].odiv.remove();
			dlwp.splice(i,1);
		}
	}
}
function startgame(){
	start.style.display='none';
	lose.style.display='none';
	result.style.display='none';
	main.style.display='block';
	scoreNum=0,mytime=30
	score.innerHTML=scoreNum;
	//为肥皂盒添加移动
	main.addEventListener("touchmove",function(event){
		var oevent=event.touches[0];
	    var selfplanX=oevent.clientX;
	    var selfplanY=oevent.clientY;
	    if(oevent.clientX<soapBox.offsetWidth/2){
	    	selfplanX=soapBox.offsetWidth/2
	    }else if(oevent.clientX>clientWidth-soapBox.offsetWidth/2){
	    	selfplanX=clientWidth-soapBox.offsetWidth/2
	    }
	    if(oevent.clientY<soapBox.offsetHeight/2){
	    	selfplanY=soapBox.offsetHeight/2
	    }else if(oevent.clientY>clientHeight-soapBox.offsetHeight/2){
	    	selfplanY=clientHeight-soapBox.offsetHeight/2
	    }
	    soapBox.style.left=selfplanX-soapBox.offsetWidth/2+"px";
	    soapBox.style.top=selfplanY-soapBox.offsetHeight/2+"px";
	    event.stopPropagation(); 
	    event.preventDefault();
	},true);
	var djsTimer=setInterval(function(){
		if(mytime<=0){
			clearInterval(djsTimer);
			clearInterval(setTimer);
			getResult(scoreNum)
			setTimeout(function(){
				main.style.display='none';
				result.style.display='block';
			},300)
			for(var i=0;i<dlwp.length;i++){
				dlwp[i].odiv.remove();
			}
			dlwp=[];
			return
		}
		mytime--
		timer.innerHTML=mytime
	},1000)
	var setTimer=setInterval(begin,10)
}
window.onload=function(){
	$('#start').click(startgame)
}