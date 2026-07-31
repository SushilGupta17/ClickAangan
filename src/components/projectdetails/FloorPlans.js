import React from 'react';

import {

FlatList,
Image,
TouchableOpacity,
StyleSheet

} from 'react-native';

const FloorPlans=({floorPlans=[]})=>{

const renderItem=({item})=>(

<TouchableOpacity>

<Image

source={{uri:item.image}}

style={styles.image}

/>

</TouchableOpacity>

)

return(

<FlatList

horizontal

data={floorPlans}

renderItem={renderItem}

showsHorizontalScrollIndicator={false}

contentContainerStyle={styles.container}

/>

)

}

export default FloorPlans;

const styles=StyleSheet.create({

container:{

paddingHorizontal:15,

paddingBottom:20

},

image:{

width:280,

height:180,

borderRadius:15,

marginRight:15

}

});