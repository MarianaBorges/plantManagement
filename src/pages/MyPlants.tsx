import React,{useState, useEffect} from "react";

import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Alert
} from 'react-native';

import {Load} from '../components/Load';
import {Header} from '../components/Header';
import {PlantCardSecundary} from '../components/PlantCardSecundary';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import waterdrop from '../assets/waterdrop.png';
import {PlantsProps, loadPlant, removePlant} from '../libs/storage';
import {formatDistance} from 'date-fns';
import {pt} from 'date-fns/locale';

export function MyPlants(){
  const [myPlants, setMyPlants] = useState<PlantsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWatered] = useState<string>();

  useEffect(()=>{
    async function loadStorageData() {
      const plantStoraged = await loadPlant();

      const nextTime = formatDistance(
        new Date(plantStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        {locale: pt}
      );

      setNextWatered(
        `Não esqueça de regar a ${plantStoraged[0].name} à ${nextTime}`
      );
      setMyPlants(plantStoraged);
      setLoading(false);
      console.log(myPlants.length);

    }

    loadStorageData();
  },[]);

  function handleRemove(plant: PlantsProps){
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`,[
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: async()=>{
          try {

            await removePlant(plant.id);

            setMyPlants((oldData)=>(
              oldData.filter((item)=> item.id != plant.id)
            ));

          } catch (error) {
            Alert.alert('Não foi possivel remover!');
            console.log(error);

          }
        }
      },
    ]);
  }

  if (loading) {
    return <Load />
  }
  return (
    <View style={styles.container}>

      <Header/>

      <View style={styles.spotlight}>
        <Image
          source={waterdrop}
          style={styles.spotlightImage}
        />
        <Text style={styles.spotlightText}>
          {nextWaterd}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsText}>
          Próximas Regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item)=> String(item.id)}
          renderItem={({item})=>(
            <PlantCardSecundary
              data={item}
              handleRemove={() => {handleRemove(item)}}
              />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flex:1}}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems:'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight:{
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage:{
    width: 60,
    height: 60,
  },
  spotlightText:{
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: 'justify',
  },
  plants:{
    flex: 1,
    width: '100%',
  },
  plantsText:{
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  }


});
