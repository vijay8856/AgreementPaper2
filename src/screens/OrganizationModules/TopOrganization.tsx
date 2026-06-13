import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import Services from '../../Services/services';
import { useNavigation } from "@react-navigation/native";
interface UserDetail {
    email: string;
    first_name: string;
    last_name: string;
    profile_pic?: string | null;
}

interface OrganisationItem {
    id: number;
    company_name: string;
    company_website?: string;
    logo?: string;
    country_name?: string;
    state_name?: string;
    user_detail?: UserDetail;
}

const TopOrganisation = () => {
  const navigation = useNavigation();

    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<OrganisationItem[]>([]);

    useEffect(() => {
        fetchOrganisation();
    }, []);

    const fetchOrganisation = async () => {
        setLoading(true);

        try {
            const payload = { limit: 100, offset: 0, search: "" };
            const response = await Services.getOrganistionProfileList(payload);

            if (response.success) {
                setList(response.data);
            }
        } catch (e) {
            console.log("Error fetching organisations:", e);
        } finally {
            setLoading(false);
        }
    };
const renderCard = ({ item }: { item: OrganisationItem }) => (
    <TouchableOpacity
        onPress={() => navigation.navigate("OrganisationDetailScreen", { slug: item.slug })}
        style={styles.card}
    >
        <View style={styles.row}>
            <Image
                source={{
                    uri: item.logo
                        ? item.logo
                        : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                style={styles.logo}
            />

            <View style={{ flex: 1 }}>
                <Text style={styles.companyName}>{item.company_name}</Text>

                <Text style={styles.infoText}>
                    📍 {item.country_name}
                    {item.state_name ? `, ${item.state_name}` : ""}
                </Text>

                <Text style={styles.infoText}>✉️ {item.user_detail?.email}</Text>

                {item.company_website ? (
                    <Text style={styles.website}>🌐 {item.company_website}</Text>
                ) : null}
            </View>
        </View>
    </TouchableOpacity>
);


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Top Organisation</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#00007B" />
            ) : (
                <FlatList
                    data={list}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCard}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
        </ScrollView>
    );
};

export default TopOrganisation;

// -------------------------------------
//              STYLES
// -------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F5F6FA",
    },
    header: {
        fontSize: 16,
        fontWeight: "900",
        color: "#00007B",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
         borderLeftWidth: 6,
        borderLeftColor: "#000078",
    },
     
    row: {
        flexDirection: "row",
        gap: 14,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: "#eee",
    },
    companyName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111",
    },
    infoText: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    website: {
        fontSize: 13,
        color: "#0066FF",
        marginTop: 4,
        fontWeight: "600",
    },
});
