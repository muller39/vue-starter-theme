import client from "@core/api/graphql/graphql-client";
import { Query, QueryBalanceArgs, UserBalanceType } from "@core/api/graphql/types";
import getUserBalanceQueryDocument from "./getUserBalanceQuery.graphql";

export default async function getUserBalance(variables: QueryBalanceArgs): Promise<UserBalanceType> {
  const { data } = await client.query<Pick<Query, "balance">, QueryBalanceArgs>({
    query: getUserBalanceQueryDocument,
    variables,
  });
  return data?.balance as UserBalanceType;
}
