import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Portal, Text, Button, Card } from "react-native-paper";

const CustomAlert = ({ visible, onDismiss, onConfirm }:any) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Account Not Found</Text>
            <Text style={styles.message}>
              No account exists with this Google login. Would you like to sign up?
            </Text>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button onPress={onDismiss} textColor="#fff" style={{backgroundColor:'#0E3386'}}>Cancel</Button>
            <Button onPress={onConfirm} mode="contained" style={{backgroundColor:'#0E3386'}}>Sign Up</Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 10,
  },
  card: {
    borderRadius: 8,
    // paddingVertical: 20,
  },
  title: {
    fontSize: 16,  
    fontWeight: "700",
    marginBottom: 16,
  },
  message: {
    fontSize: 14, 
    color: "#555",
  },
  actions: {
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,

  },
});

export default CustomAlert;
