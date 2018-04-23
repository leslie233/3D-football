
// var div = document.getElementById('WebGL-output');
// var PSV = new PhotoSphereViewer({
//     // Path to the panorama
//     panorama: '001Dd5d4jx07dDtBHe5N010f01003Q7A0k01',
 
//     // Container
//     container: div,
 
//     // Deactivate the animation
//     time_anim: false,
 
//     // Display the navigation bar
//     navbar: true,      
 
//     // Resize the panorama
//     size: {
//         width: '800px',
//         height: '400px'
//     },
 
//     // 限制顶部
//     // tilt_up_max: Math.PI / 7,       
 
//     // 限制底部
//     // tilt_down_max: Math.PI / 7     
// });



//创建一个场景（场景是一个容器，用于保存、跟踪所要渲染的物体和使用的光源）
var scene = new THREE.Scene();

//创建一个摄像机对象（摄像机决定了能够在场景里看到什么）
var camera = new THREE.PerspectiveCamera(45,
window.innerWidth / window.innerHeight, 0.1, 1000);

//设置摄像机的位置，并让其指向场景的中心（0,0,0）
// camera.position.x = 30;
// camera.position.y = 40;
camera.position.z = 4;
camera.up.x = 0;
camera.up.y = 0;
camera.up.z = 1;
 // camera.lookAt(sphere.position);

//创建一个WebGL渲染器并设置其大小
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xEEEEEE));
renderer.setSize(window.innerWidth, window.innerHeight);
    
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;


//创建一个平面
var planeGeometry = new THREE.PlaneGeometry(3, 2);
var ground = new THREE.TextureLoader().load( "ground.jpg" );
//平面使用颜色为0xcccccc的基本材质
var planeMaterial = new THREE.MeshBasicMaterial({map: ground});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
//将平面添加场景中
scene.add(plane);

//创建一个立方体
var cubeGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
//将线框（wireframe）属性设置为true，这样物体就不会被渲染为实物物体
var cubeMaterial = new THREE.MeshBasicMaterial({color: 'white', wireframe: true});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

//设置立方体的位置
cube.position.x = 1.2;
cube.position.y = 0;
cube.position.z = 0.1;

scene.add(cube);


//创建一个球体
var sphereGeometry = new THREE.SphereGeometry(0.05, 20, 20);
var texture = new THREE.TextureLoader().load( "ball.jpg" );
var sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
//sphereMaterial.map = texture;
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

//设置球体的位置
sphere.position.x = 0;
sphere.position.y = 0;
sphere.position.z = 0.05;

//将球体添加到场景中
scene.add(sphere);

//将渲染的结果输出到指定页面元素中
document.getElementById("WebGL-output").appendChild(renderer.domElement);


var strong = 1, time =0 ,shootType = 0
var lock = false, goal = false
var keyStatus = {}

function render() {
    renderer.render( scene, camera );
    //cube.rotation.x += 0.1;
    //cube.rotation.y += 0.1;
}

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    render()
}

document.onkeydown  = go;
document.onkeyup  = stop;

function go(e){
    keyStatus[e.keyCode] = true
    switch(e.keyCode){
        case 32:
            camera.position.set(-0.6,0,0.2)
            left()
        break;
        case 74:
            if(strong>=15){
                lock = true
                short()
            }
            if(strong==1){
                long()
            }
            if(strong >1 && strong <15){
                lock ? short() : long()
                // if(lock){
                //         short()
                // }
                // else{
                //     long()
                // }
            }
        break;

    } 
    //中高
    if(keyStatus[87]&&keyStatus[74]&&!keyStatus[65]&&!keyStatus[68]){
        shootType = 1
    }
    //左低
    if(!keyStatus[87]&&keyStatus[74]&&keyStatus[65]&&!keyStatus[68]){
        shootType = 2
    }
    //右低
    if(!keyStatus[87]&&keyStatus[74]&&!keyStatus[65]&&keyStatus[68]){
        shootType = 3
    }
    //左高
    if(keyStatus[87]&&keyStatus[74]&&keyStatus[65]&&!keyStatus[68]){
        shootType = 4
    }
    //右高
    if(keyStatus[87]&&keyStatus[74]&&!keyStatus[65]&&keyStatus[68]){
        shootType = 5
    }

}

function stop(e){
    keyStatus[e.keyCode] = false
    switch(e.keyCode){
        case 74:
            shoot(shootType)
        break;

    } 
}

var strongShow,strongCol,strongLength

function long(){
    setTimeout(function(){
        if(strong>14){
            return
        }
        else{
            strong += 1
            scene.remove(strongLength);
            strongShow = new THREE.BoxGeometry(0.01, 0.01, strong/100);
            strongCol = new THREE.MeshBasicMaterial({color: 'yellow'});
            strongLength = new THREE.Mesh(strongShow, strongCol);
            //设置立方体的位置
            strongLength.position.x = 0;
            strongLength.position.y = -0.2;
            strongLength.position.z = strong/200;      
            scene.add(strongLength);
        }
    },100)
}

