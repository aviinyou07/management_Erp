const {
  getAnalyticsByUserId,
  updateAnalyticsByUserId
} = require("../repositories/analyticsRepository");

const getAnalytics = async (req, res) => {
  try {
    const rows = await getAnalyticsByUserId(req.user.id);

    return res.status(200).json(
      rows.length
        ? rows[0]
        : {
            profile_score: 0,
            profile_views: 0,
            post_impressions: 0,
            followers_count: 0,
            followers_change_pct: 0,
            post_impressions_change_pct: 0,
            profile_viewers_90d: 0,
            search_appearances_prev_week: 0,
            weekly_actions_done: 0,
            weekly_actions_goal: 3,
            weekly_start_date: null,
            weekly_end_date: null
          }
    );
  } catch (error) {
    console.error("Get analytics error:", error);
    return res.status(500).json({
      message: "Error fetching analytics",
      error: error.message
    });
  }
};

const updateAnalytics = async (req, res) => {
  try {
    await updateAnalyticsByUserId(req.user.id, req.body || {});
    return res.status(200).json({
      message: "Analytics updated successfully"
    });
  } catch (error) {
    console.error("Update analytics error:", error);
    return res.status(500).json({
      message: "Error updating analytics",
      error: error.message
    });
  }
};

module.exports = {
  getAnalytics,
  updateAnalytics
};