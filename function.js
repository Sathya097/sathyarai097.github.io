var generatedProbabilityValues = []
var tempData = []
var probabilityArray = [] 
var previousLabel = 0
var labelTarget
var labelTargetIndex
var tempText

// Generate random float in range min-max:
const rand = (min, Max) => Math.random() * (Max - min) + min; // Function to generate number in range min and max
const numberOfSectors = sectors.length;
const spinnerDOM = document.querySelector(".spin");
const fortuneWheel = document.querySelector("#wheel").getContext('2d');//Getting Canvas
const diameter = fortuneWheel.canvas.width;
const rad = diameter / 2;
const PI = Math.PI;
const TAU = 2 * PI;
//Degree of each arch
const arc = TAU / sectors.length; 
//0.995=soft, 0.99=mid, 0.98=hard
const friction = 0.995; 
// Below that number will be treated as a stop 
const angVelMin = 0.001;
// Random ang.vel. to acceletare to 
var angVelMax = 0; 
 // Current angular velocity
var angVel = 0; 
 // Angle rotation in radians  
let ang = 0;      
let isSpinning = false;
let isAccelerating = false;

//* Get index of current sector */
const getIndex = () => Math.floor(numberOfSectors - ang / TAU * numberOfSectors) % numberOfSectors;

//* Draw sectors and prizes texts to canvas */
const drawSector = (sector, i) => {
	const ang = arc * i;
	fortuneWheel.save();
	fortuneWheel.beginPath();
	fortuneWheel.fillStyle = sector.color;
	fortuneWheel.moveTo(rad, rad);
	fortuneWheel.arc(rad, rad, rad, ang, ang + arc);
	fortuneWheel.strokeStyle = "#fff";
	fortuneWheel.stroke();
	fortuneWheel.lineTo(rad, rad);
	fortuneWheel.fill();
	fortuneWheel.translate(rad, rad);
	fortuneWheel.rotate(ang + arc / 2);
	tempData.push(ang);
	fortuneWheel.textAlign = "right";
	fortuneWheel.fillStyle = "#fff";
	fortuneWheel.font = "14px sans-serif";
	fortuneWheel.stroke();
	fortuneWheel.fillText(sector.label, rad - 10, 10);
	fortuneWheel.lineWidth = 1;
	fortuneWheel.restore();
};

var iterationCount = 0;
var TickSound = new Howl({
	src: ['/Assets/tick.mp3'],
	html5: true,
});
var crowd = new Howl({
	src: ['/Assets/crowd.mp3'],
	html5: true,
});

var animationDOM = document.querySelector('#spin');
var tempValue = 200;
var sector = 0
const rotate = () => {
	sector = sectors[getIndex()];
	fortuneWheel.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
	tempText = spinnerDOM.textContent;
	spinnerDOM.textContent = !angVel ? "SPIN" : sector.label;
	spinnerDOM.style.background = sector.color;
	if(angVel == 0){
		// console.log("Rotation Stopped");
		updateLabelTarget(labelTargetIndex);
		const myTimeout = setTimeout(myGreeting, 500);
	}

	if(previousLabel != sector.label){
			previousLabel = sector.label;
			TickSound.play();
			animationDOM.classList.add("ShakeAnimation");
			if(sector.label == labelTarget){
				if(iterationCount==2){
					angVel = 0.035;
				}
				if(iterationCount == 3){
					angVel = 0;
					angVelMax = -1;
					frame();
				}
				iterationCount++;
			}
			// console.log(sector.label+"&&&&");
			TickSound.pause();
			TickSound.currentTime = 0; 
			setTimeout(function () {
				animationDOM.classList.remove("ShakeAnimation");
			}, 100);
			// 
	}
// console.log(sector.label + ".......");
};

const frame = () => {
	if (!isSpinning) return;
	if (angVel >= angVelMax) isAccelerating = false;
	// Accelerate
	if (isAccelerating) {
		angVel = angVel || angVelMin; // Initial velocity kick
		angVel *= 1.041; // Accelerate
	}
	// Decelerate
	else {
		isAccelerating = false;
		angVel *= friction; // Decelerate by friction  

		// SPIN END:
		if (angVel < angVelMin) {
		isSpinning = false;
		angVel = 0; 
		}
	}
	ang += angVel; // Update angle
	ang %= TAU;    // Normalize angle
	rotate();      // CSS rotate!
};

const engine = () => {
frame();
requestAnimationFrame(engine)
};

spinnerDOM.addEventListener("click", () => {
	$('#wheel').removeClass('firstStepAnimation')
	iterationCount = 0;
	isSpinning = true;
	isAccelerating = true;
	angVelMax = 0.1
});

// Initialisation
sectors.forEach(drawSector);
engine(); // Start engine!

//Probability Logic
generatingProbabilityArray(sectors);
function generatingProbabilityArray(sectors){
     var sectorNumber = sectors.length;
	 for(var i=0;i<sectorNumber;i++){
		var probability = sectors[i].probability.replace('%', '');
		 var itemsIteration = (probability/100)*10;
		 if(probability == 0){
			itemsIteration = 0;
		 }
		 var tempObj = {"label":sectors[i].label,"Iteration":itemsIteration}
         probabilityArray.push(tempObj);
	 }
	 //Normal Probability Array
	//  console.log(probabilityArray);
     refineProbabilityArray(probabilityArray);
}
function  refineProbabilityArray(probabilityArray){
	var min = 10000;
	for(var i=0;i<probabilityArray.length;i++){
		if(probabilityArray[i].Iteration < min && probabilityArray[i].Iteration !=0){
			min = probabilityArray[i].Iteration;
		}
	}
	if(min < 1){
		var multiplicationFactor = (1/min);
		for(var i=0;i<probabilityArray.length;i++){
			probabilityArray[i].Iteration = Math.round(probabilityArray[i].Iteration * multiplicationFactor);
		}
	}
	generateArrayElements(probabilityArray);
}

function generateArrayElements(probabilityArray){
    for(var i=0;i<probabilityArray.length;i++){
		for(var j=0;j<probabilityArray[i].Iteration;j++){
			generatedProbabilityValues.push(probabilityArray[i].label);
		}
	}
	generatedProbabilityValues = shuffle(generatedProbabilityValues);
	//Shuffled Probability Array
	// console.log(generatedProbabilityValues)
}
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle.
	while (currentIndex != 0) {
  
	// Pick a remaining element.
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex--;

	// And swap it with the current element.
	[array[currentIndex], array[randomIndex]] = [
	array[randomIndex], array[currentIndex]];
	}
	return array;
  }
  
  labelTarget = generatedProbabilityValues[0];
  labelTargetIndex = 0
  function updateLabelTarget(index){
	var lengthOfArray = generatedProbabilityValues.length;
	if(index < (lengthOfArray-1)){
		index = index + 1;
		
	}else{
        index = 0;
	}
	labelTarget = generatedProbabilityValues[index];
    labelTargetIndex = index;
  }

  
function myGreeting() {
	swal("Congratulations !! " + tempText, "", "success");
	crowd.play();
}
