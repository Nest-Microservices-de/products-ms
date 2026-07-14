import 'dotenv/config';
import * as joi from 'joi';

/**
 * garantizar que la aplicación cuente con una configuración inicial válida y
 *  segura antes de empezar a ejecutarse.

  En el desarrollo de software moderno, esto se conoce como validación de variables de entorno.
 */

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
}

// 1. Corregido: Se usa joi.object() para definir el esquema
const envVarsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
})
.unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// 2. Corregido: Asignación segura con aserción de tipo (as EnvVars)
const envsVars = value as EnvVars;

export const envs = {
    PORT : envsVars.PORT,
    DATABASE_URL: envsVars.DATABASE_URL
}

