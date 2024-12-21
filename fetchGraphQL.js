export async function fetchGraphQL(query, variables) {
    try {
      const result = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variables: variables,
          query: query,
        }),
      });
  
      const response = await result.json();
      if (response.errors) {
        throw new Error(
          "GraphQL Error: " + response.errors.map((e) => e.message).join(", ")
        );
      }
      return response;
    } catch (error) {
      console.error("GraphQL fetch failed, falling back to REST API:", error);
      // If GraphQL fails, fallback to REST
      return null;
    }
  }
  