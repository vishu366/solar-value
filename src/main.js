import * as THREE from "three";
import {RGBELoader} from "three/addons/loaders/RGBELoader.js"
import gsap from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 9;

const hdri = new RGBELoader();
hdri.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rogland_moonlit_night_2k.hdr",
  function(hdritexture){
    hdritexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdritexture;
  }
)

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const radius = 1.2;
const segments = 64;
const textures = ["../csilla/color.png", "../earth/map.jpg", "../venus/map.jpg", "../volcanic/color.png"];
const orbitRadius = 3.5;
const spheres = new THREE.Group();

const spaheremesh = [];

for(let i = 0; i < 4; i++){
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({map: texture});
  const sphere = new THREE.Mesh(geometry, material);

  spaheremesh.push(sphere);

  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  spheres.add(sphere);
}

scene.add(spheres);

const starTexture = new THREE.TextureLoader().load("../stars.jpg");
starTexture.colorSpace = THREE.SRGBColorSpace;
const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture, 
  side: THREE.BackSide,
  opacity: 0.3,
  transparent: true
});
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);


let lastwheelCount = 0;
const throttleDelay = 2000;
let scrollTime = 0;

window.addEventListener("wheel", (event)=> {
  let currentTime = Date.now();

  if(currentTime - lastwheelCount >= throttleDelay){
    lastwheelCount = currentTime;

    const direction = event.deltaY > 0 ? "down": "up";
    scrollTime = (scrollTime +1) % 4;
    console.log(direction);


    const headings = document.querySelectorAll(".heading");
    gsap.to(headings, {
      y:`-=${100}%`,
      duration:1,
      ease: "power2.inOut"
    });

    gsap.to(spheres.rotation, {
      duration:1,
      y:`-=${Math.PI /2}`,
      ease: "power2.in"
    })


    if(scrollTime ===0){
      gsap.to(headings, {
        y:`0`,
        duration:1,
        ease: "power2.inOut"
      })
    }

  }
})





 

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  for(let i =0; i< spaheremesh.length; i++){
    const spahre = spaheremesh[i];
    spahre.rotation.y +=0.002;
  }
  renderer.render(scene, camera);
}

animate();