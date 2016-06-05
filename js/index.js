var canvas;
var context;
var width;
var height;
var quads = [];
var displacementVec;
var stop = false;
var size = 0;
$(document).ready(function(){



	canvas = document.getElementById('canvas');
	//设置画布的宽度
  	canvas.style.width = window.innerWidth-200 + "px";

  	setTimeout(function() {
  		//设置高度
  		canvas.style.height = window.innerHeight + "px";
  	}, 0);
  	
  	//返回一个二维的画布
	context = canvas.getContext('2d');

	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	size = width >> 3;
	speed_x = 0.05;
	speed_y = 0.05;

	//位移矢量
	displacementVec = vec2d.create(speed_x, speed_y);

	generateTriangles(0,1);
	  
	loop();




	/*
	* 控制一切万能的按钮区
	*/
	var change_y_increase = 1;

	$("#button_speed").click(function(){
		speed_y += 0.1;
		speed_x += 0.1;
		alert(speed_x+";"+speed_y);
		displacementVec = vec2d.create(speed_x, speed_y);
	});

	
	$("#button_change1").click(function(){


		stop = true;
		quads = [];
		generateTriangles(1,1);
		stop = false;

	});

	$("#button_changeY").click(function(){

		displacementVec = vec2d.create(0.2, speed_y);
	

	});
	$("#button_changeX").click(function(){

		displacementVec = vec2d.create(speed_x, 0.2);
	

	});

	$("#button_change0").click(function(){

		speed_x = 0.05;
		speed_y = 0.05;
		displacementVec = vec2d.create(speed_x, speed_y);

		change_y_increase = 1 ;
		var trackBar = document.getElementById("trackBar");
		trackBar.value = 50;
		draw()

		var trackBar_speed = document.getElementById("trackBar_rotational_speed");
		trackBar_speed.value = 20;
		$(".span_rotational_speed").text(20);

		var trackBar = document.getElementById("trackBar_size");
		trackBar.value = 50;
		$(".span_size").text(50);
		size = width>>3;
		stop = true;
		quads = [];
		generateTriangles(0,change_y_increase);
		stop = false;

	});

	$("#trackBar").change(function(){
		change_y_increase =this.value * 2 / 100 ;
		draw()
	});

	$("#trackBar_rotational_speed").change(function(){
		var trackBar = document.getElementById("trackBar_rotational_speed");
		var speed_x = (1.05 - 0.00) / 100 * trackBar.value;
		var speed_y = (1.05 - 0.00) / 100 * trackBar.value;;
		$(".span_rotational_speed").text(trackBar.value);
		displacementVec = vec2d.create(speed_x, speed_y);
	});

	$("#trackBar_size").change(function(){
		var trackBar = document.getElementById("trackBar_size");
		size = (width>>2) / 100  * trackBar.value;
		stop = true;
		quads = [];
		generateTriangles(0,change_y_increase);
		stop = false;
		$(".span_size").text (trackBar.value);

	});

	var draw = function(){
		var trackBar = document.getElementById("trackBar");
		stop = true;
		quads = [];
		generateTriangles(0,change_y_increase);
		stop = false;
		$(".show_trackBar_value").text (trackBar.value);
	};
	// End
});

//生成三角形
function generateTriangles(rect, ch_y){
	//设置点的个数，必须是4的整数倍
	var length = 32 - 1;
	var i = length;
	// alert("width = "+width+"\n"+"height = "+height+"\n width / 2 = "+width /2+"\n width / 4 = "+width /4+"\n width / 8 = "+width /8);
	
	if(rect == 0){
		for(i; i > -1; --i)
		{	
			// alert(Math.sin((i / length) * (Math.PI)) );
			//Math.sin((i / length) * (Math.PI)) 是一个正弦函数，0 - 0.99 - 0, size => width/3 - width/3 * 0.XX - width/3
			var obj = quad.create((width >> 1),(i*ch_y/length)*(height >> 2)+(height >> 2), Math.sin((i / length) * (Math.PI)) *size);
			quads.push(obj);
		}
	}else if(rect == 1){
		for(i; i > -1; --i)
		{	
			// alert(Math.sin((i / length) * (Math.PI)) );
			//Math.sin((i / length) * (Math.PI)) 是一个正弦函数，0 - 0.99 - 0, size => width/3 - width/3 * 0.XX - width/3
			var obj = quad.create((width >> 1), ch_y+(height>>1), i*size/3);
			quads.push(obj);
		}
	}
	

	quads.reverse();
}

function loop()
{

	if(stop){
		// updateTriangles();
		// renderTriangles();
		// requestAnimationFrame(loop);
		return;
	}
	updateTriangles();
	renderTriangles();

	//以适当的频率进行循环
	requestAnimationFrame(loop);
}

function updateTriangles()
{
	var i = quads.length - 1;

	for(i; i > -1; --i)
	{
		var quad = quads[i];
		quad.update();
	}
}

