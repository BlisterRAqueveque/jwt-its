import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_URL: string;
  SIGNATURE: string;
  EXPIRE: string;
  ADMIN_PASS: string;
  ADMIN_USER: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_URL: joi.string().required(),
    SIGNATURE: joi.string().required(),
    EXPIRE: joi.string().required(),
    ADMIN_PASS: joi.string().required(),
    ADMIN_USER: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  db_url: envVars.DB_URL,
  signature: envVars.SIGNATURE,
  expire: envVars.EXPIRE,
  admin_pass: envVars.ADMIN_PASS,
  admin_user: envVars.ADMIN_USER,
};
