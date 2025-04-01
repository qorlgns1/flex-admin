import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(9000),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SSL_ENABLED: Joi.boolean().default(false),
});

export const configModuleOptions = {
  isGlobal: true,
  envFilePath: ['.env.development.local', '.env.production.local'],
  validationSchema: configValidationSchema,
  validationOptions: {
    abortEarly: false,
  },
};
