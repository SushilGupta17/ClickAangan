import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ProductCard = ({ item }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.title}>
        {item.name}
      </Text>

      <View style={styles.row}>
        <Text style={styles.oldPrice}>
          {item.oldPrice}
        </Text>

        <Text style={styles.price}>
          {item.price}
        </Text>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>
          Add To Cart
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },

  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },

  title: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    marginTop: 5,
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    marginRight: 10,
    color: 'gray',
  },

  price: {
    color: 'green',
    fontWeight: 'bold',
  },

  btn: {
    backgroundColor: '#000',
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
});