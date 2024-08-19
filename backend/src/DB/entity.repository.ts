import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityQueryFilter: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel
      .findOne(entityQueryFilter, {
        __v: 0,
        ...projection,
      })
      .exec();
  }

  async find(
    entityQueryFilter: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T[] | null> {
    return this.entityModel
      .find(entityQueryFilter, {
        __v: 0,
        ...projection,
      })
      .exec();
  }

  async create(createEntityData: Partial<T>): Promise<T> {
    return this.entityModel.create(createEntityData);
  }

  async findOneAndUpdate(
    entityQueryFilter: FilterQuery<T>,
    updateEntityData: UpdateQuery<Partial<T>>,
  ): Promise<T | null> {
    return this.entityModel
      .findOneAndUpdate(entityQueryFilter, updateEntityData, {
        new: true,
      })
      .exec();
  }

  async findOneAndDelete(enitityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const { deletedCount } = await this.entityModel
      .deleteOne(enitityFilterQuery)
      .exec();
    return deletedCount > 0;
  }
}
