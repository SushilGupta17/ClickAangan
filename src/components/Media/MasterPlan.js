import React, {useState } from 'react';

import SingleImagePicker from '../Media/Common/SingleImagePicker';

const MasterPlan = ({property, setProperty}) => {

  return (

    <SingleImagePicker
      title="Master Plan"
      image={property.masterPlan}
      propertyKey="masterPlan"
      setProperty={setProperty}
    />

  );

};

export default React.memo(MasterPlan);