import Navbar from '@/components/Navbar';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {  
  SafeAreaView, 
} from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { mainLogger } from '../config/logger';

var homeLogger = mainLogger.extend('Home');
homeLogger.info('Home screen loaded');

export default function Index() {
  return (
    <SafeAreaView>
        <Navbar/>
        <CardGrid/>
     </SafeAreaView>
    
  );
}

const cardData = [
  {
    id: 1,
    name: "Card One",
    description: "This is a brief description of Card One."
  },
];

function CardGrid() {
  const router = useRouter();

  const handleCardPress = (cardData: string) => {
    homeLogger.info('Card pressed', cardData);
    router.push({
      pathname: "/detail",
      params: { cardData }
    });
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => handleCardPress('Card 1 Data')}>
        <Text style={styles.cardText}>Who-Is-It?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    padding: 5,
    margin: 5,
    height: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  card:{
    width: '30%',
    height: '100%',
    backgroundColor: 'red',
    borderRadius: 10,
  },
  cardText:{
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  }
});