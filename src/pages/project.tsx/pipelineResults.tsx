import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { select } from "d3-selection";
import "d3-graphviz";
import * as d3 from "d3";
import { getPipelinePetriNet } from "../../api/pipeline";

export default function PipelineResults() {
    const nav = useNavigate();
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const pipelineName = pathname.split("/")[5];
    const [dot, setDot] = useState("");
    const graphContainerRef = useRef<HTMLDivElement | null>(null);
    const graphvizRef = useRef<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

useEffect(() => {
        let isVisible = !document.hidden;

        const fetchDot = async () => {
            try {
                if (!pipelineName || document.hidden) return;
                const orgDomainName = localStorage.getItem("domain") || "";
                const res = await getPipelinePetriNet(orgDomainName, pipelineName);
                setDot(res.data);
            } catch (err) {
                console.error("Failed to fetch PetriNet DOT:", err);
            }
        };

        fetchDot();
        intervalRef.current = setInterval(fetchDot, 3000);

        // Pause updates when tab is hidden
        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
            if (document.hidden) {
                // Pause polling when tab hidden
                if (intervalRef.current) clearInterval(intervalRef.current);
            } else {
                // Restart polling and fetch latest graph
                fetchDot();
                intervalRef.current = setInterval(fetchDot, 3000);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [pipelineName]);

    useEffect(() => {
        // Ensure the container exists before initializing Graphviz
        if (!graphContainerRef.current || !dot) return;

        // Initialize Graphviz only once
        if (!graphvizRef.current) {
            graphvizRef.current = (select(graphContainerRef.current) as any)
                .graphviz()
                .zoom(true)
                .fit(true)
                .width("100%")
                .height("100%")
                .transition(function () {
                    return d3.transition("main")
                        .duration(1000)
                        .ease(d3.easeLinear);
                });
        }

        let modifiedDot = dot;
        if (!/rankdir\s*=\s*(LR|RL)/.test(dot)) {
            modifiedDot = dot.replace(
                /digraph\s+[^{]+{/,
                (match) => `${match}\nrankdir=LR;\ngraph [bgcolor=transparent];`
            );
        }

        graphvizRef.current.renderDot(modifiedDot, () => {
            select(graphContainerRef.current)
                .select("svg")
                .style("background-color", "transparent")
                .select("rect")
                .attr("fill", "transparent");
        });
    }, [dot]);

    return (
        <div className="h-full w-full flex justify-center items-center">
            {!dot ? (
                <p className="text-gray-500 text-center w-full">Waiting for results...</p>
            ) : (
                <div
                    ref={graphContainerRef}
                    className="w-full h-full flex justify-center items-center overflow-hidden"
                />
            )}
        </div>
    );
}
