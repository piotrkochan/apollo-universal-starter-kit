import { returnId, orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';
import { find } from 'lodash';

export interface Storage {
  name: string;
  colorId: number;
  locationId: number;
}

export interface StorageColor {
  id: number;
  color: string;
}

export interface StorageLocation {
  id: number;
  name: string;
}

export interface Identifier {
  id: number;
}

export default class StorageDAO {
  public storagesPagination(limit: number, after: number) {
    return knex
      .select('id', 'name', 'colorId', 'locationId')
      .from('storage')
      .orderBy('id', 'desc')
      .limit(limit)
      .offset(after);
  }

  public async getStorageColorsForStorageIds(storageIds: number[]) {
    const mapping = await knex
      .select('id AS storageId', 'colorId AS id')
      .from('storage')
      .whereIn('id', storageIds);

    const colors = await knex
      .select('id', 'color')
      .from('storage_color')
      .whereIn('id', mapping.map((c: StorageColor) => c.id));

      let res = [];

      for (const s of mapping) {
        const color = find(colors, {id: s.id});
        if (color) {
          res.push(color);
        } else {
          res.push(null);
        }
      }

      return res;
  }

  public async getStorageLocationsForStorageIds(storageIds: number[]) {
    const mapping = await knex
      .select('id AS storageId', 'locationId AS id')
      .from('storage')
      .whereIn('id', storageIds);

    const locations = await knex
      .select('id', 'name')
      .from('storage_location')
      .whereIn('id', mapping.map((c: StorageLocation) => c.id));

    let res = [];

    for (const s of mapping) {
      const location = find(locations, { id: s.id });
      if (location) {
        res.push(location);
      } else {
        res.push(null);
      }
    }

    return res;
  }

  public getTotal() {
    return knex('storage')
      .countDistinct('id as count')
      .first();
  }

  public storage(id: number) {
    return knex
      .select('id', 'name')
      .from('storage')
      .where('id', '=', id)
      .first();
  }

  public addStorage(params: Storage) {
    return returnId(knex('storage')).insert(params);
  }

  public deleteStorage(id: number) {
    return knex('storage')
      .where('id', '=', id)
      .del();
  }

  public editStorage({ id, name, colorId, locationId }: Storage & Identifier) {
    return knex('storage')
      .where('id', '=', id)
      .update({ name, colorId, locationId });
  }
}
