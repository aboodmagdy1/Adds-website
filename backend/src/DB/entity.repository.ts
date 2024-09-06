import {
  Document,
  FilterQuery,
  Model,
  PopulateOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  // Helper function to normalize populate options
  // if a string is passed convert it to population optino {path: '...'}
  private normalizePopulate(
    populateOption?: string | PopulateOptions | (string | PopulateOptions)[],
  ): PopulateOptions | (string | PopulateOptions)[] | undefined {
    if (typeof populateOption === 'string') {
      return { path: populateOption }; // Convert string to PopulateOptions
    }
    return populateOption;
  }

  async findOne(
    entityQueryFilter: FilterQuery<T>,
    projection?: Record<string, unknown>,
    populationOption?: PopulateOptions | string | (PopulateOptions | string)[],
  ): Promise<T | null> {
    const query = this.entityModel.findOne(entityQueryFilter, {
      __v: 0,
      ...projection,
    });
    const normalizedPopulate = this.normalizePopulate(populationOption);

    if (normalizedPopulate) {
      query.populate(normalizedPopulate);
    }

    return query.exec();
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
    const createdEntity = new this.entityModel(createEntityData);
    return createdEntity.save({});
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

  async updateMany(
    enitityFilterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<UpdateWriteOpResult> {
    return this.entityModel
      .updateMany(enitityFilterQuery, updateQuery, { new: true })
      .exec();
  }
}
