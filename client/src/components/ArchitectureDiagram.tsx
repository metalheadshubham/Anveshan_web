import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Sparkles, Line, Float } from "@react-three/drei";
import * as THREE from "three";


// --- Types & Data ---

type NodeData = {
    id: string;
    label: string;
    sub?: string;
    position: [number, number, number];
    color: string;
    isBrain?: boolean; // Highlight for AI nodes
};

const NODES: NodeData[] = [
    // Input
    { id: "input", label: "INPUT SOURCE", sub: "Raw Stream", position: [-6, 0, 0], color: "#ffffff" },

    // Tiers (Curved formation)
    { id: "t0", label: "TIER 0", sub: "MD5 Hash", position: [-3, 2.5, 0], color: "#a1a1aa" },
    { id: "t1", label: "TIER 1", sub: "pHash", position: [-3, 1, 0], color: "#a1a1aa" },
    { id: "t2", label: "TIER 2", sub: "Near-Dup", position: [-3, -0.5, 0], color: "#10b981" }, // Active green
    { id: "t3", label: "TIER 3", sub: "Face AI", position: [-3, -2, 0], color: "#a1a1aa" },

    // AI Models (Center Cluster)
    { id: "insight", label: "INSIGHTFACE", position: [1, 2, 1], color: "#3b82f6", isBrain: true },
    { id: "buffalo", label: "BUFFALO-L", position: [1, 0, -1], color: "#3b82f6", isBrain: true },
    { id: "faiss", label: "FAISS IDX", sub: "Vector DB", position: [1, -1.5, 0.5], color: "#10b981", isBrain: true },

    // Output
    { id: "dash", label: "DASHBOARD", sub: "Analytics", position: [4, 0.5, 0], color: "#ffffff" },
    { id: "verified", label: "VERIFIED", sub: "Unique ID", position: [6.5, 0, 0], color: "#10b981" },
];

const CONNECTIONS = [
    ["input", "t0"], ["input", "t1"], ["input", "t2"], ["input", "t3"],
    ["t0", "insight"],
    ["t1", "buffalo"],
    ["t2", "faiss"], ["t2", "insight"],
    ["t3", "insight"], ["t3", "faiss"],
    ["insight", "faiss"], ["buffalo", "faiss"],
    ["faiss", "dash"],
    ["insight", "dash"],
    ["dash", "verified"]
];

// --- Components ---

function SceneNode({ data }: { data: NodeData }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;
        // Gentle rotation
        meshRef.current.rotation.x += 0.002;
        meshRef.current.rotation.y += 0.005;

        // Scale pulse on hover
        const scale = hovered ? 1.2 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group position={data.position}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    {data.isBrain ? (
                        <icosahedronGeometry args={[0.4, 1]} />
                    ) : (
                        <sphereGeometry args={[0.25, 32, 32]} />
                    )}
                    <meshStandardMaterial
                        color={data.color}
                        emissive={data.color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                        roughness={0.2}
                        metalness={0.8}
                        wireframe={data.isBrain}
                    />
                </mesh>

                {/* Glow Halo */}
                <mesh scale={[1.5, 1.5, 1.5]}>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshBasicMaterial color={data.color} transparent opacity={0.1} />
                </mesh>

                <Html distanceFactor={10} position={[0, -0.6, 0]} center style={{ pointerEvents: 'none' }}>
                    <div className={`flex flex-col items-center bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-70'}`}>
                        <span className="text-xs font-bold font-mono tracking-wider text-white">
                            {data.label}
                        </span>
                        {data.sub && (
                            <span className="text-[9px] font-sans text-white/50 tracking-wide">
                                {data.sub}
                            </span>
                        )}
                    </div>
                </Html>
            </group>
        </Float>
    );
}

function DataPacket({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
    const ref = useRef<THREE.Mesh>(null);
    const speed = 0.01 + Math.random() * 0.02;
    const [progress, setProgress] = useState(Math.random());

    useFrame(() => {
        if (!ref.current) return;
        const newProgress = (progress + speed) % 1;
        setProgress(newProgress);
        ref.current.position.lerpVectors(start, end, newProgress);

        // Pulse size
        const size = 0.08 + Math.sin(newProgress * Math.PI) * 0.05;
        ref.current.scale.setScalar(size);
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
    );
}

function Connection({ startId, endId }: { startId: string, endId: string }) {
    const startNode = NODES.find(n => n.id === startId)!;
    const endNode = NODES.find(n => n.id === endId)!;
    const start = new THREE.Vector3(...startNode.position);
    const end = new THREE.Vector3(...endNode.position);

    return (
        <group>
            <Line
                points={[start, end]}
                color={startNode.color}
                opacity={0.15}
                transparent
                lineWidth={1}
            />
            <DataPacket start={start} end={end} color={startNode.color} />
            {/* Add a second packet for busy connections */}
            {(startNode.isBrain || endNode.isBrain) && (
                <DataPacket start={start} end={end} color="#ffffff" />
            )}
        </group>
    );
}

function ResponsiveControls() {
    const { camera } = useThree();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                camera.position.set(0, 0, 14); // Zoom out for mobile
            } else {
                camera.position.set(0, 0, 8); // Default for desktop
            }
            camera.updateProjectionMatrix();
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [camera]);

    return null;
}

function GridFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial color="#222" wireframe transparent opacity={0.05} />
        </mesh>
    );
}

// --- Main Component ---

export function ArchitectureDiagram() {
    return (
        <div className="w-full h-[450px] relative bg-black/90 rounded-xl overflow-hidden border border-white/10 group">

            {/* Overlay UI */}
            <div className="absolute top-6 left-8 z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                    <div>
                        <div className="text-white/40 text-xs tracking-[0.2em] font-bold">LIVE_ENVIRONMENT</div>
                        <div className="text-white text-lg font-serif">Neural Architecture v2.0</div>
                    </div>
                </div>
            </div>

            <div className="absolute top-6 right-8 z-10 pointer-events-none text-right">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Cuda Cores Active</div>
                    <div className="text-2xl text-emerald-400 font-mono">1,024</div>
                </div>
            </div>

            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={["#030303"]} />
                <fog attach="fog" args={["#030303", 5, 20]} />

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4ade80" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />

                {/* Environment */}
                <Sparkles count={20} scale={12} size={2} speed={0.4} opacity={0.5} color="#fff" />
                <GridFloor />

                <ResponsiveControls />
                <group position={[0, 0, 0]}>
                    {/* Nodes */}
                    {NODES.map(node => (
                        <SceneNode key={node.id} data={node} />
                    ))}

                    {/* Connections */}
                    {CONNECTIONS.map(([start, end], i) => (
                        <Connection key={i} startId={start} endId={end} />
                    ))}
                </group>

                {/* Controls */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.8}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
        </div>
    );
}
