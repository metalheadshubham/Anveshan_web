import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Types for our graph
interface Node {
    id: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    label: string;
    subLabel?: string;
    type: 'input' | 'tier' | 'ai' | 'dashboard' | 'output';
    delay: number;
}

export function NeuralTrace() {
    // --- Configuration ---

    // 1. Define Nodes according to User's Diagram
    const nodes: Node[] = [
        // Input (Left Center)
        { id: 'input', x: 10, y: 50, label: "INPUT FOLDER", subLabel: "1K-1M Images", type: 'input', delay: 0 },

        // Multi-Tier Detection (Top Middle Column)
        { id: 't0', x: 35, y: 15, label: "TIER 0", subLabel: "MD5 Hash", type: 'tier', delay: 0.2 },
        { id: 't1', x: 35, y: 32, label: "TIER 1", subLabel: "pHash", type: 'tier', delay: 0.3 },
        { id: 't2', x: 35, y: 49, label: "TIER 2", subLabel: "Near-Dup", type: 'tier', delay: 0.4 },
        { id: 't3', x: 35, y: 66, label: "TIER 3", subLabel: "Face AI", type: 'tier', delay: 0.5 },
        { id: 't4', x: 35, y: 83, label: "TIER 4", subLabel: "ORB Feat.", type: 'tier', delay: 0.6 },

        // AI Processing (Bottom Middle / Parallel Column - grouped closely to Tiers 3/4)
        // Actually, let's place them slightly offset to show "Processing Power" backing the tiers
        { id: 'ai0', x: 55, y: 15, label: "INSIGHTFACE", type: 'ai', delay: 0.5 },
        { id: 'ai1', x: 55, y: 32, label: "BUFFALO-L", type: 'ai', delay: 0.6 },
        { id: 'ai2', x: 55, y: 49, label: "FAISS IDX", type: 'ai', delay: 0.7 },
        { id: 'ai3', x: 55, y: 66, label: "TTA AUG", type: 'ai', delay: 0.8 },
        { id: 'ai4', x: 55, y: 83, label: "ADAPTIVE", subLabel: "GPU/CPU", type: 'ai', delay: 0.9 },

        // Results Dashboard (Right)
        { id: 'dash', x: 75, y: 50, label: "DASHBOARD", subLabel: "Similarity %", type: 'dashboard', delay: 1.0 },

        // Output (Far Right)
        { id: 'out', x: 92, y: 50, label: "VERIFIED", subLabel: "Unique", type: 'output', delay: 1.2 },
    ];

    // 2. Define Connections
    const connections = useMemo(() => {
        const links: { from: string, to: string }[] = [];

        // Input -> All Tiers (Waterfall logic)
        ['t0', 't1', 't2', 't3', 't4'].forEach(t => links.push({ from: 'input', to: t }));

        // Tiers -> AI (Logic: More complex tiers use more AI)
        links.push({ from: 't3', to: 'ai0' }); // Face AI -> InsightFace
        links.push({ from: 't3', to: 'ai1' }); // Face AI -> Buffalo
        links.push({ from: 't2', to: 'ai2' }); // NearDup -> FAISS
        links.push({ from: 't4', to: 'ai3' }); // ORB -> TTA
        links.push({ from: 't4', to: 'ai4' }); // ORB -> GPU

        // Inter-AI connections (Complex processing)
        links.push({ from: 'ai0', to: 'ai2' });
        links.push({ from: 'ai1', to: 'ai4' });

        // AI/Tiers -> Dashboard
        ['t0', 't1', 't2', 't3', 't4'].forEach(t => links.push({ from: t, to: 'dash' }));
        ['ai0', 'ai1', 'ai2', 'ai3', 'ai4'].forEach(ai => links.push({ from: ai, to: 'dash' }));

        // Dashboard -> Output
        links.push({ from: 'dash', to: 'out' });

        return links;
    }, []);

    // 3. Coordinate Helper
    const getNode = (id: string) => nodes.find(n => n.id === id)!;

    // 4. Particle Generation with Randomized Physics
    // We generate many particles, each with unique speed curves to simulate "momentum"
    const particles = useMemo(() => {
        return connections.flatMap((conn, i) => {
            // 2 particles per connection for density
            return [1, 2].map((_, j) => {
                const duration = 1.5 + Math.random() * 2; // Random duration 1.5s - 3.5s
                const weight = Math.random(); // 0-1, used for line thickness or opacity
                return {
                    key: `${conn.from}-${conn.to}-${i}-${j}`,
                    from: getNode(conn.from),
                    to: getNode(conn.to),
                    duration,
                    delay: Math.random() * 2, // Random start time
                    ease: Math.random() > 0.5 ? "easeInOut" : "circOut" // Varied easing
                };
            });
        });
    }, [connections]);

    return (
        <div className="relative w-full h-[500px] bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden font-sans select-none group">

            {/* Background Grid - Industrial Technical Look */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Container Label (Top Left) */}
            <div className="absolute top-4 left-4 text-xs font-mono text-white/40 tracking-widest border-l-2 border-emerald-500/50 pl-3">
                ANVESHAN_ARCHITECTURE_V2<br />
                <span className="text-emerald-500/80">LIVE_INFERENCE_STREAM</span>
            </div>

            {/* Main SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">

                {/* 1. Static Lines (Base Architecture) */}
                {connections.map((conn, i) => {
                    const from = getNode(conn.from);
                    const to = getNode(conn.to);
                    return (
                        <motion.line
                            key={`line-${i}`}
                            x1={`${from.x}%`} y1={`${from.y}%`}
                            x2={`${to.x}%`} y2={`${to.y}%`}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: from.delay }}
                        />
                    );
                })}

                {/* 2. Active Data Particles (The "Flow") */}
                {particles.map((p) => (
                    <motion.circle
                        key={p.key}
                        r="1.5"
                        fill="#fff"
                        initial={{ cx: `${p.from.x}%`, cy: `${p.from.y}%`, opacity: 0 }}
                        animate={{
                            cx: [`${p.from.x}%`, `${p.to.x}%`],
                            cy: [`${p.from.y}%`, `${p.to.y}%`],
                            opacity: [0, 1, 0] // Fade in -> solid -> fade out at destination
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: p.ease, // Varied easing for "momentum" feel
                            repeatDelay: Math.random() // Random pause between pulses
                        }}
                    />
                ))}
            </svg>

            {/* 3. HTML Nodes (Text Labels & Interactive Hover Feel) */}
            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-auto"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: node.delay, type: "spring" }}
                >
                    {/* Node Circle */}
                    <div className={`
            w-3 h-3 rounded-full mb-2 relative
            ${node.type === 'output' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-white/80'}
            ${node.type === 'ai' ? 'bg-blue-400/80' : ''}
          `}>
                        {/* Ping Effect */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-inherit"
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                        />
                    </div>

                    {/* Label */}
                    <div className="text-[10px] font-bold tracking-wider text-white/90 whitespace-nowrap bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">
                        {node.label}
                    </div>

                    {/* Sub-label */}
                    {node.subLabel && (
                        <div className="text-[8px] font-mono text-white/50 mt-0.5">
                            {node.subLabel}
                        </div>
                    )}
                </motion.div>
            ))}

            {/* Floating Processing Metrics */}
            <div className="absolute top-4 right-4 text-right space-y-3">
                {/* Metric 1 */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="bg-black/20 p-2 rounded border border-white/5 backdrop-blur-sm"
                >
                    <div className="text-[9px] text-white/40 font-mono mb-1">PROCESSED</div>
                    <div className="text-lg font-light text-white flex gap-1 items-baseline justify-end">
                        <RunningNumber n={8432} />
                        <span className="text-xs text-emerald-400">img</span>
                    </div>
                </motion.div>

                {/* Metric 2 */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    className="bg-black/20 p-2 rounded border border-white/5 backdrop-blur-sm"
                >
                    <div className="text-[9px] text-white/40 font-mono mb-1">AVG_CONFIDENCE</div>
                    <div className="text-lg font-light text-white text-right">99.8%</div>
                </motion.div>
            </div>

        </div>
    );
}

// Helper utility for animating numbers
function RunningNumber({ n }: { n: number }) {
    return (
        <motion.span
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
        >
            {n.toLocaleString()}
        </motion.span>
    );
}
