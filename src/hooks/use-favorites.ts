"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Favorite } from "@/types";

export function useFavorites(userId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: async (): Promise<Favorite[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useAddFavorite() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, spotId }: { userId: string; spotId: string }) => {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, spot_id: spotId });

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });
}

export function useRemoveFavorite() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, spotId }: { userId: string; spotId: string }) => {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("spot_id", spotId);

      if (error) throw error;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });
}

export function useIsFavorite(userId?: string, spotId?: string) {
  const { data: favorites = [] } = useFavorites(userId);
  return favorites.some((f) => f.spotId === spotId);
}
