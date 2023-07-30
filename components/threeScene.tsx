'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeScene({x}: {x: number}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        if (!canvasRef.current) {
            console.log('Canvas element not found');
            return;
        }

        // Set up the Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight*x, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

        renderer.setSize(300, 200);

        const geometry = new THREE.BoxGeometry(2.5, 0.1, 1.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const base = new THREE.Mesh(geometry, material);

        const backscreenGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.5);
        const backscreenMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const backscreen = new THREE.Mesh(backscreenGeometry, backscreenMaterial);
        backscreen.position.set(0, 0.7, 0.5);
        backscreen.rotation.x = 1.2; 
        base.add(backscreen);

        // logo
        const circleGeometry = new THREE.CircleGeometry(0.3, 35);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xc9c9c9 });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(0, 0.7, 0.60);
        circle.rotation.x = -0.35;
        base.add(circle);


        const screenGeometry = new THREE.BoxGeometry(2.4, 0.01, 1.2);
        const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.7, 0.45); 
        screen.rotation.x = 1.2; 
        base.add(screen);

        const keyboardGeometry = new THREE.BoxGeometry(2.4, 0.1, 0.9);
        const keyboardMaterial = new THREE.MeshBasicMaterial({ color: 0xc9c9c9 });
        const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
        keyboard.position.set(0, 0.055, 0.3);
        base.add(keyboard);

        // trackpad

        const trackpadGeometry = new THREE.BoxGeometry(0.5, 0.05, 0.4);
        const trackpadMaterial = new THREE.MeshBasicMaterial({ color: 0xc9c9c9 });
        const trackpad = new THREE.Mesh(trackpadGeometry, trackpadMaterial);
        trackpad.position.set(0, 0.055, -0.45);
        base.add(trackpad);

        scene.add(base);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);

            base.rotation.x += 0.01;
            base.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.dispose();
            scene.remove(base);
        };
    }, [x]);

    return <canvas ref={canvasRef} />;
};
