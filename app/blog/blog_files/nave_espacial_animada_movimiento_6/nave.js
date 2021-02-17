var cubeRotation = 0.0;
const init_date = new Date();
var init_time = init_date.getTime();
var spaceShipSpeed = 8
var oldSpaceShipSpeed = 8

var asteroidPath = 1

var globalx=0
var globaly=0
var globalz=0

var globalAngleLon = -180
var globalAngleLat = 0

var wDown = false
var sDown = false
var aDown = false
var dDown = false

var sunPosZ = -1000
var sunPosX = 10
var sunPosY = 10

var asteroidDodgeCount = 0

var mainmenu = 1
var currentMaxScore = 0
var currentMaxSpeed = 0

main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);


var RAD2DEG = 180 / Math.PI
var DEG2RAD = Math.PI / 180

/**
 * Convert [lat,lon] polar coordinates to [x,y,z] cartesian coordinates
 * @param {Number} lon
 * @param {Number} lat
 * @param {Number} radius
 * @return {Vector3}
 */
function polarToCartesian( lon, lat, radius ) {
  var phi = ( 90 - lat ) * DEG2RAD
  var theta = ( lon + 180 ) * DEG2RAD
  return {
    x: -(radius * Math.sin(phi) * Math.sin(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.cos(theta),
  }
}

window.sphereGenerator = function(){
  var radius = 10

  var center = {
    x:0,
    y:0,
    z:-100
  }
  sphereScalarField = []
  sphereScalarFieldPoligons = []
  var currentLon = 0
  var currentLat = 0
  var newPoint = null
  var currentOriginPoligon = 0
  nextLineRandom=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  var colors = []
  while(currentLat<360)
  {
    var currentLineRandom=nextLineRandom
    nextLineRandom=[]
    for(var i=0;i<36;i++){
      nextLineRandom.push(Math.random())
    }

    while(currentLon<360)
    {
      newPoint=polarToCartesian(currentLon,currentLat,radius+currentLineRandom[currentLon/10])
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      newPoint=polarToCartesian(currentLon+10,currentLat,radius+currentLineRandom[(currentLon/10)+1])
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      newPoint=polarToCartesian(currentLon,currentLat+10,radius+nextLineRandom[currentLon/10])
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      newPoint=polarToCartesian(currentLon+10,currentLat+10,radius+nextLineRandom[(currentLon/10)+1])
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      sphereScalarFieldPoligons.push(currentOriginPoligon)
      sphereScalarFieldPoligons.push(currentOriginPoligon+1)
      sphereScalarFieldPoligons.push(currentOriginPoligon+3)
      sphereScalarFieldPoligons.push(currentOriginPoligon)
      sphereScalarFieldPoligons.push(currentOriginPoligon+2)
      sphereScalarFieldPoligons.push(currentOriginPoligon+3)

      var c = [currentLineRandom[currentLon/10],  currentLineRandom[currentLon/10],  currentLineRandom[currentLon/10] , 0.5];
      colors = colors.concat(c, c, c, c);
      c = [currentLineRandom[(currentLon/10)+1],  currentLineRandom[(currentLon/10)+1],  currentLineRandom[(currentLon/10)+1] , 0.5];
      colors = colors.concat(c, c, c, c);
      c = [nextLineRandom[(currentLon/10)+1],  nextLineRandom[(currentLon/10)+1],  nextLineRandom[(currentLon/10)+1] , 0.5];
      colors = colors.concat(c, c, c, c);
      c = [currentLineRandom[currentLon/10],  currentLineRandom[currentLon/10],  currentLineRandom[currentLon/10] , 0.5];
      colors = colors.concat(c, c, c, c);
      c = [nextLineRandom[currentLon/10],  nextLineRandom[currentLon/10],  nextLineRandom[currentLon/10] , 0.5];
      colors = colors.concat(c, c, c, c);
      c = [nextLineRandom[(currentLon/10)+1],  nextLineRandom[(currentLon/10)+1],  nextLineRandom[(currentLon/10)+1] , 0.5];
      colors = colors.concat(c, c, c, c);

      currentLon=currentLon+10
      currentOriginPoligon=currentOriginPoligon+4
    }
    currentLon = 0
    currentLat = currentLat + 10

  }

  vertexcount = sphereScalarFieldPoligons.length
  /**
  const faceColors = [
    [0.1,  0.1,  0.1,  0.15]    // Front face: white
  ];

  // Convert the array of colors into a table for all the vertices.

//Object switcher

  for (var j = 0; j < 3888; ++j) {
    const c = faceColors[0];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }
  */
  return [sphereScalarField, sphereScalarFieldPoligons, colors, vertexcount]
}

function spaceShipGenerator(){
  const vertexArray = [
    //THRUSTER
     -0.3,  -0.15,  1.0,
     0.3, -0.15,  1.0,
     0, -0.5,  1.0,

     //FRONT RIGHT
     0.0,  0.0,  1.0,
     1.0, -0.5,  1.0,
     0.0, -1.0, -1.0,
     //FRONT LEFT
     0.0,  0.0,  1.0,
    -1.0, -0.5,  1.0,
     0.0, -1.0, -1.0,
     //BOTTOM
     1.0, -0.5,  1.0,
    -1.0, -0.5,  1.0,
     0.0, -1.0, -1.0,

     //FIN 1
     0.0,  0.0,  1.0,
    -1.0, -0.5,  1.0,
     -0.5,  0.0,  1.5,
     //FIN2
     0.0,  0.0,  1.0,
     1.0, -0.5,  1.0,
     0.5,  0.0,  1.5,

     //VERTICAL FLAME 1
     0.0,  -0.15,  1.0,
     0.0, -0.45,  1.0,
     0.05,  -0.3,  2,

     //HORIZANTAL FLAME 1
     0.15, -0.3,  1.0,
     -0.15, -0.3,  1.0,
     0.1,  -0.25,  2,

     //VERTICAL FLAME 2
     0.0,  -0.15,  1.0,
     0.0, -0.45,  1.0,
     -0.05,  -0.15,  2,

     //HORIZANTAL FLAME 2
     0.1,  -0.35,  1.0,
     -0.1, -0.15,  1.0,
     0.05,  -0.2,  2,

     //BACKPANEL 1
     -0.3,  -0.15,  1.0,
     0.3, -0.15,  1.0,
     0, 0,  1.0,

     //BACKPANEL 2
     1,  -0.5,  1.0,
     0.3, -0.15,  1.0,
     0, -0.5,  1.0,

     //BACKPANEL 3
     -0.3,  -0.15,  1.0,
     -1, -0.5,  1.0,
     0, -0.5,  1.0,
  ];

  const faceColors = [
    [1.0,  1.0,  0.0,  0.8],
    [0.9,  0.9,  0.9,  1],
    [0.6,  0.6,  0.6,  1],
    [0.3,  0.3,  0.3,  0.8],
    [0,  0.5,  1,  1],
    [0,  0.5,  1,  1],
    [1,  1,  0,  0.8],
    [1,  1,  0,  0.8],
    [1,  1,  0,  0.8],
    [1,  1,  0,  0.8],
    [0.8,  0.8,  0.8,  1],
    [0.9,  0.9,  0.9,  1],
    [0.9,  0.9,  0.9,  1],
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = []
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c);
  }
    const poligonArray = [
      0,  1,  2,
      3,  4,  5,
      6,  7,  8,
      9,  10, 11,
      12, 13, 14,
      15, 16, 17,
      18, 19, 20,
      21, 22, 23,
      24, 25, 26,
      27, 28, 29,
      30, 31, 32,
      33, 34, 35,
      36, 37, 38,
    ];

  vertexcount = poligonArray.length
  return [vertexArray, poligonArray, colors, vertexcount]
}
  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  var totalVertexCount = 0;
  //Creating the sphere
  var sphere = sphereGenerator()
  // Create a buffer for the cube's vertex positions.
  const sphereBuffer = gl.createBuffer();
  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
  const positions = sphere[0]

  const indices = sphere[1]
  totalVertexCount=totalVertexCount+3888
  const sun = initBuffers(gl,sphereBuffer, sphere[0], sphere[2], sphere[1]);

  var spaceship=spaceShipGenerator()
  // Create a buffer for the cube's vertex positions.
  const spaceshipBuffer = gl.createBuffer();
  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, spaceshipBuffer);
  const buffers = initBuffers(gl,spaceshipBuffer, spaceship[0], spaceship[2], spaceship[1]);
  //Creating the spaceship

  var then = 0;
  var arrayBuffers = []
  arrayBuffers.push([sphere[3],sun]);
  arrayBuffers.push([spaceship[3],buffers]);
  // Draw the scene repeatedly
  function render(now) {
    now *= 0.0005;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, deltaTime, arrayBuffers);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//

