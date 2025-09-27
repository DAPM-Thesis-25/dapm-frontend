import exp from "constants";
import axiosInstance from "./axiosInstance";

export interface DesignProcessingElement {
    templateID: string;
    configuration: any;
}

export interface DesignChannel {
    publisher: DesignProcessingElement;
    subscribers: Subscriber[];
}

export interface Subscriber {
    processingElement: DesignProcessingElement;
    portNumber: number;
}

export interface DesignPipeline {
    pipelineName: string;
    projectName: string;
    processingElements: DesignProcessingElement[];
    channels: DesignChannel[];
}

export interface ConfigureValidation{
    status: string;
    missingPermissions: any[];
}

export interface PipelineListItem {
  pipelineName: string;
  pipelinePhase: "VALIDATED" | "DRAFT" | "CONFIGURED" | "BUILT" | "EXECUTING" | "TERMINATED" ;
  processingElementIds: string[];
  projectName: string;
}

export const designPipeline = (orgDomainName: string, data: DesignPipeline) => 
    axiosInstance.post<any>(`/api/pipeline/validation/design-pipeline`, data,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const buildPipeline = (orgDomainName: string, pipelineName: string) => 
    axiosInstance.post<any>(`/api/build-pipeline?pipelineName=${pipelineName}`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const executePipeline = (orgDomainName: string, pipelineName: string) => 
    axiosInstance.post<any>(`/api/build-pipeline/execute?pipelineName=${pipelineName}`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const terminatePipeline = (orgDomainName: string, pipelineName: string) => 
    axiosInstance.post<any>(`/api/build-pipeline/terminate?pipelineName=${pipelineName}`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const checkConfigureStatusPipeline = (orgDomainName: string, pipelineName: string) => 
    axiosInstance.get<any>(`/api/pipeline/configuration?pipelineName=${pipelineName}/configuration-status`,
    { baseURL: `http://localhost:${orgDomainName}` } );

export const getPipelines = (orgDomainName: string, projectName: string) =>
  axiosInstance.get<PipelineListItem[]>(`/api/pipelines/${projectName}`, {
    baseURL: `http://localhost:${orgDomainName}`,
  });

export const getValidatedPipeline = (orgDomainName: string, pipelineName: string) => 
    axiosInstance.get<any>(`/api/pipeline/validation/${pipelineName}`,
    { baseURL: `http://localhost:${orgDomainName}` } );