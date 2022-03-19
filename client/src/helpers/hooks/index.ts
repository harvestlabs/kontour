import {
  DocumentNode,
  OperationVariables,
  SubscriptionHookOptions,
  SubscriptionResult,
  TypedDocumentNode,
  useSubscription,
} from "@apollo/client";
import { createGraphQLClient } from "@gql/GraphQLClient";
import { AuthContext } from "@utils/auth";
import { useContext, useLayoutEffect, useMemo, useState } from "react";

export function useWindowResize(onWindowResize: () => void, deps?: any[]) {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
      onWindowResize();
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [onWindowResize, ...(deps || [])]);
  return size;
}

export function useAuthenticatedSubscription<
  TData = any,
  TVariables = OperationVariables
>(
  subscription: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  options?: SubscriptionHookOptions<TData, TVariables>
): SubscriptionResult<TData, any> {
  const authToken = useContext(AuthContext);
  const client = useMemo(() => createGraphQLClient(authToken), [authToken]);
  const optionsWithAuth = {
    ...options,
    client,
  };
  return useSubscription<TData, TVariables>(subscription, optionsWithAuth);
}
