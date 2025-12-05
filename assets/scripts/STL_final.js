import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

let scene, camera, renderer, orbitControls, transformControls, gridHelper;
let objects = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let measurementPoints = [], measurementMarkers = [], isMeasuring = false;
let isDarkMode = false;

document.getElementById('start-app-btn').addEventListener('click', () => {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
    onWindowResize();
});

document.getElementById('theme-btn').addEventListener('click', toggleTheme);

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('theme-btn').innerText = isDarkMode ? '☀️' : '🌙';

    if(scene) {
        scene.background.set(isDarkMode ? 0x171923 : 0xf5f7fa);
        scene.fog.color.set(isDarkMode ? 0x171923 : 0xf5f7fa);
        gridHelper.material.color.set(isDarkMode ? 0x2d3748 : 0xcbd5e0);
        gridHelper.material.opacity = isDarkMode ? 0.5 : 1;
    }
}

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    scene.fog = new THREE.Fog(0xf5f7fa, 300, 1000);

    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    camera = new THREE.PerspectiveCamera(45, (window.innerWidth - sidebarWidth) / window.innerHeight, 0.1, 2000);
    camera.position.set(120, 120, 160);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - sidebarWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('viewer-container').appendChild(renderer.domElement);

    gridHelper = new THREE.GridHelper(300, 30, 0xcbd5e0, 0xe2e8f0);
    scene.add(gridHelper);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(80, 120, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', (e) => orbitControls.enabled = !e.value);
    transformControls.addEventListener('mouseUp', updateGlobalStats);
    scene.add(transformControls);

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    document.getElementById('material-select').addEventListener('change', updateGlobalStats);
    document.getElementById('print-speed').addEventListener('input', updateGlobalStats);
    setupUIListeners();
}

function onWindowResize() {
    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    const w = window.innerWidth - sidebarWidth;
    camera.aspect = w / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(w, window.innerHeight);
}

const loader = new STLLoader();
const materialStandard = new THREE.MeshPhysicalMaterial({ 
    color: 0x3a7bd5, metalness: 0.1, roughness: 0.4, clearcoat: 0.6 
});

function handleFileUpload(e) {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const geo = loader.parse(event.target.result);
            geo.center(); addMeshToScene(geo);
        } catch(err) { alert("Erreur fichier"); }
    };
    if(reader.readAsArrayBuffer) reader.readAsArrayBuffer(file);
    e.target.value = '';
}

function addMeshToScene(geo, pos = null) {
    const mesh = new THREE.Mesh(geo, materialStandard.clone());
    mesh.castShadow = true; mesh.receiveShadow = true;
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3(); box.getSize(size);
    mesh.position.y = size.y / 2;
    if(pos) mesh.position.copy(pos);
    scene.add(mesh); objects.push(mesh);
    selectObject(mesh);
    document.getElementById('controls-section').style.display = 'block';
    document.getElementById('analysis-section').style.display = 'block';
    updateGlobalStats();
}

function selectObject(mesh) {
    if(isMeasuring) return;
    transformControls.detach();
    objects.forEach(o => o.material.emissive.setHex(0x000000));
    if(mesh) {
        transformControls.attach(mesh);
        mesh.material.emissive.setHex(0x222222);
    }
}

function setupUIListeners() {
    const tBtn = document.getElementById('btn-translate');
    const rBtn = document.getElementById('btn-rotate');
    const sBtn = document.getElementById('btn-scale');
    function setTool(btn, mode) {
        [tBtn, rBtn, sBtn].forEach(b => b.classList.remove('btn-active-tool'));
        btn.classList.add('btn-active-tool'); transformControls.setMode(mode);
    }
    tBtn.onclick = () => setTool(tBtn, 'translate');
    rBtn.onclick = () => setTool(rBtn, 'rotate');
    sBtn.onclick = () => setTool(sBtn, 'scale');
    tBtn.click();

    document.getElementById('btn-center').onclick = () => {
        if(transformControls.object) {
            const box = new THREE.Box3().setFromObject(transformControls.object);
            const size = new THREE.Vector3(); box.getSize(size);
            transformControls.object.position.set(0, size.y/2, 0);
            updateGlobalStats();
        }
    };
    document.getElementById('btn-duplicate').onclick = () => {
        if(transformControls.object) {
            const newGeo = transformControls.object.geometry.clone();
            const off = 20 + Math.random()*20;
            addMeshToScene(newGeo, transformControls.object.position.clone().add(new THREE.Vector3(off,0,off)));
        }
    };
    const rulerBtn = document.getElementById('btn-ruler');
    rulerBtn.onclick = () => {
        isMeasuring = !isMeasuring;
        rulerBtn.innerHTML = isMeasuring ? "🛑 Arrêter" : "📏 Règle";
        document.getElementById('ruler-result').style.display = isMeasuring || measurementPoints.length>0 ? 'block' : 'none';
        if(isMeasuring) { transformControls.detach(); clearMeasurement(); document.getElementById('ruler-result').innerText = "Point 1..."; }
        else if(objects.length>0) selectObject(objects[objects.length-1]);
    };
}

