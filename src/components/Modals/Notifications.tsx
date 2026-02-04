import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar
} from "react-native";
import { Badge, Icon } from "react-native-paper"; // Using react-native-paper for icons and badge
import Services from "../../Services/services";


// Custom Notification Icon with Badge Component
function NotificationIconWithBadge({ count, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.badgeContainer}>
      <Badge visible={count > 0} size={20} style={styles.badge}>
        {count > 99 ? "99+" : count}
      </Badge>
      <Icon source="bell-outline" size={24} color="white" />
    </TouchableOpacity>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await Services.getAllNotification();

      if (result.success) {
        // Use the array directly
        const notificationsData = result.data || [];
        setNotifications(notificationsData);
        setCount(notificationsData.length);
      } else {
        Alert.alert("Error", result.error || "Failed to load notifications");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load notifications");
      console.error("Load notifications error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (showModal) {
      loadNotifications();
    }
  }, [showModal]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const updateNotificationStatus = async (id) => {
    try {
      const payload = {
        notification_status: "READ",
        id: id,
      };
      await Services.updateNotification(payload);
    } catch (error) {
      console.error("Update notification error:", error);
    }
  };

  const handleAccept = async (notification) => {
    try {
      await updateNotificationStatus(notification.id); // mark as read

      const payload = {
        id: notification?.connection_request?.id,
        status: "ACCEPTED",
      };

      const result = await Services.acceptRejectConnectReq(payload);

      if (result.success) {
        Alert.alert("Success", "Connection request accepted");
        loadNotifications(); // refresh list
      } else {
        Alert.alert("Error", result.error || "Failed to accept request");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to accept request");
      console.error("Accept error:", error);
    }
  };

  const handleReject = async (notification) => {
    try {
      await updateNotificationStatus(notification.id); // mark as read

      const payload = {
        id: notification?.connection_request?.id,
        status: "REJECTED",
      };

      const result = await Services.acceptRejectConnectReq(payload);

      if (result.success) {
        Alert.alert("Success", "Connection request rejected");
        loadNotifications(); // refresh list
      } else {
        Alert.alert("Error", result.error || "Failed to reject request");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to reject request");
      console.error("Reject error:", error);
    }
  };


  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await Services.deleteNotificationReq({ id });
              if (result.success) {
                Alert.alert("Success", "Notification deleted");
                loadNotifications(); // Refresh notifications
              } else {
                Alert.alert("Error", result.error || "Failed to delete notification");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete notification");
              console.error("Delete error:", error);
            }
          }
        }
      ]
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ACCEPTED":
        return { text: " (Accepted)", color: "#4CAF50" };
      case "REJECTED":
        return { text: " (Rejected)", color: "#F44336" };
      default:
        return { text: "", color: "#333" };
    }
  };

  return (
    <View style={styles.container}>
      <NotificationIconWithBadge count={count} onPress={handleShow} />

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Icon source="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody}>
              {loading ? (
                <Text style={styles.loadingText}>Loading notifications...</Text>
              ) : notifications.length === 0 ? (
                <Text style={styles.noNotificationsText}>
                  No notifications available
                </Text>
              ) : (
                notifications.map((notification) => {
                  const statusInfo = getStatusText(
                    notification?.connection_request?.status
                  );

                  return (
                    <View
                      key={notification?.id}
                      style={[
                        styles.notificationItem,
                        notification?.notification_status === "UNREAD"
                          ? styles.unreadNotification
                          : styles.readNotification
                      ]}
                    >
                      <View style={styles.notificationContent}>
                        <Text style={styles.notificationTitle}>
                          {notification?.title}
                          {statusInfo.text && (
                            <Text style={{ color: statusInfo.color }}>
                              {statusInfo.text}
                            </Text>
                          )}
                        </Text>

                        {notification?.connection_request?.status === "PENDING" && (
                          <View style={styles.notificationActions}>
                            <TouchableOpacity
                              onPress={() => handleAccept(notification)}
                              style={[styles.actionButton, styles.acceptButton]}
                            >
                              <Icon source="check" size={20} color="#4CAF50" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleReject(notification)}
                              style={[styles.actionButton, styles.rejectButton]}
                            >
                              <Icon source="close" size={20} color="#FF9800" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleDelete(notification?.id)}
                              style={[styles.actionButton, styles.deleteButton]}
                            >
                              <Icon source="delete" size={20} color="#F44336" />
                            </TouchableOpacity>
                          </View>
                        )}

                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeFooterButton}
              >
                <Text style={styles.closeFooterButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginRight: 10,
  },
  badgeContainer: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF3B30",
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 400,
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  closeFooterButton: {
    backgroundColor: "#6C757D",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },
  closeFooterButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  notificationItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  unreadNotification: {
    backgroundColor: "#E3F2FD",
    borderLeftColor: "#2196F3",
  },
  readNotification: {
    backgroundColor: "#F8F9FA",
    borderLeftColor: "#6C757D",
  },
  notificationContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationTitle: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  notificationActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: "#F8F9FA",
  },
  acceptButton: {
    backgroundColor: "#E8F5E8",
  },
  rejectButton: {
    backgroundColor: "#FFF3E0",
  },
  deleteButton: {
    backgroundColor: "#FFEBEE",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    padding: 20,
  },
  noNotificationsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    padding: 20,
  },
});

export default Notifications;