import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import Animated,{
FadeInDown,
} from 'react-native-reanimated';
import { formatPrice } from '../../helpers/priceHelper';
import styles from '../../styles/AddPropertyStyle';
import {addProperty} from '../../services/PropertyService';

const PropertySummaryTab=({

property,

previousTab,

})=>{

const [loading,setLoading]=useState(false);


const submitProperty=async()=>{

try{

setLoading(true);

const formData=new FormData();

formData.append(
'ListingType',
property.listingType,
);

formData.append(
'Category',
property.category,
);

formData.append(
'Purpose',
property.purpose,
);

formData.append(
'PropertyType',
property.propertyType,
);

formData.append(
'Title',
property.title,
);

formData.append(
'Description',
property.description,
);

formData.append(
'Price',
property.price,
);

formData.append(
'Area',
property.area,
);

formData.append(
'State',
property.state,
);

formData.append(
'City',
property.city,
);

formData.append(
  'Location',
  `${property.locality || ''}, ${property.city || ''}, ${property.state || ''}`
    .replace(/^,\s*|,\s*$/g, '')
    .replace(/,\s*,/g, ',')
);

formData.append(
'Locality',
property.locality,
);

formData.append(
'Landmark',
property.landmark,
);

formData.append(
'NearBy',
property.nearBy,
);

formData.append(
'Latitude',
property.latitude,
);

formData.append(
'Longitude',
property.longitude,
);

formData.append(
'Bedrooms',
property.bedrooms,
);

formData.append(
'Bathrooms',
property.bathrooms,
);

formData.append(
'Amenities',
JSON.stringify(property.amenities),
);

formData.append(
'OwnerName',
property.ownerName,
);

formData.append(
'OwnerMobile',
property.ownerMobile,
);

formData.append(
'OwnerEmail',
property.ownerEmail,
);

formData.append(
'BrokerName',
property.brokerName,
);

formData.append(
'BrokerCompany',
property.brokerCompany,
);

formData.append(
'BrokerMobile',
property.brokerMobile,
);

formData.append(
'BrokerEmail',
property.brokerEmail,
);

formData.append(
'BrokerRera',
property.brokerRera,
);

formData.append(
'BuilderName',
property.builderName,
);

formData.append(
'ProjectName',
property.projectName,
);

formData.append(
'ProjectStatus',
property.projectStatus,
);

formData.append(
'ReraNumber',
property.reraNumber,
);

formData.append(
'PossessionDate',
property.possessionDate,
);

formData.append(
'VideoUrl',
property.videoUrl,
);

property.images.forEach((img,index)=>{

formData.append(

'Images',

{

uri:img.uri,

name:
img.fileName ||
`image_${index}.jpg`,

type:
img.type ||
'image/jpeg',

},

);

});

if(property.brochure){

formData.append(

'Brochure',

{

uri:property.brochure.uri,

name:property.brochure.name,

type:property.brochure.type,

},

);

}

const res=

await addProperty(formData);

Alert.alert(

'Success',

'Property Added Successfully'

);

}
catch(e){

Alert.alert(

'Error',

e.message,

);

}
finally{

setLoading(false);

}

};

const Item=(title,value)=>(

<View style={styles.summaryRow}>

<Text style={styles.summaryLabel}>

{title}

</Text>

<Text style={styles.summaryValue}>

{value || '--'}

</Text>

</View>

);

return(

<Animated.ScrollView

entering={FadeInDown}

contentContainerStyle={{

padding:15,

paddingBottom:140,

}}>

<View style={styles.card}>

<Text style={styles.summaryHeading}>

Review Property

</Text>

{Item(
'Listing',
property.listingType,
)}

{Item(
'Category',
property.category,
)}

{Item(
'Purpose',
property.purpose,
)}

{Item(
'Type',
property.propertyType,
)}

{Item(
'Title',
property.title,
)}

{Item(
'Price',
formatPrice(property.price),
)}

{Item(
'Area',
property.area,
)}



{Item(
'City',
property.city,
)}

{Item(
'Locality',
property.locality,
)}

{Item(
'Images',
property.images.length,
)}

</View>

<View

style={{

flexDirection:'row',

justifyContent:'space-between',

marginTop:25,

}}>

<TouchableOpacity

style={styles.previousButton}

onPress={previousTab}>

<Text style={styles.previousText}>

← Previous

</Text>

</TouchableOpacity>

<TouchableOpacity

style={styles.submitButton}

onPress={submitProperty}

disabled={loading}>

{

loading ?

<ActivityIndicator

color="#fff"

/>

:

<Text

style={styles.submitText}>

Submit Property

</Text>

}

</TouchableOpacity>

</View>

</Animated.ScrollView>

);

};

export default React.memo(PropertySummaryTab);