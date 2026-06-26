import unittest

from jarvis_core import AGENTS, WORKFLOWS, route_intent


class OrchestratorTests(unittest.TestCase):
    def test_catalog_matches_blueprint_agent_count(self):
        self.assertEqual(len(AGENTS), 18)

    def test_workflow_catalog_has_core_automation_rhythm(self):
        self.assertGreaterEqual(len(WORKFLOWS), 8)

    def test_routes_finance_intent(self):
        decision = route_intent("Check the overdue Stripe invoice and payment risk today")
        self.assertEqual(decision.agent_key, "finance")
        self.assertEqual(decision.agent_name, "Finance Agent")
        self.assertEqual(decision.urgency, 4)
        self.assertEqual(decision.action_type, "execute")
        self.assertGreater(decision.confidence, 0.8)

    def test_confirmation_gate_for_mutating_action(self):
        decision = route_intent("Reschedule my optional meeting after low sleep")
        self.assertEqual(decision.agent_key, "time")
        self.assertTrue(decision.requires_confirmation)
        self.assertEqual(decision.action_type, "execute")

    def test_unknown_intent_routes_to_decision_agent(self):
        decision = route_intent("Help me think through this weird tradeoff")
        self.assertEqual(decision.agent_key, "decision")
        self.assertIn("decision_journal", decision.retrieved_memories)


if __name__ == "__main__":
    unittest.main()
