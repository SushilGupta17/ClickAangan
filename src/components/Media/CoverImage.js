import React, {useState } from 'react';
import SingleImagePicker from '../Media/Common/SingleImagePicker';

const CoverImage = ({property, setProperty}) => {

  return (

    <SingleImagePicker
      title="Cover Image"
      image={property.coverImage}
      propertyKey="coverImage"
      setProperty={setProperty}
    />

  );

};

export default React.memo(CoverImage);