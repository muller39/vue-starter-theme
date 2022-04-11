import client from "@core/api/graphql/graphql-client";
import { Query, QuerySearchPointsOperationsArgs, SearchPointsOperationsResultType } from "@core/api/graphql/types";
import getPointsOperationsQueryDocument from "./getPointsOperationsQuery.graphql";

export default async function getPointsOperations(
  variables: QuerySearchPointsOperationsArgs
): Promise<SearchPointsOperationsResultType> {
  const { data } = await client.query<Pick<Query, "searchPointsOperations">, QuerySearchPointsOperationsArgs>({
    query: getPointsOperationsQueryDocument,
    variables,
  });
  return data.searchPointsOperations as SearchPointsOperationsResultType;
}
