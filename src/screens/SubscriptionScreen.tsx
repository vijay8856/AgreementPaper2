// @ts-nocheck

import { requestSubscription } from 'react-native-iap';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  useIAP,
  purchaseUpdatedListener,

  purchaseErrorListener,
  finishTransaction,
  getSubscriptions, // <--- add this top-level import
} from 'react-native-iap';

import Services from '../Services/services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshSubscriptionStatus } from '../utils/ubscriptionHelper';

const SUB_IDS = [
  "agreement_subscription_1",
  "agreement_subscription_2",
  "base_plan_yearly",
];

// ---------- DYNAMIC PRICE CALCULATION (WORKS FOR ALL CURRENCIES) ----------
const DISCOUNT_MULTIPLIER = 2; // Means original price = current price × 2 (50% OFF)

const parsePrice = (displayPrice) => {
  if (!displayPrice || typeof displayPrice !== "string") {
    return { currencySymbol: "", numericValue: 0 };
  }

  const currencySymbol = displayPrice.replace(/[0-9.,]/g, "").trim();
  const numericValue = parseFloat(displayPrice.replace(/[^0-9.]/g, ""));

  return { currencySymbol, numericValue };
};
const getOriginalPrice = (displayPrice) => {
  const { currencySymbol, numericValue } = parsePrice(displayPrice);
  if (!numericValue) return "";
  const originalValue = (numericValue * DISCOUNT_MULTIPLIER).toFixed(2);
  return `${currencySymbol}${originalValue}`;
};

// ⭐ Extract actual Play Store price from Billing v6 structure
const getStorePrice = (plan) => {
  try {
    const offer = plan?.subscriptionOfferDetails?.[0];
    const pricing = offer?.pricingPhases?.pricingPhaseList?.[0];
    return pricing?.formattedPrice || null; // ex: "₹249.00"
  } catch {
    return null;
  }
};



