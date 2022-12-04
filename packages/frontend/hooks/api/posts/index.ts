import { useQuery } from "@tanstack/react-query";
import { postKeys, fetchPosts, fetchPost } from "./queries";

import type { Post } from "@/services/upload";
import type { Chain } from "@/constants/chains";

type IndividualPost = Post & {
  owner: string;
  nTransactions?: number;
  date?: string | Date | undefined;
};

export const usePosts = (chain: Chain = "polygon") => {
  return useQuery<Post[]>(postKeys.byChain(chain), () => fetchPosts(chain));
};

export const usePost = (chain: Chain, id: string) => {
  return useQuery<IndividualPost>(postKeys.single(chain, id), () =>
    fetchPost(chain, id)
  );
};