function onMouseClick(event) {
    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    if(event.clientX < sidebarWidth) return;
    mouse.x = ((event.clientX - sidebarWidth) / (window.innerWidth - sidebarWidth)) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    if(!isMeasuring) {
        if(intersects.length>0) selectObject(intersects[0].object);
        else transformControls.detach();
        return;
    }
    if(intersects.length>0) addMeasurementMarker(intersects[0].point);
}

function addMeasurementMarker(point) {
    if(measurementPoints.length>=2) clearMeasurement();
    measurementPoints.push(point);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(1.5), new THREE.MeshBasicMaterial({color: 0xff7eb3}));
    marker.position.copy(point); scene.add(marker); measurementMarkers.push(marker);
    const div = document.getElementById('ruler-result');
    if(measurementPoints.length===1) div.innerText = "Point 2...";
    if(measurementPoints.length===2) {
        const d = measurementPoints[0].distanceTo(measurementPoints[1]);
        div.innerText = `Dist: ${d.toFixed(2)} mm`;
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(measurementPoints), new THREE.LineBasicMaterial({color: 0xff7eb3, linewidth: 2, depthTest: false}));
        line.renderOrder=999; scene.add(line); measurementMarkers.push(line);
    }
}
function clearMeasurement() {
    measurementPoints = []; measurementMarkers.forEach(m=>scene.remove(m)); measurementMarkers=[];
    document.getElementById('ruler-result').innerText = "";
}

function getSignedVolume(geo, mat) {
    const pos = geo.attributes.position;
    let vol = 0;
    const p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), p3 = new THREE.Vector3();
    for(let i=0; i<pos.count; i+=3) {
        p1.fromBufferAttribute(pos, i).applyMatrix4(mat);
        p2.fromBufferAttribute(pos, i+1).applyMatrix4(mat);
        p3.fromBufferAttribute(pos, i+2).applyMatrix4(mat);
        vol += p1.dot(p2.cross(p3)) / 6.0;
    }
    return Math.abs(vol);
}

function updateGlobalStats() {
    if(objects.length===0) return;
    let totalVolMm3 = 0;
    let box = new THREE.Box3();
    objects.forEach(o => {
        totalVolMm3 += getSignedVolume(o.geometry, o.matrixWorld);
        box.expandByObject(o);
    });
    const size = new THREE.Vector3(); box.getSize(size);
    const volCm3 = totalVolMm3 / 1000;
    
    const sel = document.getElementById('material-select');
    const opt = sel.options[sel.selectedIndex];
    const price = parseFloat(opt.dataset.price);
    const density = parseFloat(opt.dataset.density);
    
    const mass = volCm3 * density;
    const cost = (mass/1000) * price;
    
    let speed = parseFloat(document.getElementById('print-speed').value);
    if(isNaN(speed) || speed<=0) speed=1;
    
    const totalHours = (volCm3 / speed) + (objects.length * 0.05);
    
    const days = Math.floor(totalHours / 24);
    const remainingHours = Math.floor(totalHours % 24);
    const minutes = Math.round((totalHours - Math.floor(totalHours)) * 60);

    let timeString = "";
    if (days > 0) {
        timeString = `${days}j ${remainingHours}h ${minutes}min`;
    } else {
        timeString = `${remainingHours}h ${minutes}min`;
    }

    document.getElementById('obj-count').innerText = objects.length;
    document.getElementById('dims').innerText = `${size.x.toFixed(0)}x${size.y.toFixed(0)}x${size.z.toFixed(0)} mm`;
    document.getElementById('volume').innerText = volCm3.toFixed(2);
    document.getElementById('mass').innerText = mass.toFixed(1);
    document.getElementById('cost').innerText = cost.toFixed(2) + " €";
    document.getElementById('print-time').innerText = timeString;
}

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}
