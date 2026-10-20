// The environment names are the column headers of the "Environment URLs" table
// in test-data/localTestData.js, so TARGET_ENVIRONMENT must resolve to one of
// them exactly. Match case-insensitively ("dev" works) and reject anything
// else loudly: a miss used to fall through to the Production column, which
// would silently point real form submissions at the live site.
const KNOWN_ENVIRONMENTS = ['Dev', 'Dev1', 'Stage', 'Production'];

export function getTargetEnvironment() {
  const raw = (process.env.TARGET_ENVIRONMENT || 'Stage').trim();
  const match = KNOWN_ENVIRONMENTS.find((env) => env.toLowerCase() === raw.toLowerCase());
  if (!match) {
    throw new Error(`TARGET_ENVIRONMENT="${raw}" is not a known environment. Use one of: ${KNOWN_ENVIRONMENTS.join(', ')}`);
  }
  return match;
}
