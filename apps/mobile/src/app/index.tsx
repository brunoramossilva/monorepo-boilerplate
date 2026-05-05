import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import type { User } from "@repo/types";
import { apiGet } from "@/lib/api";
import { mockUsers } from "@/lib/mocks";

export default function HomeScreen() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isMocked, setIsMocked] = useState(false);

  useEffect(() => {
    apiGet<User[]>("/users", mockUsers).then(({ data, isMocked }) => {
      setUsers(data);
      setIsMocked(isMocked);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile app</Text>
      {isMocked && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            <Text style={styles.bannerStrong}>Modo offline: </Text>
            sem comunicação com o servidor. Os dados abaixo são mockados.
          </Text>
        </View>
      )}
      <Text style={styles.description}>
        Os usuários abaixo são dados de exemplo retornados pelo back-end em GET /users.
      </Text>
      {!users && <ActivityIndicator />}
      {users && (
        <FlatList
          data={users}
          keyExtractor={(user) => user.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Text style={styles.item}>
              {item.name ?? "(sem nome)"} ({item.email})
            </Text>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: "600" },
  description: { fontSize: 13, color: "#555", textAlign: "center" },
  list: { gap: 8 },
  item: { fontSize: 14 },
  banner: {
    borderWidth: 1,
    borderColor: "#fcd34d",
    backgroundColor: "#fefce8",
    borderRadius: 8,
    padding: 12,
    maxWidth: 320,
  },
  bannerText: { fontSize: 13, color: "#713f12", textAlign: "center" },
  bannerStrong: { fontWeight: "600" },
});