function initBuffers(gl, positionBuffer, positions, colors, indices) {
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.



  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo,deltaTime, arrayBuffers) {
  //buffers
  //vertexCount
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 5000.0;
  const projectionMatrix = mat4.create();
  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();


  //Get current position using bezier
  var d = new Date();
  var n = d.getTime();
  var passedTime = 10000;
  init_time = n

  var passedTimeSec = passedTime/1000;
  var value = passedTimeSec%oldSpaceShipSpeed;
  value = value/(oldSpaceShipSpeed/2);
  position = positionBezier(value);

  if(value<0.01)
  {
    oldSpaceShipSpeed=spaceShipSpeed
  }



  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
    for (var i=0, item; item = arrayBuffers[i]; i++){
      if(i == (arrayBuffers.length-2)){
        if(mainmenu==0){
          changeSunPosition(passedTime)
        }
        mat4.translate(projectionMatrix,     // destination matrix
                      projectionMatrix,     // matrix to translate
                      [sunPosX, sunPosY, sunPosZ]);  // amount to
      }
      if(i == (arrayBuffers.length-1)){
        distanceTraveled = (passedTime*spaceShipSpeed)/20000
        var RAD2DEG = 180 / Math.PI
        var DEG2RAD = Math.PI / 180
        function polarToCartesian( lon, lat, radius ) {
          var phi = ( 90 - lat ) * DEG2RAD
          var theta = ( lon + 180 ) * DEG2RAD
          return {
            x: -(radius * Math.sin(phi) * Math.sin(theta)),
            y: radius * Math.cos(phi),
            z: radius * Math.sin(phi) * Math.cos(theta),
          }
        }
        vectors = polarToCartesian(globalAngleLon, globalAngleLat, distanceTraveled);
        if(globalx+vectors.x<10 & globalx+vectors.x>-10){
          globalx=globalx+vectors.x
        }
        if(globaly+vectors.y<10 & globalx+vectors.y>-10){
          globaly=globaly+vectors.y
        }
        if(globaly+vectors.z<10 & globalx+vectors.z>-10){
          globalz=globalz+vectors.z
        }



        angleTraveled = (passedTime)/360000
        valueLon = 0
        valueLat = 0


        if(wDown){
          globalAngleLat =globalAngleLat+angleTraveled
          //valueLat = angleTraveled
        }
        if(sDown){
          globalAngleLat =globalAngleLat-angleTraveled
          //valueLat = valueLon+angleTraveled
        }
        if(aDown){
          globalAngleLon =globalAngleLon+angleTraveled
          //valueLon = valueLon+angleTraveled
        }
        if(dDown){
          globalAngleLon =globalAngleLon-angleTraveled
          //valueLon = valueLon+angleTraveled
        }

       mat4.translate(projectionMatrix,     // destination matrix
                     projectionMatrix,     // matrix to translate
                     [globalx, globaly, globalz]);  // amount to
       mat4.rotate(projectionMatrix,  // destination matrix
                   projectionMatrix,  // matrix to rotate
                   valueLat,     // amount to rotate in radians
                   [0, 1, 0]);       // axis to rotate around (Z)
       /**mat4.rotate(projectionMatrix,  // destination matrix
                   projectionMatrix,  // matrix to rotate
                   valueLon,// amount to rotate in radians
                   [1, 0, 0]);       // axis to rotate around (X)*/

        mat4.translate(modelViewMatrix,     // destination matrix
                       modelViewMatrix,     // matrix to translate
                       [globalx, globaly, -6-globalz]);  // amount to translate
        mat4.rotate(modelViewMatrix,  // destination matrix
                    modelViewMatrix,  // matrix to rotate
                    valueLat,     // amount to rotate in radians
                    [0, 1, 0]);       // axis to rotate around (Z)
        /**mat4.rotate(modelViewMatrix,  // destination matrix
                    modelViewMatrix,  // matrix to rotate
                    valueLon,// amount to rotate in radians
                    [1, 0, 0]);       // axis to rotate around (X)*/
      }
        {
          const numComponents = 3;
          const type = gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, item[1].position);
          gl.vertexAttribPointer(
              programInfo.attribLocations.vertexPosition,
              numComponents,
              type,
              normalize,
              stride,
              offset);
          gl.enableVertexAttribArray(
              programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
          const numComponents = 4;
          const type = gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, item[1].color);
          gl.vertexAttribPointer(
              programInfo.attribLocations.vertexColor,
              numComponents,
              type,
              normalize,
              stride,
              offset);
          gl.enableVertexAttribArray(
              programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, item[1].indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, item[0], type, offset);

        if(i == (arrayBuffers.length-2)){
          mat4.translate(projectionMatrix,     // destination matrix
                        projectionMatrix,     // matrix to translate
                        [-sunPosX, -sunPosY, -sunPosZ]);  // amount to
        }
      }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function positionBezier(t){
	var norm = t;
	if(t<1){
		var curve = new Bezier(0,6 , 8,6 , -9,4 , 0,4);
	}
	else{
		var curve = new Bezier(0,4 , 6,4 , -5,6 , 0,6);
		norm=norm-1;
	}
	return curve.get(norm);
}

positionBezier(3);

document.onkeydown = checkKey;

document.onkeyup = checkKeyUp;

function checkKey(e) {

    e = e || window.event;

    if(mainmenu==0){
    if (e.keyCode == '38') {
        // up arrow
        wDown = true
    }
    else if (e.keyCode == '40') {
        // down arrow
        sDown = true
    }
    else if (e.keyCode == '37') {
       // left arrow
       aDown = true
    }
    else if (e.keyCode == '39') {
       // right arrow
       dDown = true
    }
    else if (e.keyCode == '87') {
       // w key
       wDown = true
    }
    else if (e.keyCode == '83') {
       // s key
       sDown = true
    }
    else if (e.keyCode == '65') {
       // a key
       aDown = true
    }
    else if (e.keyCode == '68') {
       // d key
       dDown = true
    }
  }

}


function checkKeyUp(e) {

    e = e || window.event;

    if(mainmenu==1){
      if (e.keyCode == '32') {
        mainmenu=0
        updateOverlay(0,1)
        document.getElementById("mainmenu").setAttribute("style", "display:none;")
      }
    }
      if (e.keyCode == '38') {
          // up arrow
          wDown = false
      }
      else if (e.keyCode == '40') {
          // down arrow
          sDown = false
      }
      else if (e.keyCode == '37') {
         // left arrow
         aDown = false
      }
      else if (e.keyCode == '39') {
         // right arrow
         dDown = false
      }
      else if (e.keyCode == '87') {
         // w key
         wDown = false
      }
      else if (e.keyCode == '83') {
         // s key
         sDown = false
      }
      else if (e.keyCode == '65') {
         // a key
         aDown = false
      }
      else if (e.keyCode == '68') {
         // d key
         dDown = false

  }


}

function changeSunPosition(passedTime){
  var difficulty = ((asteroidDodgeCount/15)+1)
  if(difficulty>3){
    difficulty=3
  }
  sunPosZ=sunPosZ+(difficulty*passedTime/2000)

  if(sunPosZ>200){
    sunPosZ=-1400
    var dead = false
    if(asteroidPath == 1){
      if(globalx>=0 & globaly>=0){
        dead = true
      }
    }
    else if(asteroidPath == 2){
      if(globalx>=0 & globaly<=0){
        dead = true
      }
    }
    else if(asteroidPath == 3){
      if(globalx<=0 & globaly<=0){
        dead = true
      }
    }
    else if(asteroidPath == 4){
      if(globalx<=0 & globaly>=0){
        dead = true
      }
    }

    if(dead){
      globalx=0
      globaly=0
      globalz=0
      globalAngleLat=0
      globalAngleLon=-180
      wDown = false
      sDown = false
      aDown = false
      dDown = false
      updateMainMenu(asteroidDodgeCount, difficulty, "You have crashed into an asteroid.")
      updateOverlay(0,0)
      asteroidDodgeCount = 0

    }

    asteroidPath = Math.floor(Math.random()*(4-1+1)+1);
    if(asteroidPath == 1){
      sunPosX = 10
      sunPosY = 10
    }
    else if(asteroidPath == 2){
      sunPosX = 10
      sunPosY = -10
    }
    else if(asteroidPath == 3){
      sunPosX = -10
      sunPosY = -10
    }
    else if(asteroidPath == 4){
      sunPosX = -10
      sunPosY = 10
    }
    asteroidDodgeCount = asteroidDodgeCount + 1

    updateOverlay(asteroidDodgeCount,difficulty);
  }
  if(globalx>4 | globaly>2 | globalx<-4 | globaly<-2){
    globalx=0
    globaly=0
    globalz=0
    globalAngleLat=0
    globalAngleLon=-180
    wDown = false
    sDown = false
    aDown = false
    dDown = false
    updateMainMenu(asteroidDodgeCount, difficulty, "You have strayed off-course.")
    updateOverlay(0,0)
    asteroidDodgeCount = 0
  }
}

function updateOverlay(asteroidDodgeCount, difficulty){
  document.getElementById("score").innerHTML = "Score: "+asteroidDodgeCount;
  var speed = difficulty*100;
  speed = Math.round(speed * 100) / 100
  document.getElementById("speed").innerHTML = speed+" km/hr";
}

function updateMainMenu(asteroidDodgeCount, difficulty, deathReason){
  var speed = difficulty*100;
  speed = Math.round(speed * 100) / 100
  if(currentMaxSpeed<speed){
    currentMaxSpeed=speed
    document.getElementById("maxspeed").innerHTML = "Top Speed: "+speed+" km/hr"
  }
  if(currentMaxScore<asteroidDodgeCount){
    currentMaxScore=asteroidDodgeCount
    document.getElementById("maxscore").innerHTML = "Top Score: "+asteroidDodgeCount
  }
  mainmenu = 1
  document.getElementById("mainmenu").setAttribute("style", "display:inline;")

  document.getElementById("death").innerHTML = deathReason
}
