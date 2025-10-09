
import { use, useEffect } from "react";
import AddPeButton from "../components/pePage/addPeButton";
import { usePE } from "../context/processingElementsProvider";
import orgprofile1 from "../imgs/org-profiles/organization-1.png"
import orgprofile2 from "../imgs/org-profiles/organization-2.png"
import orgprofile3 from "../imgs/org-profiles/organization-3.png"
import orgprofile4 from "../imgs/org-profiles/organization-4.png"
import orgprofile5 from "../imgs/org-profiles/organization-5.png"
import pe1 from "../imgs/pe-profiles/pe-1.png"
import pe2 from "../imgs/pe-profiles/pe-2.png"
import pe3 from "../imgs/pe-profiles/pe-3.png"
import pe4 from "../imgs/pe-profiles/pe-4.png"
import pe5 from "../imgs/pe-profiles/pe-5.png"

export default function ProcessingElements() {
    const pe = usePE();


    useEffect(() => {
        pe.getPes();
    }, [pe.loadingProcessingElement]);

    function randomeProfile() {
        const profiles = [pe1, pe2, pe3, pe4, pe5];
        const randomIndex = Math.floor(Math.random() * profiles.length);
        return profiles[randomIndex];
    }

    return (
        // lg:mt-[5%] sm:mt-[10%] mt-[12%]
        <div className="w-full h-screen overflow-y-auto pb-10 ">
            <div className="w-full bg-white md:p-7 p-5 shadow-md  flex justify-between">
                <h1 className="text-2xl font-semibold">Processing Elements</h1>
                {
                    <div className=""><AddPeButton /></div>
                }
            </div>
            {pe.processingElements && pe.processingElements.length > 0 && (
                <div className="px-3 mt-5">
                    <div className="w-full text-sm text-[#757575] mb-2">
                        Access to Processing Elements depends on your subscription tier.
                        You can only use external elements if your tier in the provider organization meets or exceeds the required level.
                    </div>

                    <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1   gap-6">
                        {pe.processingElements.map((processingElement) => (
                            <div
                                key={processingElement.templateId}
                                className="bg-white 2xl:p-5 p-3 h-40 flex items-center shadow-md rounded-md"
                            >
                                <img
                                    className="2xl:w-22 2xl:h-22 md:w-14 md:h-14 "
                                    src={randomeProfile()}
                                />
                                <div className="2xl:text- xl:text-lg 2xl:ml-2 ml-1">
                                    <p className="font-medium">
                                        {processingElement.templateId[0].toUpperCase()}{processingElement.templateId.slice(1)}
                                    </p>
                                    <p className="text-sm text-[#757575]">{processingElement.tier}</p>
                                    <p className="text-sm text-[#757575]">{processingElement.ownerOrganization}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            )}
        </div>
    )
}
