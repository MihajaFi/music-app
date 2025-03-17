import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1E1E1E", 
      paddingVertical: 4, 
      paddingHorizontal: 16, 
      borderRadius: 12,
      marginBottom: 2,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5, 
      paddingLeft: 16,   
      paddingRight: 16,  
    },
    cover: {
      width: 60,  
      height: 60,  
      borderRadius: 8, 
      marginRight: 16, 
      backgroundColor: "#555", 
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      flex: 1, 
    },
    title: {
      fontSize: 16,  
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    artist: {
      fontSize: 12,  
      color: "#B3B3B3",
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      },
      
      modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'flex-start',  
        position: 'relative', 
      },
      
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'left',  
        width: '100%',
      },
      
      detailsContainer: {
        width: '100%',
        marginBottom: 20,
      },
      
      detailsText: {
        fontSize: 14,
        marginVertical: 5,
        textAlign: 'left',
        width: '100%',
      },
      
      closeButton: {
        position: 'absolute', 
        top: 10, 
        right: 10,  
        backgroundColor: '#333',  
        padding: 5,
        borderRadius: 50,
      },
      
  });

