export const schemaOption = {
  versionKey: false,
  timestamps: true,
};

export const virtualSchemaOption = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};
