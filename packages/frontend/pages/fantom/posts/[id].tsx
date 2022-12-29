import {
  ActionIcon,
  Paper,
  SimpleGrid,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import { ArrowLeft } from "tabler-icons-react";
import { useRouter } from "next/router";

import { usePost } from "@/hooks/api";
import { getCurrentChain } from "@/utils/chains";

const PostPage = () => {
  const router = useRouter();
  const currentChain = getCurrentChain(250);
  const { data: post, isLoading } = usePost(
    currentChain,
    router.query.id as string
  );

  return (
    <div>
      <LoadingOverlay visible={isLoading} />
      {post && (
        <>
          <ActionIcon
            onClick={() => router.back()}
            mb="md"
            color="teal"
            size="xl"
            radius="xl"
            variant="filled"
          >
            <ArrowLeft />
          </ActionIcon>
          <SimpleGrid
            breakpoints={[
              { minWidth: "md", cols: 2, spacing: "lg" },
              { maxWidth: "md", cols: 1, spacing: "md" },
            ]}
          >
            <Image
              height={550}
              fit="contain"
              src={post.image ?? "https://evm.pinsave.app/PinSaveCard.png"}
              alt={post.name}
            />
            <Paper shadow="sm" p="md" withBorder>
              <h2 style={{ marginBottom: "1.4rem" }}>{post.name}</h2>
              <h4>Description</h4>
              <Paper
                shadow="xs"
                withBorder
                px="sm"
                sx={{ backgroundColor: "#82c7fc1d" }}
              >
                <p>{post.description}</p>
              </Paper>
              <p style={{ fontSize: "small", color: "#0000008d" }}>
                Owned by:{" "}
                <a
                  style={{ color: "#198b6eb9" }}
                  href={`https://ftmscan.com/address/${post.owner}`}
                >
                  {post.owner}
                </a>
              </p>
            </Paper>
          </SimpleGrid>
        </>
      )}
    </div>
  );
};

export default PostPage;