function renderTriangles()
{
	//线条宽度
	context.lineWidth = 1;
	//设置背景色
	context.fillStyle = '#352B4E';
	// var img = new Image();
	// img.src="xingkong.jpg";
	// context.drawImage(img,0,0,width,height);

	//设置线条色
	context.strokeStyle = '#33C1B5';
	//设置alpha值
	context.globalAlpha = 0.15;
	//设置屏幕大小的画布
	context.fillRect(0, 0, canvas.width, canvas.height);
	//设置不透明
	context.globalAlpha = 1;
	//填充圆点色
	context.fillStyle = '#FAFFD9';

	var i = quads.length - 1;
	var j;

	for(i; i > -1; --i)
	{
		var quad = quads[i];
		j = quad.getPoints().length - 1;

		for(j; j > -1; --j)
		{
			//设置两个point
			//第一个point就是当前的point
			//第二个point是当前point的下一个point
			var p1 = quad.getPoints()[j];
			var p2 = (j > 0) ? quad.getPoints()[j - 1] : quad.getPoints()[quad.getPoints().length - 1];

			//开始设置路径
			context.beginPath();
			// alert(Math.cos(p1.getAngle().getX()));
			context.moveTo(quad.getPos().getX() + Math.cos(p1.getAngle().getX()) * p1.getSize(), quad.getPos().getY() + Math.sin(p1.getAngle().getY()) * p1.getSize());
			context.lineTo(quad.getPos().getX() + Math.cos(p2.getAngle().getX()) * p2.getSize(), quad.getPos().getY() + Math.sin(p2.getAngle().getY()) * p2.getSize());
			
			//在x，y点画一个圆。半径4
			context.arc(quad.getPos().getX() + Math.cos(p1.getAngle().getX()) * p1.getSize(), quad.getPos().getY() + Math.sin(p1.getAngle().getY()) * p1.getSize(), 4, 0, Math.PI * 2);
			context.fill();
			context.stroke();
			context.closePath();
		}
	}
	
	
	
}

//vec2d definition:

var vec2d =
{
	_x: 0,
	_y: 0,

	//根据传入x，y进行构造
	create: function(x, y)
	{
		var obj = Object.create(this);
		obj.setX(x);
		obj.setY(y);

		return obj;
	},

	//获取x
	getX: function()
	{
		return this._x;
	},

	//设置x
	setX: function(value)
	{
		this._x = value;
	},

	//获取y
	getY: function()
	{
		return this._y;
	},

	//设置y
	setY: function(value)
	{
		this._y = value;
	},

	//设置xy
	setXY: function(x, y)
	{
		this._x = x;
		this._y = y;
	},

	//长度 = 根号（x*x+y*y）
	getLength: function()
	{
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},

	//传入长度，根据长度和角算出他的x轴，y周的投影长度
	setLength: function(length)
	{
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	//返回从x轴到点(x,y)的角度
	getAngle: function()
	{
		return Math.atan2(this._y, this._x);
	},

	//闯入角度，根据当前长度算出x轴，y轴的投影
	setAngle: function(angle)
	{
		var length = this.getLength();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},

	//添加x，y的长度
	add: function(vector)
	{
		this._x += vector.getX();
		this._y += vector.getY();
	},

	//减少x，y
	substract: function(vector)
	{
		this._x -= vector.getX();
		this._y -= vector.getY();
	},

	//×
	multiply: function(value)
	{
		this._x *= value;
		this._y *= value;
	},

	//÷
	divide: function(value)
	{
		this._x *= value;
		this._y *= value;
	}
};

//quad definition:

var quad =
{
	_pos: null,
	_size: null,
	_points: null,

	create: function(x, y, size)
	{
		var obj = Object.create(this);
		obj.setPos(vec2d.create(x, y));
		obj.setSize(size);
		obj.setPoints
		(
			[
				point.create(size, 0, 0),
				point.create(size, Math.PI / 2, Math.PI / 2),
				point.create(size, Math.PI, Math.PI),
				point.create(size, Math.PI * 1.5, Math.PI * 1.5)
			]
		);

		return obj;
	},

	update: function()
	{
		var i = this._points.length - 1;

		for(i; i > -1; --i)
		{
			var point = this._points[i];
			point.update();
		}
	},

	getPos: function()
	{
		return this._pos;
	},

	setPos: function(vector)
	{
		this._pos = vector;
	},

	getSize: function()
	{
		return this._size;
	},

	setSize: function(size)
	{
		this._size = size;
	},

	getPoints: function()
	{
		return this._points;
	},

	setPoints: function(points)
	{
		this._points = points;
	}
};

//point definition:

var point =
{
	_pos: null,
	_size: null,
	_angle: null,

	create: function(size, angleX, angleY)
	{
		var obj = Object.create(this);
		obj.setPos(vec2d.create(0, 0));
		obj.setSize(size);
		obj.setAngle(vec2d.create(angleX, angleY));
		// alert("size/200="+size/200);
		obj.getAngle().add(vec2d.create(size / 200, size / 200));

		return obj;
	},

	update: function()
	{
		this.getAngle().add(displacementVec);
	},

	getPos: function()
	{
		return this._pos;
	},

	setPos: function(vector)
	{
		this._pos = vector;
	},

	getSize: function()
	{
		return this._size;
	},

	setSize: function(size)
	{
		this._size = size;
	},

	getAngle: function()
	{
		return this._angle;
	},

	setAngle: function(angle)
	{
		this._angle = angle;
	},
}

	




