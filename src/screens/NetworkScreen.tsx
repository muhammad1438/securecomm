import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { networkService } from "../services/NetworkService";
import { NetworkTopology } from "../types/network";

export const NetworkScreen = () => {
  const [topology, setTopology] = useState<NetworkTopology | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTopology(networkService.getNetworkTopology());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTopology(networkService.getNetworkTopology());
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const renderDevice = ({ item }: { item: any }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item[1].name}</Text>
      <Text>ID: {item[0]}</Text>
    </View>
  );

  const renderRoute = ({ item }: { item: any }) => (
    <View style={styles.routeItem}>
      <Text>Destination: {item[0]}</Text>
      <Text>Next Hop: {item[1].path.join(" -> ")}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Topology</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Devices</Text>
        <FlatList
          data={topology ? Array.from(topology.devices.entries()) : []}
          renderItem={renderDevice}
          keyExtractor={(item) => item[0]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Routes</Text>
        <FlatList
          data={topology ? Array.from(topology.routes.entries()) : []}
          renderItem={renderRoute}
          keyExtractor={(item) => item[0]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  deviceName: {
    fontWeight: "bold",
  },
  routeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
