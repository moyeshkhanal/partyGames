import Button from '@/components/Button';
import { 
  Image, 
  StyleSheet, 
  Platform } from 'react-native';
import { 
  View, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import {  
  SafeAreaView, 
} from 'react-native-safe-area-context';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';


export default function Navbar() {
    return (
      <>
       <View style={styles.navbar}>
      <TouchableOpacity style={styles.navbarButtons} onPress={() => {}}>
          <Image style={styles.profileIcon} source={require('../assets/images/profile-icon.png')} />
        </TouchableOpacity>
        
        <Text style={{color: 'white' }}>APP NAME</Text>
        
        <TouchableOpacity style={styles.navbarButtons} onPress={() => {}}>
        <TabBarIcon name={'search'} color={'white'} />
        </TouchableOpacity>
      </View>
      </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 50,
    },
    navbar:{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 10,
    },
    navbarButtons: {
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    profileIcon: {
      width: 30,
      height: 30,
      borderRadius: 50,
    },
    
  });
  