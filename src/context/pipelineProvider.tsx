import React, {
  useContext,
  createContext,
  useState,
  ReactNode
} from "react";



interface PipelineContextType {
    
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

interface PipelineProviderProps {
  children: ReactNode;
}

// provider
const PipelineProvider: React.FC<PipelineProviderProps> = ({ children }) => {

  
  return (
    <PipelineContext.Provider
      value={{
        
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};

export default PipelineProvider;

// hook
export const usePipeline = (): PipelineContextType => {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error("usePipeline must be used within PipelineProvider");
  }
  return context;
};
