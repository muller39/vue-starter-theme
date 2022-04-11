import { Mutations, MutationsRegisterPointsOperationArgs } from "@core/api/graphql/types";
import client from "@core/api/graphql/graphql-client";
import mutationDocument from "./registerPointsOperationMutation.graphql";

export default async function registerPointsOperation(variables: MutationsRegisterPointsOperationArgs): Promise<void> {
  await client.mutate<Pick<Mutations, "registerPointsOperation">, MutationsRegisterPointsOperationArgs>({
    mutation: mutationDocument,
    variables,
  });
}
