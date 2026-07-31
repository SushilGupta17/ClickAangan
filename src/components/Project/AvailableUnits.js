import React, {useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Chip from '../Chip';
import styles from '../../styles/AddPropertyStyle';
import { formatPrice } from '../../helpers/priceHelper';

const unitTypes = [
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4 BHK',
  '5 BHK',
  'Villa',
  'Plot',
  'Office',
  'Shop',
];

const AvailableUnits = ({
  property,
  setProperty,
}) => {

  const update = (value) => {
    setProperty('availableUnits', value);
  };

  const addUnit = () => {

    const data = [...(property.availableUnits || [])];

    data.push({
      unitType: '',
      area: '',
      price: '',
    });

    update(data);

  };

  const removeUnit = index => {

    let data = [...property.availableUnits];

    data.splice(index, 1);

    update(data);

  };

  const updateUnit = (index, key, value) => {

    let data = [...property.availableUnits];

    data[index][key] = value;

    update(data);

  };

  return (

    <View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        }}>

        <Text style={styles.title}>
          Available Units
        </Text>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={addUnit}>

          <Text style={styles.nextText}>
            + Add Unit
          </Text>

        </TouchableOpacity>

      </View>

      {(property.availableUnits || []).map((item, index) => (

        <View
          key={index}
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            padding: 12,
            marginBottom: 15,
          }}>

          <Text
            style={{
              fontWeight: '600',
              marginBottom: 10,
            }}>

            Unit {index + 1}

          </Text>

          <Text
            style={{
              marginBottom: 8,
            }}>

            Unit Type

          </Text>

          <View style={styles.rowWrap}>

            {unitTypes.map(type => (

              <Chip
                key={type}
                label={type}
                selected={item.unitType === type}
                onPress={() =>
                  updateUnit(index, 'unitType', type)
                }
              />

            ))}

          </View>

          <TextInput
            style={[
              styles.input,
              {marginTop: 12},
            ]}
            placeholder="Area (Sq Ft)"
              placeholderTextColor="#999"
            keyboardType="numeric"
            value={item.area}
            onChangeText={text =>
              updateUnit(index, 'area', text)
            }
          />

         
                    

          <TextInput
            style={[
              styles.input,
              {marginTop: 12},
            ]}
            placeholder="Price"
              placeholderTextColor="#999"
            keyboardType="numeric"
            value={item.price}
            onChangeText={text =>
              updateUnit(index, 'price', text)
            }
          />

   {item.price ? (
                      <Text
                        style={{
                          marginTop: 8,
                          color: '#0A7C3B',
                          fontSize: 14,
                          fontWeight: '600',
                        }}>
                        ₹ {formatPrice(item.price)}
                      </Text>
                    ) : null}
                           
          <TouchableOpacity
            onPress={() => removeUnit(index)}
            style={{
              marginTop: 15,
              alignSelf: 'flex-end',
            }}>

  

            <Text
              style={{
                color: 'red',
                fontWeight: '600',
              }}>

              Delete

            </Text>

          </TouchableOpacity>

        </View>

      ))}

    </View>

  );

};

export default React.memo(AvailableUnits);