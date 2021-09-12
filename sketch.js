var Edges
var cactus
var trex ,trex_running;
var score=0
var gamestate="play"
var touches=[]
function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png")
  groundImage=loadImage("ground2.png")
  cloudImg=loadImage("cloud.png")
  cactus1ing=loadImage("obstacle1.png")
  cactus2ing=loadImage("obstacle2.png")
  cactus3ing=loadImage("obstacle3.png")
  cactus4ing=loadImage("obstacle4.png")
  cactus5ing=loadImage("obstacle5.png")
  cactus6ing=loadImage("obstacle6.png")
  gameOverImg=loadImage("gameOver.png")
  restartImg=loadImage("restart.png")
  trexCollidedImg=loadAnimation("trex_collided.png")
  jump=loadSound("jump.mp3")
  die=loadSound("die.mp3")
  checkpoint=loadSound("checkpoint.mp3")
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  Edges=createEdgeSprites()
  //create a trex sprite
 trex=createSprite(100,300,51,50)
 trex.addAnimation("trexrunning",trexCollidedImg)
 trex.addAnimation("trex_running",trex_running)

 trex.debug=false
 trex.setCollider("circle",0,0,30)
 ground=createSprite(0,height-20,windowWidth,20)
 ground.addImage(groundImage)
 secondground=createSprite(0,height-5,windowWidth,10)
 secondground.visible=false
 gameOver=createSprite(windowWidth/2,windowHeight/2,30,30)
 gameOver.addImage(gameOverImg)
 gameOver.visible=false
 cactusGroup=createGroup()
 cloudGroup=createGroup()
 restart=createSprite(windowWidth/2,windowHeight/2+100,30,30)
 restart.addImage(restartImg)
 restart.scale=0.5
 restart.visible=false
}

function draw(){
  background("white")
  text("score="+score,width-200,30)
  //console.log(trex.y)
  trex.collide(secondground)
  //console.log("60000000" + 10000000)
  if (gamestate=="play"){
    trex.changeAnimation("trex_running",trex_running)
    score=score+Math.round(frameCount/200)
    ground.velocityX=-(5+score/500)
    if (score%1000==0&&score>0){
      checkpoint.play()
    }
    
    if(ground.x<600){
      ground.x=windowWidth/2
    }
    if(touches.length>0||keyDown("space")&&trex.y>windowHeight-50){
      trex.velocityY=-20
      jump.play()
      touches=[]
      }
      trex.velocityY=trex.velocityY+0.8
      cloudCreate()
      cactusCreate()
      if (trex.isTouching(cactusGroup)){
        gamestate="end"
        die.play()
      }
  }else if(gamestate=="end"){
    trex.changeAnimation("trexrunning",trexCollidedImg)
    ground.velocityX=0
    cloudGroup.setVelocityXEach(0)
    cactusGroup.setVelocityXEach(0)
    gameOver.visible=true
    restart.visible=true
    cloudGroup.setLifetimeEach(-1)
    cactusGroup.setLifetimeEach(-1)
    trex.velocityY=0
    if (mousePressedOver(restart)||touches.length>0){
      reset()
      touches=[]
    }
  }
  drawSprites()
}

function cloudCreate(){
  if(frameCount%50==0){
    cloud=createSprite(width,200,30,30)
    cloud.addImage(cloudImg)
    cloud.velocityX=-(5+score/500)
    cloud.y=Math.round(random(15,500))
    cloud.depth=trex.depth
    trex.depth=trex.depth+1
    cloud.lifetime=500
    cloudGroup.add(cloud)
  }
}

function cactusCreate(){
  if(frameCount%80==0){
    cactus=createSprite(width,height-30,30,30)
    cactus.velocityX=-(5+score/500)
    cactus.lifetime=500
    var r=Math.round(random(1,6))
    switch(r){
      case 1: cactus.addImage(cactus1ing)
      break;
      case 2: cactus.addImage(cactus2ing)
      break;
      case 3: cactus.addImage(cactus3ing)
      break;
      case 4: cactus.addImage(cactus4ing)
      break;
      case 5: cactus.addImage(cactus5ing)
      break;
      case 6: cactus.addImage(cactus6ing)
      break;
      default: break;
    }
    cactus.scale=0.6
    cactusGroup.add(cactus)
  }
}
function reset(){
  gamestate="play"
  gameOver.visible=false
  restart.visible=false
  cactusGroup.destroyEach()
  cloudGroup.destroyEach()
  score=0
}