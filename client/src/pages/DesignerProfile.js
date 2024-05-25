import React, { useState } from 'react'

export const DesignerProfile = () => {
    const[designer, setDesigner]= useState([])


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/modelApi/models`);
          const modelsData = await response.json();
          setModels(modelsData);
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }, []);

    
  return (
    <div>
        
    </div>
  )
}

