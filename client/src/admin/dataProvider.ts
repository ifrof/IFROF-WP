import type { DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
import { trpcClient } from "@/lib/trpcClient";

type AdminResource = "users" | "products" | "orders" | "factories";

type AdminListParams = {
  limit: number;
  offset: number;
  search?: string;
};

const getSearchFilter = (params?: GetListParams): string | undefined => {
  const filters = params?.filters ?? [];
  const searchFilter = filters.find(filter =>
    filter.operator === "contains" &&
    typeof filter.value === "string" &&
    (filter.field === "q" || filter.field === "search")
  );
  return typeof searchFilter?.value === "string" ? searchFilter.value : undefined;
};

const getPagination = (params?: GetListParams) => {
  const current = params?.pagination?.current ?? 1;
  const pageSize = params?.pagination?.pageSize ?? 25;
  return {
    limit: pageSize,
    offset: (current - 1) * pageSize,
  };
};

const listFetchers: Record<AdminResource, (params: AdminListParams) => Promise<any[]>> = {
  users: ({ limit, offset, search }) => trpcClient.admin.getUsers.query({ limit, offset, search }),
  products: ({ limit, offset, search }) => trpcClient.admin.getProducts.query({ limit, offset, search }),
  orders: ({ limit, offset }) => trpcClient.admin.getOrders.query({ limit, offset }),
  factories: async ({ limit, offset }) => {
    const factories = await trpcClient.admin.getFactories.query({});
    return factories.slice(offset, offset + limit);
  },
};

export const adminDataProvider: DataProvider = {
  getList: async (params): Promise<GetListResponse> => {
    const resource = params.resource as AdminResource;
    const { limit, offset } = getPagination(params);
    const search = getSearchFilter(params);

    if (!listFetchers[resource]) {
      throw new Error(`Unknown admin resource: ${params.resource}`);
    }

    const data = await listFetchers[resource]({ limit, offset, search });
    return {
      data,
      total: data.length,
    };
  },
  getOne: async () => {
    throw new Error("Not implemented");
  },
  create: async () => {
    throw new Error("Not implemented");
  },
  update: async () => {
    throw new Error("Not implemented");
  },
  deleteOne: async () => {
    throw new Error("Not implemented");
  },
  getApiUrl: () => "/api/trpc",
};
