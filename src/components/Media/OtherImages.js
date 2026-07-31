import React, {useState } from 'react';

import MultiImagePicker from '../Media/Common/MultiImagePicker';

const OtherImages = ({property,setProperty}) => {

  return (

    <MultiImagePicker
      title="Other Images"
      images={property.otherImages}
      propertyKey="otherImages"
      setProperty={setProperty}
    />

  );

};

export default React.memo(OtherImages);