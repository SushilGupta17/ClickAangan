import React, {useState } from 'react';

import MultiImagePicker from '../Media/Common/MultiImagePicker';

const ApartmentImages = ({property,setProperty}) => {

  return (

    <MultiImagePicker
      title="Apartment Images"
      images={property.apartmentImages}
      propertyKey="apartmentImages"
      setProperty={setProperty}
    />

  );

};

export default React.memo(ApartmentImages);