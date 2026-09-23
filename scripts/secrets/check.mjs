import { loadSecrets, ConfigurationError } from '../../back/config/secrets.mjs';

const required = process.argv.slice(2);
if (!required.length) {
  console.error('Usage: node scripts/secrets/check.mjs OPENAI_API_KEY [OTHER_SECRET ...]');
  process.exitCode = 1;
} else {
  try {
    loadSecrets({ required });
    console.log('Required settings are present. Live service connections were not tested.');
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error(`${error.code}: ${error.message} requestId=${error.requestId}`);
    } else {
      console.error('CONFIG_FAILED: Configuration could not be checked.');
    }
    process.exitCode = 1;
  }
}
