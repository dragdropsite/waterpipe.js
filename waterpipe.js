/*
 *  waterpipe.js - v1.0
 *  jQuery plugin. Smoky backgrounds generator
 *  http://www.dragdropsite.com
 *
 *  Made by dragdropsite.com
 *
 *  Under MIT License
 *
 *  Credits: rectangleworld.com
 */

;(function ( $, window, document, undefined ) {
    var pluginName = "waterpipe",
        defaults = {
            //Smoke
            gradientStart: '#000000',
            gradientEnd: '#222222',
            smokeOpacity: 0.1,
            numCircles: 1,
            maxMaxRad: 'auto',
            minMaxRad: 'auto',
            minRadFactor: 0,
            iterations: 8,
            drawsPerFrame: 10,
            lineWidth: 2,
            speed: 1,
            //Background
            bgColorInner: "#ffffff",
            bgColorOuter: "#666666",
        };

    var TWO_PI = 2*Math.PI;
    var timer;
    var inst;
    function Smoke ( element, options ) {
        this.element = element;
        this.$element = $(element);
        inst = this;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Smoke.prototype = {
        init: function () {
            this.initSettings();
            this.initCanvas();
            this.generate();
        },
        initSettings: function () {
            var radius = this.$element.height()*0.8/2;
            if(this.settings.maxMaxRad==='auto') this.settings.maxMaxRad = radius;
            if(this.settings.minMaxRad==='auto') this.settings.minMaxRad = radius;
        },
        initCanvas: function () {
            this.displayCanvas = this.$element.find('canvas');
            this.displayWidth = this.$element[0].clientWidth;
            this.displayHeight = this.$element[0].clientHeight;
            this.displayCanvas[0].width = this.displayWidth;
            this.displayCanvas[0].height = this.displayHeight;
            this.context = this.displayCanvas[0].getContext("2d");

            //off screen canvas used only when exporting image
            this.exportCanvas = document.createElement('canvas');
            this.exportCanvas.width = this.displayWidth;
            this.exportCanvas.height = this.displayHeight;
            this.exportContext = this.exportCanvas.getContext("2d");
        },
        generate: function () {
            this.drawCount = 0;
            this.context.setTransform(1,0,0,1,0,0);
            this.context.clearRect(0,0,this.displayWidth,this.displayHeight);
            this.fillBackground();
            
            this.setCircles();
            
            if(timer) {clearInterval(timer);}
            timer = setInterval(function(){inst.onTimer()},inst.settings.speed);
            
        },
        fillBackground: function () {
            var outerRad = Math.sqrt(this.displayWidth*this.displayWidth + this.displayHeight*this.displayHeight)/2;
            this.niceGradient = new SmokeNiceBG(this.displayWidth*0.75,this.displayHeight/2*0.75,0,this.displayWidth/2,this.displayHeight/4,outerRad);

            var hex = this.settings.bgColorInner.replace('#','');

            var r0 = parseInt(hex.substring(0,2), 16), 
                g0 = parseInt(hex.substring(2,4), 16), 
                b0 = parseInt(hex.substring(4,6), 16);

            hex = this.settings.bgColorOuter.replace('#','');
            var r1 = parseInt(hex.substring(0,2), 16), 
                g1 = parseInt(hex.substring(2,4), 16), 
                b1 = parseInt(hex.substring(4,6), 16);

            this.niceGradient.addColorStop(0,r0,g0,b0);
            this.niceGradient.addColorStop(1,r1,g1,b1);     
            this.niceGradient.fillRect(this.context,0,0,this.displayWidth,this.displayHeight);
        },
        setCircles: function () {
            var i;
            var r,g,b,a;
            var maxR, minR;
            var grad;
            
            this.circles = [];
            
            for (i = 0; i < this.settings.numCircles; i++) {
                maxR = this.settings.minMaxRad+Math.random()*(this.settings.maxMaxRad-this.settings.minMaxRad);
                minR = this.settings.minRadFactor*maxR;
                
                //define gradient
                grad = this.context.createRadialGradient(0,0,minR,0,0,maxR);
                var gradientStart = this.hexToRGBA(this.settings.gradientStart, this.settings.smokeOpacity),
                    gradientEnd = this.hexToRGBA(this.settings.gradientEnd, this.settings.smokeOpacity);

                grad.addColorStop(1,gradientStart);
                grad.addColorStop(0,gradientEnd);
                
                var newCircle = {
                    centerX: -maxR,
                    centerY: this.displayHeight/2-50,
                    maxRad : maxR,
                    minRad : minR,
                    color: grad, //can set a gradient or solid color here.
                    //fillColor: "rgba(0,0,0,1)",
                    param : 0,
                    changeSpeed : 1/250,
                    phase : Math.random()*TWO_PI, //the phase to use for a single fractal curve.
                    globalPhase: Math.random()*TWO_PI //the curve as a whole will rise and fall by a sinusoid.
                    };
                this.circles.push(newCircle);
                newCircle.pointList1 = this.setLinePoints(this.settings.iterations);
                newCircle.pointList2 = this.setLinePoints(this.settings.iterations);
            }
        },
        onTimer: function () {
            var i,j;
            var c;
            var rad;
            var point1,point2;
            var x0,y0;
            var cosParam;
            
            var xSqueeze = 0.75; //cheap 3D effect by shortening in x direction.
            
            var yOffset;
            
            //draw circles
            for (j = 0; j < this.settings.drawsPerFrame; j++) {
                
                this.drawCount++;
                
                for (i = 0; i < this.settings.numCircles; i++) {
                    c = this.circles[i];
                    c.param += c.changeSpeed;
                    if (c.param >= 1) {
                        c.param = 0;
                        
                        c.pointList1 = c.pointList2;
                        c.pointList2 = this.setLinePoints(this.settings.iterations);
                    }
                    cosParam = 0.5-0.5*Math.cos(Math.PI*c.param);
                    
                    this.context.strokeStyle = c.color;
                    this.context.lineWidth = this.settings.lineWidth;
                    //context.fillStyle = c.fillColor;
                    this.context.beginPath();
                    point1 = c.pointList1.first;
                    point2 = c.pointList2.first;
                    
                    //slowly rotate
                    c.phase += 0.0002;
                    
                    theta = c.phase;
                    rad = c.minRad + (point1.y + cosParam*(point2.y-point1.y))*(c.maxRad - c.minRad);
                    
                    //move center
                    c.centerX += 0.5;
                    c.centerY += 0.04;
                    yOffset = 40*Math.sin(c.globalPhase + this.drawCount/1000*TWO_PI);
                    //stop when off screen
                    if (c.centerX > this.displayWidth + this.settings.maxMaxRad) {
                        clearInterval(timer);
                        timer = null;
                    }           
                    
                    //we are drawing in new position by applying a transform. We are doing this so the gradient will move with the drawing.
                    this.context.setTransform(xSqueeze,0,0,1,c.centerX,c.centerY+yOffset)
                    
                    //Drawing the curve involves stepping through a linked list of points defined by a fractal subdivision process.
                    //It is like drawing a circle, except with varying radius.
                    x0 = xSqueeze*rad*Math.cos(theta);
                    y0 = rad*Math.sin(theta);
                    this.context.lineTo(x0, y0);
                    while (point1.next != null) {
                        point1 = point1.next;
                        point2 = point2.next;
                        theta = TWO_PI*(point1.x + cosParam*(point2.x-point1.x)) + c.phase;
                        rad = c.minRad + (point1.y + cosParam*(point2.y-point1.y))*(c.maxRad - c.minRad);
                        x0 = xSqueeze*rad*Math.cos(theta);
                        y0 = rad*Math.sin(theta);
                        this.context.lineTo(x0, y0);
                    }
                    this.context.closePath();
                    this.context.stroke();
                    //context.fill();       
                        
                }
            }
        },
        setLinePoints: function (iterations) {
            var pointList = {};
            pointList.first = {x:0, y:1};
            var lastPoint = {x:1, y:1}
            var minY = 1;
            var maxY = 1;
            var point;
            var nextPoint;
            var dx, newX, newY;
            var ratio;
            
            var minRatio = 0.5;
                    
            pointList.first.next = lastPoint;
            for (var i = 0; i < iterations; i++) {
                point = pointList.first;
                while (point.next != null) {
                    nextPoint = point.next;
                    
                    dx = nextPoint.x - point.x;
                    newX = 0.5*(point.x + nextPoint.x);
                    newY = 0.5*(point.y + nextPoint.y);
                    newY += dx*(Math.random()*2 - 1);
                    
                    var newPoint = {x:newX, y:newY};
                    
                    //min, max
                    if (newY < minY) {
                        minY = newY;
                    }
                    else if (newY > maxY) {
                        maxY = newY;
                    }
                    
                    //put between points
                    newPoint.next = nextPoint;
                    point.next = newPoint;
                    
                    point = nextPoint;
                }
            }
            
            //normalize to values between 0 and 1
            if (maxY != minY) {
                var normalizeRate = 1/(maxY - minY);
                point = pointList.first;
                while (point != null) {
                    point.y = normalizeRate*(point.y - minY);
                    point = point.next;
                }
            }
            //unlikely that max = min, but could happen if using zero iterations. In this case, set all points equal to 1.
            else {
                point = pointList.first;
                while (point != null) {
                    point.y = 1;
                    point = point.next;
                }
            }
            
            return pointList;       
        },
        setOption: function (optionName, optionValue) {
            this.settings[optionName] = optionValue;
        },
        hexToRGBA: function (hex, opacity) {
            hex = hex.replace('#','');
            r = parseInt(hex.substring(0,2), 16);
            g = parseInt(hex.substring(2,4), 16);
            b = parseInt(hex.substring(4,6), 16);

            result = 'rgba('+r+','+g+','+b+','+opacity+')';
            return result;
        },
        download: function(width, height){
            this.exportContext.drawImage(this.displayCanvas[0], 0, 0, width, height, 0, 0, width, height);
            //we will open a new window with the image contained within:        
            //retrieve canvas image as data URL:
            var dataURL = this.exportCanvas.toDataURL("image/png");
            //open a new window of appropriate size to hold the image:
            var imageWindow = window.open("", "fractalLineImage", "left=0,top=0,width="+width+",height="+height+",toolbar=0,resizable=0");
            //write some html into the new window, creating an empty image:
            imageWindow.document.write("<title>Export Image</title>")
            imageWindow.document.write("<img id='exportImage'"
                                        + " alt=''"
                                        + " height='" + height + "'"
                                        + " width='"  + width  + "'"
                                        + " style='position:absolute;left:0;top:0'/>");
            imageWindow.document.close();
            //copy the image into the empty img in the newly opened window:
            var exportImage = imageWindow.document.getElementById("exportImage");
            exportImage.src = dataURL;
        }
    };

    function SmokeNiceBG(_x0,_y0,_rad0,_x1,_y1,_rad1) {
        this.x0 = _x0;
        this.y0 = _y0;
        this.x1 = _x1;
        this.y1 = _y1;
        this.rad0 = _rad0;
        this.rad1 = _rad1;
        this.colorStops = [];
    }

    SmokeNiceBG.prototype.addColorStop = function(ratio,r,g,b) {
        if ((ratio < 0) || (ratio > 1)) {
            return;
        }
        var n;
        var newStop = {ratio:ratio, r:r, g:g, b:b};
        if ((ratio >= 0) && (ratio <= 1)) {
            if (this.colorStops.length == 0) {
                this.colorStops.push(newStop);
            }
            else {
                var i = 0;
                var found = false;
                var len = this.colorStops.length;
                //search for proper place to put stop in order.
                while ((!found) && (i<len)) {
                    found = (ratio <= this.colorStops[i].ratio);
                    if (!found) {
                        i++;
                    }
                }
                //add stop - remove next one if duplicate ratio
                if (!found) {
                    //place at end
                    this.colorStops.push(newStop);
                }
                else {
                    if (ratio == this.colorStops[i].ratio) {
                        //replace
                        this.colorStops.splice(i, 1, newStop);
                    }
                    else {
                        this.colorStops.splice(i, 0, newStop);
                    }
                }
            }
        }
    }

        
    SmokeNiceBG.prototype.fillRect = function(ctx, rectX0, rectY0, rectW, rectH) {
        
        if (this.colorStops.length == 0) {
            return;
        }
        
        var image = ctx.getImageData(rectX0, rectY0, rectW, rectH);
        var pixelData = image.data;
        var len = pixelData.length;
        var oldpixel, newpixel, nearestValue;
        var quantError;
        var x;
        var y;
        
        var vx = this.x1 - this.x0;
        var vy = this.y1 - this.y0;
        var vMagSquareRecip = 1/(vx*vx+vy*vy);
        var ratio;
        
        var r,g,b;
        var r0,g0,b0,r1,g1,b1;
        var ratio0,ratio1;
        var f;
        var stopNumber;
        var found;
        var q;
        
        var rBuffer = [];
        var gBuffer = [];
        var bBuffer = [];
        var aBuffer = [];
        
        var a,b,c,discrim;
        var dx,dy;
        
        var xDiff = this.x1 - this.x0;
        var yDiff = this.y1 - this.y0;
        var rDiff = this.rad1 - this.rad0;
        a = rDiff*rDiff - xDiff*xDiff - yDiff*yDiff;
        var rConst1 = 2*this.rad0*(this.rad1-this.rad0);
        var r0Square = this.rad0*this.rad0;

        //first complete color stops with 0 and 1 ratios if not already present
        if (this.colorStops[0].ratio != 0) {
            var newStop = { ratio:0,
                            r: this.colorStops[0].r,
                            g: this.colorStops[0].g,
                            b: this.colorStops[0].b}
            this.colorStops.splice(0,0,newStop);
        }
        if (this.colorStops[this.colorStops.length-1].ratio != 1) {
            var newStop = { ratio:1,
                            r: this.colorStops[this.colorStops.length-1].r,
                            g: this.colorStops[this.colorStops.length-1].g,
                            b: this.colorStops[this.colorStops.length-1].b}
            this.colorStops.push(newStop);
        }

        //create float valued gradient
        for (i = 0; i<len/4; i++) {
            
            x = rectX0 + (i % rectW);
            y = rectY0 + Math.floor(i/rectW);
            
            dx = x - this.x0;
            dy = y - this.y0;
            b = rConst1 + 2*(dx*xDiff + dy*yDiff);
            c = r0Square - dx*dx - dy*dy;
            discrim = b*b-4*a*c;
            
            if (discrim >= 0) {
                ratio = (-b + Math.sqrt(discrim))/(2*a);
            
                if (ratio < 0) {
                    ratio = 0;
                }
                else if (ratio > 1) {
                    ratio = 1;
                }
                
                //find out what two stops this is between
                if (ratio == 1) {
                    stopNumber = this.colorStops.length-1;
                }
                else {
                    stopNumber = 0;
                    found = false;
                    while (!found) {
                        found = (ratio < this.colorStops[stopNumber].ratio);
                        if (!found) {
                            stopNumber++;
                        }
                    }
                }
                
                //calculate color.
                r0 = this.colorStops[stopNumber-1].r;
                g0 = this.colorStops[stopNumber-1].g;
                b0 = this.colorStops[stopNumber-1].b;
                r1 = this.colorStops[stopNumber].r;
                g1 = this.colorStops[stopNumber].g;
                b1 = this.colorStops[stopNumber].b;
                ratio0 = this.colorStops[stopNumber-1].ratio;
                ratio1 = this.colorStops[stopNumber].ratio;
                    
                f = (ratio-ratio0)/(ratio1-ratio0);
                r = r0 + (r1 - r0)*f;
                g = g0 + (g1 - g0)*f;
                b = b0 + (b1 - b0)*f;
            }
            
            else {
                r = r0;
                g = g0;
                b = b0;
            }
            
            //set color as float values in buffer arrays
            rBuffer.push(r);
            gBuffer.push(g);
            bBuffer.push(b);
        }
        
        //While converting floats to integer valued color values, apply Floyd-Steinberg dither.
        for (i = 0; i<len/4; i++) {
            nearestValue = ~~(rBuffer[i]);
            quantError =rBuffer[i] - nearestValue;
            rBuffer[i+1] += 7/16*quantError;
            rBuffer[i-1+rectW] += 3/16*quantError;
            rBuffer[i + rectW] += 5/16*quantError;
            rBuffer[i+1 + rectW] += 1/16*quantError;
            
            nearestValue = ~~(gBuffer[i]);
            quantError =gBuffer[i] - nearestValue;
            gBuffer[i+1] += 7/16*quantError;
            gBuffer[i-1+rectW] += 3/16*quantError;
            gBuffer[i + rectW] += 5/16*quantError;
            gBuffer[i+1 + rectW] += 1/16*quantError;
            
            nearestValue = ~~(bBuffer[i]);
            quantError =bBuffer[i] - nearestValue;
            bBuffer[i+1] += 7/16*quantError;
            bBuffer[i-1+rectW] += 3/16*quantError;
            bBuffer[i + rectW] += 5/16*quantError;
            bBuffer[i+1 + rectW] += 1/16*quantError;
        }
            
        //copy to pixel data
        for (i=0; i<len; i += 4) {
            q = i/4;
            pixelData[i] = ~~rBuffer[q];
            pixelData[i+1] = ~~gBuffer[q];
            pixelData[i+2] = ~~bBuffer[q];
            pixelData[i+3] = 255;       
        }
        
        ctx.putImageData(image,rectX0,rectY0);
        
    }

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
            if ( !$.data( this, pluginName ) ) {
                $.data( this, pluginName, new Smoke( this, options ) );
            }
        });

        // chain jQuery functions
        return this;
    };

})( jQuery, window, document );