import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import Services from '../../Services/services';

const ApproverModal = ({ visible, onClose, onSelectApprover, selectedApprover }: any) => {
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApprovers = async () => {
    setLoading(true);
    try {
      const data2 = {
        limit: 10,
        msa: "msa"
      };
      const data = await Services.getApproverCoustom(data2);

      setApprovers(data?.data);
    } catch (error) {
      console.error('Error fetching approvers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchApprovers();
    }
  }, [visible]);

  const handleSelectApprover = (approver: any) => {
    onSelectApprover(approver);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Approver</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              data={approvers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.approverItem,
                    selectedApprover?.id === item.id && styles.selectedItem
                  ]}
                  onPress={() => handleSelectApprover(item)}
                >
                  <Text style={styles.approverName}>
                    {`${(item as any)?.first_name ?? ""} ${(item as any)?.last_name ?? ""}`}
                  </Text>
                  <Text style={styles.approverEmail}>{item.email}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  approverItem: {
    padding: 15,
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
  },
  approverName: {
    fontSize: 16,
    fontWeight: '500',
  },
  approverEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default ApproverModal;