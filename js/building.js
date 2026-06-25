(function initBuildingScene() {
    const canvas = document.getElementById('building-canvas');
    const section = document.getElementById('projects');
    
    if (!canvas || !section) return;

    let scene, camera, renderer, buildingGroup;
    let initialized = false;
    let animationId;

    // 1. Wait for scroll position to be near projects section before initializing
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !initialized) {
                initTHREE();
                initialized = true;
                observer.disconnect(); // Only need to init once
            }
        });
    }, { rootMargin: '200px' }); // start a bit before it enters the viewport

    observer.observe(section);

    function initTHREE() {
        // Quick WebGL check just in case
        try {
            const testCtx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!testCtx) return;
        } catch (e) {
            return;
        }

        const width = canvas.parentElement.offsetWidth * 0.5;
        const height = canvas.parentElement.offsetHeight;

        // 2. Scene setup
        scene = new THREE.Scene();
        
        // 5. Camera
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
        camera.position.set(0, 2, 18);
        camera.lookAt(0, 2, 0);

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 3. Build the building model (Group of wireframe boxes)
        buildingGroup = new THREE.Group();

        // Base platform
        const base = new THREE.BoxGeometry(6, 0.5, 4);
        const baseEdges = new THREE.EdgesGeometry(base);
        const baseLine = new THREE.LineSegments(baseEdges, 
            new THREE.LineBasicMaterial({ color: 0xB8955A }) // --gold
        );
        baseLine.position.y = 0;
        buildingGroup.add(baseLine);

        // Main tower
        const tower = new THREE.BoxGeometry(2.5, 8, 2);
        const towerEdges = new THREE.EdgesGeometry(tower);
        const towerLine = new THREE.LineSegments(towerEdges,
            new THREE.LineBasicMaterial({ color: 0xB8955A }) // --gold
        );
        towerLine.position.set(-0.5, 4.25, 0);
        buildingGroup.add(towerLine);

        // Secondary tower
        const tower2 = new THREE.BoxGeometry(1.5, 5, 1.5);
        const tower2Edges = new THREE.EdgesGeometry(tower2);
        const tower2Line = new THREE.LineSegments(tower2Edges,
            new THREE.LineBasicMaterial({ color: 0xD4AF72 }) // --gold-light
        );
        tower2Line.position.set(2, 2.75, 0.5);
        buildingGroup.add(tower2Line);

        // Horizontal slab (floor plate detail)
        const slab = new THREE.BoxGeometry(4, 0.2, 2.5);
        const slabEdges = new THREE.EdgesGeometry(slab);
        const slabLine = new THREE.LineSegments(slabEdges,
            new THREE.LineBasicMaterial({ color: 0xC4B9A8, opacity: 0.5, transparent: true }) // --stone
        );
        slabLine.position.set(0, 2, 0);
        buildingGroup.add(slabLine);

        buildingGroup.rotation.y = Math.PI / 8; // slight initial angle
        buildingGroup.position.set(0, -2, 0);
        scene.add(buildingGroup);

        // 4. Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dirLight = new THREE.DirectionalLight(0xFFF5E0, 1.2);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        // 6. Scroll-driven rotation
        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            const denominator = rect.height - window.innerHeight;
            
            // Prevent division by zero or negative if section is smaller than viewport
            const effectiveDenominator = denominator > 0 ? denominator : 1; 
            
            const progress = Math.max(0, Math.min(1, -rect.top / effectiveDenominator));
            
            buildingGroup.rotation.y = (Math.PI / 8) + (progress * Math.PI * 2);
            buildingGroup.rotation.x = progress * 0.3;
        });

        // Handle window resize dynamically
        window.addEventListener('resize', () => {
            const newWidth = canvas.parentElement.offsetWidth * 0.5;
            const newHeight = canvas.parentElement.offsetHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        });

        // 7. Animate loop
        function animateBuilding() {
            animationId = requestAnimationFrame(animateBuilding);
            renderer.render(scene, camera);
        }
        animateBuilding();
    }

    // Expose cleanup function
    window.disposeBuildingScene = () => {
        if (!initialized) return;
        if (animationId) cancelAnimationFrame(animationId);
        
        if (buildingGroup) {
            buildingGroup.children.forEach(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
        
        if (renderer) renderer.dispose();
    };
})();
