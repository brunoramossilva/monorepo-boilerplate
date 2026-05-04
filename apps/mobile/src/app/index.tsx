import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import type { User } from "@repo/types";
import { apiGet } from "@/lib/api";

export default function HomeScreen() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<User[]>("/users")
      .then(setUsers)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile app</Text>
      <Text style={styles.description}>
        Os usuários abaixo são dados de exemplo retornados pelo back-end em GET /users.
      </Text>
      {error && <Text style={styles.error}>Erro: {error}</Text>}
      {!users && !error && <ActivityIndicator />}
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
  error: { color: "red" },
});
