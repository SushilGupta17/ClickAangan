// =======================================
// Required
// =======================================

export const isEmpty = value => {
  if (value === null || value === undefined) {
    return true;
  }

  return value.toString().trim() === '';
};

// =======================================
// Mobile
// =======================================

export const isValidMobile = mobile => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(mobile);
};

// =======================================
// Email
// =======================================

export const isValidEmail = email => {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

// =======================================
// RERA
// =======================================

export const isValidRera = rera => {

  if (!rera)
    return true;

  return rera.trim().length >= 6;

};

// =======================================
// Youtube URL
// =======================================

export const isValidYoutube = url => {

  if (!url)
    return true;

  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be')
  );

};

// =======================================
// Price
// =======================================

export const isValidPrice = value => {

  return Number(value) > 0;

};

// =======================================
// Area
// =======================================

export const isValidArea = value => {

  return Number(value) > 0;

};

// =======================================
// Property Validation
// =======================================

export const validateProperty = property => {

  if (isEmpty(property.listingType))
    return 'Select Listing Type';

  if (isEmpty(property.category))
    return 'Select Property Category';

  if (isEmpty(property.purpose))
    return 'Select Purpose';

  if (isEmpty(property.propertyType))
    return 'Select Property Type';

  if (isEmpty(property.title))
    return 'Enter Property Title';

  if (isEmpty(property.description))
    return 'Enter Property Description';

  if (!isValidPrice(property.price))
    return 'Enter Valid Price';

  if (!isValidArea(property.area))
    return 'Enter Valid Area';

  if (isEmpty(property.city))
    return 'Enter City';

  if (isEmpty(property.locality))
    return 'Enter Locality';

  if (
    property.category === 'Residential' &&
    isEmpty(property.bedrooms)
  )
    return 'Select Bedrooms';

  if (
    property.category === 'Residential' &&
    isEmpty(property.bathrooms)
  )
    return 'Select Bathrooms';

  // Owner
  if (property.listingType === 'Owner') {

    if (isEmpty(property.ownerName))
      return 'Enter Owner Name';

    if (!isValidMobile(property.ownerMobile))
      return 'Enter Valid Owner Mobile';

    if (!isValidEmail(property.ownerEmail))
      return 'Enter Valid Owner Email';

  }

  // Broker
  if (property.listingType === 'Broker') {

    if (isEmpty(property.brokerName))
      return 'Enter Broker Name';

    if (isEmpty(property.brokerCompany))
      return 'Enter Company Name';

    if (!isValidMobile(property.brokerMobile))
      return 'Enter Valid Broker Mobile';

    if (!isValidEmail(property.brokerEmail))
      return 'Enter Valid Broker Email';

    if (!isValidRera(property.brokerRera))
      return 'Enter Valid RERA Number';

  }

  // Project
  if (property.listingType === 'Project') {

    if (isEmpty(property.builderName))
      return 'Enter Builder Name';

    if (isEmpty(property.projectName))
      return 'Enter Project Name';

    if (isEmpty(property.projectStatus))
      return 'Select Project Status';

    if (!isValidRera(property.reraNumber))
      return 'Enter Valid RERA Number';

    if (
      !isValidYoutube(property.videoUrl)
    )
      return 'Enter Valid YouTube URL';

  }

  if (property.images.length === 0)
    return 'Select Property Images';

  return '';

};

// =======================================
// Export
// =======================================

export default {

  isEmpty,

  isValidMobile,

  isValidEmail,

  isValidPrice,

  isValidArea,

  isValidYoutube,

  isValidRera,

  validateProperty,

};
