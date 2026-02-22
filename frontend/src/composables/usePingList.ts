import { ref } from "vue";
import type { Ping } from "@/types/ping";
import { fetchPings } from "@/api/ping";

export function usePingList() {
  const pings = ref<Ping[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadPings() {
    if (loading.value) return;

    loading.value = true;
    error.value = null;

    try {
      pings.value = await fetchPings();
    } catch {
      error.value = "Something went wrong.";
    } finally {
      loading.value = false;
    }
  }

  loadPings();

  return { pings, loading, error, loadPings };
}
