(function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    try {
        const testCtx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!testCtx) throw new Error('no webgl');
    } catch(e) {
        document.body.classList.add('no-webgl');
        return; // exit script entirely
    }

    const count = window.innerWidth < 768 ? 0 : window.innerWidth < 1024 ? 800 : 2000;
    if (count === 0) {
        document.body.classList.add('no-webgl');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const initialPositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        // x in -40 to 40, y in -20 to 20, z in -20 to 20
        initialPositions[i * 3] = (Math.random() - 0.5) * 80;
        initialPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        initialPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

        velocities[i * 3] = 0.001 + Math.random() * 0.002;
        velocities[i * 3 + 1] = 0.001 + Math.random() * 0.002;
        velocities[i * 3 + 2] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));

    const material = new THREE.PointsMaterial({ 
        size: 0.15, 
        color: 0xFDFBF8, 
        transparent: true, 
        opacity: 0.65 
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 4;
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);

        const positions = geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            positions[i * 3] += velocities[i * 3];       // x drift
            positions[i * 3 + 1] += velocities[i * 3 + 1];   // y drift
            
            // wrap around if out of bounds
            if (positions[i * 3] > 40) positions[i * 3] = -40;
            if (positions[i * 3 + 1] > 20) positions[i * 3 + 1] = -20;
        }
        geometry.attributes.position.needsUpdate = true;

        target.x += (mouse.x - target.x) * 0.05;
        target.y += (mouse.y - target.y) * 0.05;
        camera.position.x = target.x;
        camera.position.y = target.y;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.disposeHeroScene = () => {
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
})();
