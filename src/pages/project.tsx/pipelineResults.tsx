import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { select } from "d3-selection";
import "d3-graphviz";
import { getPipelinePetriNet } from "../../api/pipeline";

export default function PipelineResults() {
    const nav = useNavigate();
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    const pipelineName = pathname.split("/")[5];
    const [dot, setDot] = useState("");

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        const fetchDot = async () => {
            try {
                if (!pipelineName) return;
                const orgDomainName = localStorage.getItem("domain") || "";
                const res = await getPipelinePetriNet(orgDomainName, pipelineName);
                setDot(res.data);
            } catch (err) {
                console.error("Failed to fetch PetriNet DOT:", err);
            }
        };

        fetchDot();
        const interval = setInterval(fetchDot, 5000);
        return () => clearInterval(interval);
    }, [pipelineName]);

    useEffect(() => {
        if (dot) {
            let modifiedDot = dot;

            // Inject rankdir=LR if not already present for horizontal layout
            if (!/rankdir\s*=\s*(LR|RL)/.test(dot)) {
                modifiedDot = dot.replace(
                    /digraph\s+[^{]+{/,
                    (match) => `${match}\nrankdir=LR;\ngraph [bgcolor=transparent];`
                );
            }

            (select("#graph") as any)
                .graphviz()
                .zoom(true)
                .fit(true)
                .width("100%")
                .height("100%")
                .renderDot(modifiedDot, () => {
                    // Make background transparent
                    select("#graph svg").style("background-color", "transparent");
                    select("#graph svg rect").attr("fill", "transparent");
                });
        }
    }, [dot]);

    return (
        <div className="h-full w-full flex justify-center items-center">
            {!dot ? <p className="text-gray-500 text-center w-full">Waiting for results...</p> : (
                <div
                    id="graph"
                    className="w-full h-full flex justify-center items-center overflow-hidden"
                ></div>
            )}

        </div>
    );
}