export default function SubscriptionScreen() {
  const { connected, subscriptions, requestPurchase } = useIAP();

  const [plans, setPlans] = useState<any[]>([]);

  const [purchasedProductId, setPurchasedProductId] = useState<string | null>(null);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iapLog, setIapLog] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const originalPrices: any = {
    agreement_subscription_2: 500,
    base_plan_yearly: 620,
    agreement_subscription_1: 2600,
  };
  const [showCongrats, setShowCongrats] = useState(false);


  // Load subscription status
  useEffect(() => {
    AsyncStorage.getItem('hasPremiumAccess').then(value => {
      setHasPremiumAccess(JSON.parse(value || 'false'));
    });
    AsyncStorage.getItem('purchasedProductId').then(value => {
      if (value) setPurchasedProductId(value);
    });
  }, []);
  // Fetch subscription products once connected
  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        const subs = await getSubscriptions({ skus: SUB_IDS });
        console.log('getSubscriptions ->', subs);
        setPlans(subs);
      } catch (e) {
        console.warn('getSubscriptions err', e);
      }
    })();
  }, [connected]);






  useEffect(() => {
    const purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
      console.log("✅ Purchase received:", purchase);

      try {
        await finishTransaction({ purchase, isConsumable: false });

        const token = purchase?.purchaseToken || purchase?.transactionReceipt;

        if (token) {
          try {
            const response = await Services.googleSubcription({ token });
            console.log("✅ Subscription verified:", response);

            if (response?.success) {
              setShowCongrats(true); // Open modal


              // 🔄 Auto-refresh backend status
              await refreshSubscriptionStatus();

              console.log("🔄 UI updated after purchase");
            }
          } catch (error) {
            console.log("❌ Subscription API failed:", error);
          }
        }
      } catch (err) {
        console.log("⚠️ finishTransaction error:", err);
      }
    });

    return () => {
      purchaseUpdate.remove();
    };
  }, []);





  // 🔄 Refresh subscription status from server & update UI + AsyncStorage
  const refreshSubscriptionStatus = async () => {
    try {
      const result = await Services.getSubscriptionStatus();
      console.log("🔄 Live subscription refresh:", result);

      if (result.success) {
        const premium = result.data?.has_premium_access || false;
        const productId = result.data?.product_id || null;

        // Save to local storage
        await AsyncStorage.setItem("hasPremiumAccess", JSON.stringify(premium));

        if (productId) {
          await AsyncStorage.setItem("purchasedProductId", productId);
        } else {
          await AsyncStorage.removeItem("purchasedProductId");
        }

        // Update UI
        setHasPremiumAccess(premium);
        setPurchasedProductId(productId);

      } else {
        // No subscription
        await AsyncStorage.setItem("hasPremiumAccess", JSON.stringify(false));
        await AsyncStorage.removeItem("purchasedProductId");

        setHasPremiumAccess(false);
        setPurchasedProductId(null);
      }

    } catch (err) {
      console.log("❌ refreshSubscriptionStatus error:", err);

      await AsyncStorage.setItem("hasPremiumAccess", JSON.stringify(false));
      await AsyncStorage.removeItem("purchasedProductId");

      setHasPremiumAccess(false);
      setPurchasedProductId(null);
    }
  };





  const buySubscription = async (plan: any) => {
    try {
      setLoading(true);

      const productId = plan?.productId || plan?.id || plan?.sku;
      const offerToken = plan?.subscriptionOfferDetails?.[0]?.offerToken ?? null;

      if (!productId) {
        Alert.alert('Error', 'Invalid product id.');
        return;
      }

      // If there is an offer token, send subscriptionOffers with sku (required by types)
      if (offerToken) {
        await requestSubscription({
          // top-level sku required
          sku: productId,
          // subscriptionOffers items must include sku (TypeScript expects this)
          subscriptionOffers: [
            {
              sku: productId,        // <- REQUIRED
              offerToken: offerToken // <- the offer token from Play API
            },
          ],
        });
      } else {
        // No special offer token — request subscription using only sku (basic flow)
        await requestSubscription({
          sku: productId,
        });
      }

      console.log('Purchase flow started for', productId);
    } catch (err: any) {
      console.log('❌ Purchase Error:', err);
      Alert.alert('Purchase Error', err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };




  const noPaymentData =
    !paymentDetails?.transaction_id &&
    !paymentDetails?.amount &&
    !paymentDetails?.purchase_date &&
    !paymentDetails?.expire_at;

  // Check payment details
  const handleCheckPayment = async () => {
    try {
      setCheckingPayment(true);
      const res = await Services.getPaymentdetails();
      console.log('Payment Details Response:', res);

      if (res.success && res.data) {
        setPaymentDetails(res.data);
      } else {
        Alert.alert('Error', res.error || 'Failed to fetch payment details');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setCheckingPayment(false);
    }
  };

  if (!connected) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16 }}>Connecting to Play Store...</Text>
        <ActivityIndicator size="large" color="#0E3386" />
      </View>
    );
  }

  // Benefit list (same for all plans)
  // Benefit lists based on plan type
  // const benefitLists: any = {
  //   agreement_subscription_2: [
  //     'Essential eSign and contracting for business users and freelancers',
  //     'Everything included in the Personal Plan',
  //     'Unlimited document and contract creation',
  //     'Unlimited eSignatures',
  //     'Unlimited team collaboration',
  //     'Comprehensive audit trails',
  //     'Priority email support',
  //   ],

  //   base_plan_yearly: [
  //     'For growing businesses to automate their eSign/contracting workflow.',
  //     'Everything in Pro',
  //     'Role based user management',
  //     'Workflows for internal approvals',
  //     'Advance document/eSign controls',
  //     'Customizable alerts/notifications',
  //     'Business template library',
  //     'Unlimited Custom templates',
  //     'Business Integrations',
  //     'Advance platform controls',
  //     'Custom branding',
  //     'Priority support',
  //   ],

  //   agreement_subscription_1: [
  //     'For advanced automation, security, custom terms and compliance.',
  //     'Everything in team',
  //     'Advance user management',
  //     'Advance eSign settings',
  //     'Premium integrations',
  //     'Customizable platform security',
  //     'Custom success manager',
  //     'Uptime SLAs with service credit',
  //     'Custom contract terms',
  //   ],
  // };
  const benefitLists: any = {
    agreement_subscription_2: [
      'AI Assisted Contract Review',
      'AI Assisted Holistic Contract Review',
      '10 Contract review by AI per month',
      '100 eSigns / document pages per month',
      '10 Docs / Contracts creation per month',
      'Unlimited collaboration with Agencies and Lawyers*',
      'Audit trails',
      'Email Support',
      'Essential eSign and contracting for business users',
      'Job search and application (if applicable by profile)',
      'Work allocation and timesheet for Freelancers',
    ],

    base_plan_yearly: [
      'AI Assisted Contract Review',
      'AI Assisted Contract Draft',
      " AI Assisted Holistic Contract Review,",
      "Contracts creation and approval",
      "Unlimited Collaboration with Lawyers  Agencies, lawyers and Talent",
      "Audit trails",
      " Email Support",
      "Essential eSign and contracting for business users",
      "Unlimited Job Posting and Resource search if applicable for Organisations",
      "Unlimited Master service Agreements and Statement of work for Organisation",
      'Unlimited* Contract review by AI per month',
      'Unlimited* eSigns / document pages per month',
      'Unlimited* Docs / Contracts creation per month',
      'Role based user management',
      'Timesheet for Staff',
      'Invoice for Staff payment & tracking',
      'Workflow approval',
    ],

    agreement_subscription_1: [
      'AI Assisted Contract Review',
      'AI Assisted Contract Draft',
      "AI Assisted Holistic Contract Review",
      "Contracts creation and approval",
      'Unlimited* Contract review by AI per month',
      'Unlimited* eSigns / document pages per month',
      'Unlimited* Docs / Contracts creation per month',
      'Unlimited collaboration with Agencies, Lawyers & Talent',
      "Audit trails",
      "Email Support",
      "Essential eSign and contracting for business users",
      "100 Job Posting and Resource search if applicable by profile",
      "100 MSA and SOW per Month",
      "Timesheet for Staff",
      'Invoice for Staff payment',
      'Role based user management',
      'Workflows for internal approvals'

    ],
  };

  const planHeadings: Record<string, string> = {
    agreement_subscription_2: 'Ideal for Individual Buyers, Talent or Freelancers',
    base_plan_yearly: 'Ideal for Organisation',
    agreement_subscription_1: 'Ideal for Agencies and Lawyers',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agreement Paper Pro</Text>

      {/* If subscriptions array exists, show each plan in a card */}
      {plans && plans.length > 0 ? (
        <View style={{ width: '100%' }}>
          {plans.map((plan: any, idx: number) => {
            // Use productId (newer), fallback to id
            const planId = plan.productId || plan.id || plan.sku || plan.skus?.[0];
            const isSubscribed = planId === purchasedProductId;
            return (
              <View key={planId || idx} style={styles.card}>
                {/* <Text style={styles.subTitle}>{plan.title || planId}</Text> */}
                <Text style={styles.subTitle}>{plan.title || planId}</Text>

                {planHeadings[planId] && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 6,
                    }}
                  >
                    {planHeadings[planId]}
                  </Text>
                )}

                {plan.description ? (
                  <Text style={styles.description}>{plan.description}</Text>
                ) : null}

                {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>

               
                  {(() => {
                    const priceToShow = getStorePrice(plan);


                    return (
                      <>
                    
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 16,
                            color: '#000',
                          }}
                        >
                          {priceToShow || 'Price N/A'}
                        </Text>

                       
                        <Text
                          style={{
                            textDecorationLine: 'line-through',
                            color: 'gray',
                            marginLeft: 6,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}
                        >
                          {priceToShow ? getOriginalPrice(priceToShow) : ''}
                        </Text>
                      </>
                    );
                  })()}
                </View> */}


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {(() => {
                    const priceToShow = getStorePrice(plan);

                    return (
                      <>
                        {/* Current Price */}
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>
                          {priceToShow || 'Price N/A'}
                        </Text>

                        {/* Discount Badge */}
                        {priceToShow && (
                          <View
                            style={{
                              marginLeft: 8,
                              backgroundColor: '#E6F0FF',
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              style={{
                                color: '#0E3386',
                                fontSize: 12,
                                fontWeight: '700',
                              }}
                            >
                              50% Discount
                            </Text>
                          </View>
                        )}
                      </>
                    );
                  })()}
                </View>



                {/* Benefits */}
                {/* Benefits */}
                <View style={{ marginTop: 10 }}>
                  {(benefitLists[planId] || []).map((item: string, index: number) => (
                    <View key={index} style={styles.benefitItem}>
                      <Icon
                        name="check-circle"
                        size={20}
                        color="#0E3386"
                        style={styles.benefitIcon}
                      />
                      <Text style={styles.benefitText}>{item}</Text>
                    </View>
                  ))}
                </View>


                {/* Subscribe Button */}
                <TouchableOpacity
                  disabled={loading || isSubscribed}
                  onPress={() => buySubscription(plan)}

                  style={[
                    styles.button,
                    {
                      backgroundColor: isSubscribed ? '#ccc' : '#0E3386',
                    },
                  ]}
                >
                  <Text style={styles.buttonText}>
                    {isSubscribed ? 'Already Subscribed' : 'Subscribe Now'}
                  </Text>
                </TouchableOpacity>

              </View>
            );
          })}

          {/* Check payment details action (single button) */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#0E3386', marginTop: 15 }]}
            onPress={handleCheckPayment}
          >
            {checkingPayment ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Check Payment Details</Text>
            )}
          </TouchableOpacity>

          {/* Payment details display */}
          {/* Payment details display */}
          {paymentDetails && (
            <View style={styles.paymentCard}>
              {noPaymentData ? (
                <Text style={{ color: '#374151', fontSize: 14 }}>
                  No subscription details available. You have not purchased any plan yet.
                </Text>
              ) : (
                <>
                  <Text style={styles.paymentTitle}>Payment Details</Text>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Transaction ID:</Text>
                    <Text style={styles.detailValue}>{paymentDetails.transaction_id}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Plan:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.plan_details?.name || "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.plan_details?.price
                        ? `${paymentDetails.plan_details.price} ${paymentDetails.plan_details.currency}`
                        : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color:
                            paymentDetails.payment_status === 'pending'
                              ? '#d97706'
                              : '#16a34a',
                        },
                      ]}
                    >
                      {paymentDetails.payment_status
                        ? paymentDetails.payment_status.toUpperCase()
                        : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purchase Date:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.purchase_date || "N/A"}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Expires On:</Text>
                    <Text style={styles.detailValue}>
                      {paymentDetails.expire_at || "N/A"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

        </View>
      ) : (
        <View style={styles.centered}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Loading subscription plans...</Text>
          <ActivityIndicator size="large" color="#0E3386" />
        </View>
      )}

      {/* debug / log */}
      <Text style={{ marginTop: 12, color: '#666' }}>{iapLog}</Text>




      {/* 🎉 Congratulations Modal */}
      {showCongrats && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalMsg}>
              Your subscription is now active.
            </Text>

            <TouchableOpacity
              onPress={() => setShowCongrats(false)}
              style={styles.modalBtn}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },


  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },

  modalCard: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },

  modalEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0E3386",
    marginBottom: 6,
  },

  modalMsg: {
    textAlign: "center",
    color: "#374151",
    fontSize: 14,
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: "#0E3386",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },

  modalBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00007B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0F4FF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0E3386',
    marginBottom: 6,
  },
  description: {
    color: '#374151',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    color: '#374151',
    flex: 1,
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  paymentCard: {
    marginTop: 15,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEF2FF',
  },
  paymentTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#374151',
    fontWeight: '600',
  },
  detailValue: {
    color: '#111827',
  },
});



