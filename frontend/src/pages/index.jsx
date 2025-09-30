import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;

    // Dynamically import Three.js only on client side
    import("three").then((THREE) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.position.z = 5;

      // Create floating particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 1200;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x7873f5,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particlesMesh = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );
      scene.add(particlesMesh);

      // Create rotating torus
      const torusGeometry = new THREE.TorusGeometry(1.8, 0.08, 16, 100);
      const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6ec4,
        emissive: 0xff6ec4,
        emissiveIntensity: 0.4,
        wireframe: true,
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.position.x = 3;
      torus.position.y = 0.5;
      scene.add(torus);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x7873f5, 1.5);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const pointLight2 = new THREE.PointLight(0xff6ec4, 1.5);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      // Mouse movement effect
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Animation loop
      let animationId;
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;

        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
      };
    });
  }, []);

  return (
    <>
      <Head>
        <title>Connect with Friends - Social Platform</title>
        <meta
          name="description"
          content="A True Social media platform, with stories no bluffs!"
        />
      </Head>

      <canvas ref={canvasRef} className={styles.threeCanvas} />

      <div className={styles.container}>
        {/* Animated gradient orbs */}
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>

        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p className={styles.mainHeading}>
              Connect with Friends without hesitation
            </p>
            <p className={styles.subHeading}>
              A True Social media platform, with stories no bluffs!
            </p>

            {/* Feature tags */}
            <div className={styles.featureTags}>
              <span className={styles.tag}>Authentic Stories</span>
              <span className={styles.tag}>Real Connections</span>
              <span className={styles.tag}>Zero Drama</span>
            </div>

            <div
              onClick={() => {
                router.push("/login");
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={styles.buttonJoin}
            >
              <p>Join Now</p>
              <svg
                className={`${styles.arrow} ${
                  isHovered ? styles.arrowHover : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>

          <div className={styles.mainContainer__right}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageGlow}></div>
              <img
                src="images/content-media.gif"
                alt="Social platform preview"
                className={styles.mainImage}
              />
            </div>

            {/* Decorative circles */}
            <div className={styles.decorativeCircle1}></div>
            <div className={styles.decorativeCircle2}></div>
          </div>
        </div>
      </div>
    </>
  );
}
