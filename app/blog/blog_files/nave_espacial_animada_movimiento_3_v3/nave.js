var cubeRotation = 0.0;
const init_date = new Date();
const init_time = init_date.getTime();
var spaceShipSpeed = 8
var oldSpaceShipSpeed = 8

var globalx=0
var globaly=30
var globalz=10

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
  var radius = 50
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
  while(currentLat<360)
  {
    while(currentLon<360)
    {
      newPoint=polarToCartesian(currentLon,currentLat,radius)
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      newPoint=polarToCartesian(currentLon+10,currentLat,radius)
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      newPoint=polarToCartesian(currentLon,currentLat+10,radius)
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      newPoint=polarToCartesian(currentLon+10,currentLat+10,radius)
      sphereScalarField.push(newPoint.x+center.x)
      sphereScalarField.push(newPoint.y+center.y)
      sphereScalarField.push(newPoint.z+center.z)
      currentLon=currentLon+10
      sphereScalarFieldPoligons.push(currentOriginPoligon)
      sphereScalarFieldPoligons.push(currentOriginPoligon+1)
      sphereScalarFieldPoligons.push(currentOriginPoligon+3)
      sphereScalarFieldPoligons.push(currentOriginPoligon)
      sphereScalarFieldPoligons.push(currentOriginPoligon+2)
      sphereScalarFieldPoligons.push(currentOriginPoligon+3)
      currentOriginPoligon=currentOriginPoligon+4
    }
    currentLon = 0
    currentLat = currentLat + 20

  }

  console.log(sphereScalarField)
  console.log(sphereScalarFieldPoligons)
  console.log(sphereScalarFieldPoligons.length)
  vertexcount = 3888
  var colors = []
  color = [0.5,0.5,0.5,0.5]
  for (var j = 0; j < 3888; ++j) {
    const c = color;
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }
  return [sphereScalarField, sphereScalarFieldPoligons, colors, vertexcount]
}

function spaceShipGenerator(){
  const vertexArray = [
    // Front face
     0.0,  0.0,  1.0,
     1.0, -0.5,  1.0,
    -1.0, -0.5,  1.0,

    // Back face
     0.0,  0.0,  1.0,
     1.0, -0.5,  1.0,
     0.0, -1.0, -1.0,

    // Top face
     0.0,  0.0,  1.0,
    -1.0, -0.5,  1.0,
     0.0, -1.0, -1.0,

    // Bottom face
     1.0, -0.5,  1.0,
    -1.0, -0.5,  1.0,
     0.0, -1.0, -1.0,

    // Right face
     0.0,  0.0,  1.0,
    -1.0, -0.5,  1.0,
     -0.5,  0.0,  1.5,

    // Left face
     0.0,  0.0,  1.0,
     1.0, -0.5,  1.0,
     0.5,  0.0,  1.5,
  ];

  const faceColors = [
    [1.0,  1.0,  1.0,  0.8],    // Front face: white
    [0.6,  0.6,  0.6,  0.8],
    [0.7,  0.7,  0.7,  0.8],
    [0.3,  0.3,  0.3,  0.8],
    [0.4,  0.4,  0.4,  0.8],
    [0.5,  0.5,  0.5,  0.8],
    [0.4,  0.4,  0.4,  0.8],
  ];

  // Convert the array of colors into a table for all the vertices.

//Object switcher
  var colors = []
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }
    const poligonArray = [
      0,  1,  2,
      3,  4,  5,
      6,  7,  8,
      9,  10, 11,
      12, 13, 14,
      15, 16, 17,
    ];

  vertexcount = 18
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

  // Now create an array of positions for the cube.
  //Object switcher

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

  mat4.translate(projectionMatrix,     // destination matrix
                 projectionMatrix,     // matrix to translate
                 [0.0+globalx, 0.0+globalz, -6.0-globaly]);  // amount to translate
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
  var passedTime = n-init_time;

  var passedTimeSec = passedTime/1000;
  var value = passedTimeSec%oldSpaceShipSpeed;
  value = value/(oldSpaceShipSpeed/2);
  position = positionBezier(value);

  if(value<0.01)
  {
    console.log("New speed")
    oldSpaceShipSpeed=spaceShipSpeed
  }



  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
    for (var i=0, item; item = arrayBuffers[i]; i++){
      if(i == (arrayBuffers.length-1)){
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        mat4.translate(modelViewMatrix,     // destination matrix
                       modelViewMatrix,     // matrix to translate
                       [0.0+position.x, 0.0, -6.0-position.y]);  // amount to translate
        mat4.rotate(modelViewMatrix,  // destination matrix
                    modelViewMatrix,  // matrix to rotate
                    cubeRotation,     // amount to rotate in radians
                    [0, 0, 0]);       // axis to rotate around (Z)
        mat4.rotate(modelViewMatrix,  // destination matrix
                    modelViewMatrix,  // matrix to rotate
                    cubeRotation,// amount to rotate in radians
                    [0, 0, 0]);       // axis to rotate around (X)
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
      }




  {

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

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        if(spaceShipSpeed>3){
          spaceShipSpeed = spaceShipSpeed-0.1
        }
    }
    else if (e.keyCode == '40') {
        // down arrow
        if(spaceShipSpeed<100){
          spaceShipSpeed = spaceShipSpeed+0.1
        }
    }
    else if (e.keyCode == '37') {
       // left arrow
    }
    else if (e.keyCode == '39') {
       // right arrow
    }

    console.log(spaceShipSpeed)

}
