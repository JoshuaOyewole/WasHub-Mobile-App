import EmptyState from "@/components/ui/empty-state";
import OutletCard from "@/components/ui/outlet-card";
import SearchInput from "@/components/ui/search-input";
import { useTheme } from "@/hooks/useTheme";
import { fetchOutlets, IOutlet } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Outlets = () => {
  const colors = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch outlets
  const {
    data: outletsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["outlets"],
    queryFn: fetchOutlets,
  });

  const outlets = outletsData?.data ?? [];
  // Filter outlets based on search query
  const filteredOutlets = useMemo(() => {
    if (!searchQuery.trim()) return outlets;

    const query = searchQuery.toLowerCase();
    return outlets.filter(
      (outlet) =>
        outlet.name.toLowerCase().includes(query) ||
        `${outlet?.city?.toLowerCase() || ""}, ${outlet?.state?.toLowerCase() || ""}`.includes(
          query,
        ) ||
        outlet.address?.toLowerCase().includes(query),
    );
  }, [outlets, searchQuery]);

  const handleOutletPress = (outlet: IOutlet) => {
    router.push({
      pathname: "/(screens)/outlet-details",
      params: { outletId: outlet._id },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle={colors.statusBarStyle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: colors.card, shadowColor: colors.shadow },
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Car Wash Outlets
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Search Field */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.background }]}
      >
        <View style={{ flex: 1 }}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for car wash spot"
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="options-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colors.primary}
          />
        }
      >
        {/* Outlets List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredOutlets.length <= 0 ? (
          <EmptyState
            image={require("@/assets/images/no-cars.png")}
            title="No car washes found"
            description={
              searchQuery
                ? "Try adjusting your search criteria"
                : "No car wash outlets available at the moment"
            }
          />
        ) : (
          <View style={styles.outletsList}>
            {filteredOutlets.map((outlet) => (
              <OutletCard
                key={outlet._id}
                outlet={outlet}
                onPress={handleOutletPress}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Outlets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 12,
    alignItems: "center",
  },
  filterButton: {
    width: 43,
    height: 43,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  outletsList: {
    paddingBottom: 20,
  },
});
