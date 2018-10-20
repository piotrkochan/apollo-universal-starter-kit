import { PubSub, withFilter } from 'graphql-subscriptions';
import { createBatchResolver } from 'graphql-resolve-batch';
// interfaces
import { Storage, StorageColor, StorageLocation, Identifier } from './sql';

interface Edges {
  cursor: number;
  node: Storage & Identifier;
}

interface StorageParams {
  limit: number;
  after: number;
}

interface StorageInput {
  input: Storage;
}

interface StorageInputWithId {
  input: Storage & Identifier;
}

const STORAGE_SUBSCRIPTION = 'storage_subscription';
const STORAGES_SUBSCRIPTION = 'storages_subscription';

export default (pubsub: PubSub) => ({
  Query: {
    async storages(obj: any, { limit, after }: StorageParams, context: any) {
      const edgesArray: Edges[] = [];
      const storages = await context.Storage.storagesPagination(limit, after);
      const total = (await context.Storage.getTotal()).count;
      const hasNextPage = total > after + limit;

      storages.map((storage: Storage & Identifier, index: number) => {
        edgesArray.push({
          cursor: after + index,
          node: storage
        });
      });
      const endCursor = edgesArray.length > 0 ? edgesArray[edgesArray.length - 1].cursor : 0;

      return {
        totalCount: total,
        edges: edgesArray,
        pageInfo: {
          endCursor,
          hasNextPage
        }
      };
    },  
    storage(obj: any, { id }: Identifier, context: any) {
      return context.Storage.storage(id);
    }
  },
  Storage: {
    color: createBatchResolver(async (sources, args, context) => {
      return context.Storage.getStorageColorsForStorageIds(sources.map(({ id }) => id));
    }),
    location: createBatchResolver(async (sources, args, context) => {
      return context.Storage.getStorageLocationsForStorageIds(sources.map(({ id }) => id));
    }),
  },
  Mutation: {
    async addStorage(obj: any, { input }: StorageInput, context: any) {
      const [id] = await context.Storage.addStorage(input);
      const storage = await context.Storage.storage(id);
      // publish for post list
      pubsub.publish(STORAGES_SUBSCRIPTION, {
        storagesUpdated: {
          mutation: 'CREATED',
          id,
          node: storage
        }
      });
      return storage;
    },
    async deleteStorage(obj: any, { id }: Identifier, context: any) {
      const storage = await context.Storage.storage(id);
      const isDeleted = await context.Storage.deleteStorage(id);
      if (isDeleted) {
        // publish for post list
        pubsub.publish(STORAGES_SUBSCRIPTION, {
          storagesUpdated: {
            mutation: 'DELETED',
            id,
            node: storage
          }
        });
        // publish for edit post page
        pubsub.publish(STORAGE_SUBSCRIPTION, {
          storageUpdated: {
            mutation: 'DELETED',
            id,
            node: storage
          }
        });
        return { id: storage.id };
      } else {
        return { id: null };
      }
    },
    async editStorage(obj: any, { input }: StorageInputWithId, context: any) {
      await context.Storage.editStorage(input);
      const storage = await context.Storage.storage(input.id);
      // publish for post list
      pubsub.publish(STORAGES_SUBSCRIPTION, {
        storagesUpdated: {
          mutation: 'UPDATED',
          id: storage.id,
          node: storage
        }
      });
      // publish for edit post page
      pubsub.publish(STORAGE_SUBSCRIPTION, {
        storageUpdated: {
          mutation: 'UPDATED',
          id: storage.id,
          node: storage
        }
      });
      return storage;
    }
  },
  Subscription: {
    storageUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(STORAGE_SUBSCRIPTION),
        (payload, variables) => {
          return payload.storageUpdated.id === variables.id;
        }
      )
    },
    storagesUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(STORAGES_SUBSCRIPTION),
        (payload, variables) => {
          return variables.endCursor <= payload.storagesUpdated.id;
        }
      )
    }
  }
});
