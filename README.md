# waterpipe.js - smoky backgrounds generator (HTML5 Canvas)

waterpipe.js is a jQuery plugin for smoky backgrounds developed by [dragdropsite.com](http://www.dragdropsite.com)

![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/screenshot.jpg)

##Examples
Here are some examples generated using waterpipe.js plugin. 

![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-1.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-2.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-3.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-4.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-5.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-6.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-7.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-8.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-9.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-10.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-11.jpg)
![alt tag](https://raw.github.com/dragdropsite/waterpipe.js/master/img/samples/sample-12.jpg)

##Usage

**1. Include jQuery and waterpipe.js**

    <script src="lib/jquery-1.11.0.min.js"></script>
    <script src="waterpipe.js"></script>

**2. Create wrapper with canvas element inside**

    <div id="wavybg-wrapper" style="width: 100%; height: 100%;"> 
        <canvas>Your browser does not support HTML5 canvas.</canvas>
    </div>

**3. Initialize with**

    var smokyBG = $('#wavybg-wrapper').waterpipe({
        //Default values
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
        bgColorInner: "#ffffff",
        bgColorOuter: "#666666"
    });

##Options

| Option        | Type          | Default   | Description                                                                                                                                                                    |
|---------------|---------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| gradientStart | string        | '#000000' | Gradient start color in hex format.                                                                                                                                            |
| gradientEnd   | string        | '#222222' | Gradient end color in hex format.                                                                                                                                              |
| smokeOpacity  | number        | 0.1       | Smoke opacity 0 to 1.                                                                                                                                                          |
| numCircles    | int           | 1         | Number of circles (smokes).                                                                                                                                                    |
| maxMaxRad     | int or 'auto' | 'auto'    | Could be used to change circle radius size                                                                                                                                     |
| minMaxRad     | int or 'auto' | 'auto'    | Could be used to change circle radius size                                                                                                                                     |
| minRadFactor  | int           | 0         | It's a factor representing the size of the smallest radius with respect to the largest possible. Integer from 0 to 1.                                                          |
| iterations    | int           | 8         | The number of subdividing steps to take when creating a single fractal curve. Can use more, but anything over 10 (thus 1024 points) is overkill for a moderately sized canvas. |
| drawsPerFrame | int           | 10        | Number of curves to draw on every tick of the timer                                                                                                                            |
| lineWidth     | number        | 2         | Line width                                                                                                                                                                     |
| speed         | int           | 1         | Drawing speed (tick of timer in ms)                                                                                                                                            |
| bgColorInner  | string        | '#ffffff' | Background outer color in hex format                                                                                                                                           |
| bgColorOuter  | string        | '#666666' | Background inner color in hex format                                                                                                                                           |

##Methods

The following code could be used to call a method: `smokyBG.data('waterpipe').generate();`Please make sure variable smokyBG exists

| Method    | Arguments   | Description                                                                                     |
|-----------|-------------|-------------------------------------------------------------------------------------------------|
| generate  |             | Generates background canvas                                                                     |
| setOption | optionName, | Set a new value to an option. Please check the above table for possible option names and values |
|           | optionValue |                                                                                                 |
| download  | width: int, | Download size in pixels                                                                         |
|           | height: int |                                                                                                 |

##Demo

Please check the demo to generate and download your own smoky backgrounds: [http://dragdropsite.github.io/waterpipe.js](http://dragdropsite.github.io/waterpipe.js)

##Credits

[rectangleworld.com](http://rectangleworld.com/blog/) - big part of code has been taken from the examples provided on this blog

##License

Licensed under MIT license