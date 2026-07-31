import React, {useState } from 'react';

import MultiImagePicker from '../Media/Common/MultiImagePicker';

const FloorPlans = ({property,setProperty}) => {

  return (

    <MultiImagePicker
      title="Floor Plans"
      images={property.floorPlans}
      propertyKey="floorPlans"
      setProperty={setProperty}
    />

  );

};

export default React.memo(FloorPlans);