function short(){
    setTimeout(function(){
        if(strong<2){
            return
        }
        else{
            strong -= 1
            if(strong == 1){
                lock = false
            }      
            scene.remove(strongLength);
            strongShow = new THREE.BoxGeometry(0.01, 0.01, strong/100);
            strongCol = new THREE.MeshBasicMaterial({color: 'yellow'});
            strongLength = new THREE.Mesh(strongShow, strongCol);
            //设置立方体的位置
            strongLength.position.x = 0;
            strongLength.position.y = -0.2;
            strongLength.position.z = strong/200;      
            scene.add(strongLength);
        }
    },100)
}

function left(){
    let moveL=setInterval(function(){
        cube.position.y += 0.02;
        if(cube.position.y >= 0.6){
            clearInterval(moveL)
            right()
        }
        if(goal){
            clearInterval(moveL)
        }
    },100)
}

function right(){
    let moveR = setInterval(function(){
        cube.position.y -= 0.02;
        if(cube.position.y <= -0.6){
            clearInterval(moveR)
            left()
        }
        if(goal){
            clearInterval(moveR)
        }
    },100)
}

function shoot(type){
    if(type == 0){
        let shootBall = setInterval(function(){
            time = time + 0.5
            if(time == strong){
                clearInterval(shootBall)
            }
            sphere.rotation.x += 1;
            sphere.position.x += strong/100;
            if(sphere.position.x >1 && sphere.position.x <1.3&& sphere.position.z < 0.2 && sphere.position.y>cube.position.y-0.3 && sphere.position.y<cube.position.y+0.3){
                goalStop(shootBall)
            }
        },100)
    }
    if(type == 1){
        let shootBall = setInterval(function(){
            time = time + 0.5
            if(time == strong){
                clearInterval(shootBall)
            }
            sphere.rotation.x += 1;
            sphere.position.x += strong/100;
            sphere.position.z += strong/700;
            if(sphere.position.x >1 && sphere.position.x <1.3&& sphere.position.z < 0.2 && sphere.position.y>cube.position.y-0.3 && sphere.position.y<cube.position.y+0.3){
                goalStop(shootBall)
            }
        },100)
    }
    if(type == 2){
        let shootBall = setInterval(function(){
            time = time + 0.5
            if(time == strong){
                clearInterval(shootBall)
            }
            sphere.rotation.x += 1;
            sphere.position.x += strong/100;
            sphere.position.y += strong/200;
            if(sphere.position.x >1 && sphere.position.x <1.3&& sphere.position.z < 0.2 && sphere.position.y>cube.position.y-0.3 && sphere.position.y<cube.position.y+0.3){
                goalStop(shootBall)
            }
        },100)
    }
    if(type == 3){
        let shootBall = setInterval(function(){
            time = time + 0.5
            if(time == strong){
                clearInterval(shootBall)
            }
            sphere.rotation.x += 1;
            sphere.position.x += strong/100;
            sphere.position.y -= strong/200;
            if(sphere.position.x >1 && sphere.position.x <1.3&& sphere.position.z < 0.2 && sphere.position.y>cube.position.y-0.3 && sphere.position.y<cube.position.y+0.3){
                goalStop(shootBall)
            }
        },100)
    }
    if(type == 4){
        let shootBall = setInterval(function(){
            time = time + 0.5
            if(time == strong){
                clearInterval(shootBall)
            }
            sphere.rotation.x += 1;
            sphere.position.x += strong/100;
            sphere.position.z += strong/700;
            sphere.position.y += strong/200;
            if(sphere.position.x >1 && sphere.position.x <1.3&& sphere.position.z < 0.2 && sphere.position.y>cube.position.y-0.3 && sphere.position.y<cube.position.y+0.3){
                goalStop(shootBall)
            }
        },100)
    }
    if(type == 5){
        let shootBall = setInterval(function(){
            time = time + 0.5
            if(time == strong){
                clearInterval(shootBall)
            }
            sphere.rotation.x += 1;
            sphere.position.x += strong/100;
            sphere.position.z += strong/700;
            sphere.position.y -= strong/200;
            if(sphere.position.x >1 && sphere.position.x <1.3&& sphere.position.z < 0.2 && sphere.position.y>cube.position.y-0.3 && sphere.position.y<cube.position.y+0.3){
                goalStop(shootBall)
            }
        },100)
    }
}

function goalStop(shootBall){
    clearInterval(shootBall)
    goal = true
    document.getElementById('goal').style.display = 'block';
}


render()
animate();