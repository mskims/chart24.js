/*!
	* Chart24.js
	* Version 1.0.0 
	* Last Update 2015 November 6
	* CopyRight 2015 Kim Min Seok
*/

var chart24 = {
	jsel: null,
	sel: null,
	csel: null,
	c: null,
	data: null,
	options: {
		width: null,
		height: null,

		// Color
		borderColor: "#"+"e6e6e6",
		valueLineColor: "#"+"e02d23",
		backgroundColor: "#"+"ffffff",
		
		// Width
		borderLineWidth: 1,
		valueLineWidth: 1,

		// xAxis
		xPadding: 70,
		xAxisNumMargin: 10,
		xAxisLineOverflow: 5,

		// yAxis
		yPadding: 50,
		yAxisNum: 10,
		yAxisNumMargin: 10,
		yAxisLineOverflow: 5,

		// Data Arc
		dataArcRadius: 5,
		dataArcColor: "#"+"e02d23",
		dataArcBorderColor: "#"+"ffffff",
		dataArcBorderWidth: 3,

		max: null,
		min: null
	},
	init: function(sel, data, options){
		this.setSelector(sel);
		this.setOptions(options);
		this.setData(data);
		this.start();
	},
	existVal: function(val){
		if(typeof val === "undefined")
			return false;
		else
			return true;
	},


	// Start
	start: function(){
		this.eleClear();
		this.eleCreate();
		this.canvasDefaultSet();
		this.setCVSFunctions();

		this.getMaxValue();
		this.getMinValue();

		this.drawYAxis();
		this.drawXAxis();

		this.drawData();		
		this.drawDataArc();		
	},


	eleClear: function(){
		this.jsel.html("");
	},
	eleCreate: function(){
		$("<canvas>").attr({
			id: "chart24_"+this.sel,
			width: this.options.width,
			height: this.options.height,
		}).appendTo("#"+this.sel);
	},

	// Canvas Set
	canvasDefaultSet: function(){
		this.c = $("#"+this.csel)[0].getContext("2d");
	},
	
	// Canvas Draw
	drawXAxis: function(){
		var c = this.c;


		c.beginPath();
		c.stp(); // 0,0 으로 이동
		c.lineTo(this.getX(this.options.width), this.getY(0)+0.5);
		c.strokeStyle = this.options.borderColor;
		c.lineWidth = this.options.borderLineWidth;
		c.stroke();

		this.drawXAxisNum();
	},
	drawXAxisNum: function(){
		var c = this.c;
		c.beginPath();
		c.setFont();

		c.strokeStyle = this.options.borderColor;
		c.lineWidth = this.options.borderLineWidth;

		c.textAlign = "center";
		c.textBaseline = "hanging";

		var xPos;
		var maxXPos = this.options.width - this.options.xPadding;

		for(var i = 0; i < this.data.length ; i++){

			xPos = maxXPos/(this.data.length-1)*i;
			c.fillText(this.data[i], this.getX(xPos), this.getY(0 - this.options.xAxisNumMargin));
			this.drawXAxisLine(this.getX(xPos));

		}
		c.stroke();
	},
	drawXAxisLine: function(x){
		this.c.moveTo(x, this.getY(0 - this.options.xAxisLineOverflow));
		this.c.lineTo(x, this.getY(this.options.height));
	},



	drawYAxis: function(){
		var c = this.c;

		c.beginPath();
		c.setFont();

		c.stp();
		c.lineTo(this.getX(0)+0.5, this.getY(this.options.height));
		c.strokeStyle = this.options.borderColor;
		c.lineWidth = this.options.borderLineWidth;
		c.stroke();

		this.drawYAxisNum();
	},
	drawYAxisNum: function(){
		var c = this.c;
		c.beginPath();
		c.setFont();

		c.strokeStyle = this.options.borderColor;
		c.lineWidth = this.options.borderLineWidth;

		c.textAlign = "right";
		c.textBaseline = "middle";

		var yPos = 0;
		var maxYPos = this.options.height - this.options.yPadding;

		var val = this.options.min;
		var interval = (this.options.max-this.options.min) / this.options.yAxisNum;

		for(var i = 0; i <= this.options.yAxisNum ; i++){
			c.fillText(val.toFixed(1), this.getX(0-this.options.yAxisNumMargin), this.getY(yPos));
			this.drawYAxisLine(this.getY(yPos));
			val += interval;
			yPos += maxYPos / this.options.yAxisNum;
		}
		c.stroke();
	},
	drawYAxisLine: function(y){
		this.c.moveTo(this.getX(0 - this.options.yAxisLineOverflow), y +0.5);
		this.c.lineTo(this.getX(this.options.width), y + 0.5);
	},



	drawData: function(){
		var c = this.c;
		c.beginPath();

		c.strokeStyle = this.options.valueLineColor;
		c.lineWidth = this.options.valueLineWidth;

		var xPos;
		var maxXPos = this.options.width - this.options.xPadding;

		c.moveTo(this.getX(0), this.getY( (this.options.height-this.options.yPadding) * (this.data[0]-this.options.min) / (this.options.max - this.options.min)));
		for(var i = 0; i < this.data.length ; i++){
			xPos = maxXPos/(this.data.length-1)*(i+1);
			c.lineTo(this.getX(xPos), this.getY( (this.options.height-this.options.yPadding) * (this.data[i+1]-this.options.min) / (this.options.max - this.options.min)));	
		}
		c.stroke();
	},
	drawDataArc: function(){
		var c = this.c;
		c.fillStyle = this.options.dataArcColor;
		c.lineWidth = this.options.dataArcBorderWidth;
		c.strokeStyle = this.options.dataArcBorderColor;

		var xPos;
		var maxXPos = this.options.width - this.options.xPadding;

		for(var i = 0; i < this.data.length ; i++){		
			c.beginPath();
			xPos = maxXPos/(this.data.length-1)*(i);
			c.arc(this.getX(xPos), this.getY((this.options.height-this.options.yPadding) * (this.data[i]-this.options.min) / (this.options.max - this.options.min)), this.options.dataArcRadius, 0, 2 * Math.PI, false);	
			c.fill();
			c.stroke();
		}
		
	},
	
	// Getter 
	getX: function(x){
		return x + this.options.xPadding;
	},
	getY: function(y){
		return this.options.height - y - this.options.yPadding;
	},
	getMaxValue: function(){
		if(this.options.max != null)
			return false;

		var max = 0;
		for(i in this.data){
			i = this.data[i];
			if(i > max){
				max = i;
			}
		}
		this.options.max = max*1.1;
		return max;
	},
	getMinValue: function(){
		if(this.options.min != null)
			return false;

		var min = this.data[0];
		for(i in this.data){
			i = this.data[i];
			if(i < min){
				min= i;
			}
		}
		this.options.min = min*0.9;
		return min;
	},
	// Setter
	setCVSFunctions: function(){
		this.c.setFont = function(){
			chart24.c.font = "12px Malgun Gothic";
		};
		this.c.stp = function(){
			chart24.c.moveTo(chart24.getX(0)+0.5, chart24.getY(0)+0.5);
		};
	},
	setSelector: function(sel){
		this.jsel = $("#"+sel);
		this.csel = "chart24_"+sel;
		this.sel = sel;
	},
	setOptions: function(options){
		this.options.width = this.jsel.width();
		this.options.height = this.jsel.height();

//		this.options = options;
		for(var i in options) {
			this.options[i] = options[i];
		}
	},
	setData: function(data){
		this.data = data;
	}
}; 