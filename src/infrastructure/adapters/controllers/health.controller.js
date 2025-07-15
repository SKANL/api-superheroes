// Health check controller
export class HealthController {
  static check(req, res) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }
}
