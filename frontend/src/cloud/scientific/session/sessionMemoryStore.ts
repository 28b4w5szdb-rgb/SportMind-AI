/**
 * @deprecated Use persistence/persistenceMemoryStore — backward-compatible re-exports.
 */

export {
  getPersistedSession as getAssessmentSessionById,
  listPersistedSessions as listAssessmentSessions,
  listPersistedSessionsByAthlete as listAssessmentSessionsByAthlete,
  listPersistedSessionsByDefinition as listAssessmentSessionsByDefinition,
  listPersistedSessionsByOrganization as listAssessmentSessionsByOrganization,
  resetScientificPersistenceMemoryStore as resetAssessmentSessionMemoryStore,
} from '../persistence/persistenceMemoryStore';

/** @deprecated Use ScientificPersistenceGateway.persist */
export function appendAssessmentSession(): never {
  throw new Error('use_scientific_persistence_gateway');
}
