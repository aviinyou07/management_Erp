const pool = require("../config/db");

const getAnalyticsByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT
      profile_score,
      profile_views,
      post_impressions,
      followers_count,
      followers_change_pct,
      post_impressions_change_pct,
      profile_viewers_90d,
      search_appearances_prev_week,
      weekly_actions_done,
      weekly_actions_goal,
      weekly_start_date,
      weekly_end_date,
      updated_at
    FROM user_analytics
    WHERE user_id = ?`,
    [userId]
  );
  return rows;
};

const updateAnalyticsByUserId = async (userId, data) => {
  const [result] = await pool.execute(
    `INSERT INTO user_analytics (
      user_id,
      profile_score,
      profile_views,
      post_impressions,
      followers_count,
      followers_change_pct,
      post_impressions_change_pct,
      profile_viewers_90d,
      search_appearances_prev_week,
      weekly_actions_done,
      weekly_actions_goal,
      weekly_start_date,
      weekly_end_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      profile_score = VALUES(profile_score),
      profile_views = VALUES(profile_views),
      post_impressions = VALUES(post_impressions),
      followers_count = VALUES(followers_count),
      followers_change_pct = VALUES(followers_change_pct),
      post_impressions_change_pct = VALUES(post_impressions_change_pct),
      profile_viewers_90d = VALUES(profile_viewers_90d),
      search_appearances_prev_week = VALUES(search_appearances_prev_week),
      weekly_actions_done = VALUES(weekly_actions_done),
      weekly_actions_goal = VALUES(weekly_actions_goal),
      weekly_start_date = VALUES(weekly_start_date),
      weekly_end_date = VALUES(weekly_end_date)`,
    [
      userId,
      Number(data.profile_score) || 0,
      Number(data.profile_views) || 0,
      Number(data.post_impressions) || 0,
      Number(data.followers_count) || 0,
      Number(data.followers_change_pct) || 0,
      Number(data.post_impressions_change_pct) || 0,
      Number(data.profile_viewers_90d) || 0,
      Number(data.search_appearances_prev_week) || 0,
      Number(data.weekly_actions_done) || 0,
      Number(data.weekly_actions_goal) || 3,
      data.weekly_start_date || null,
      data.weekly_end_date || null
    ]
  );
  return result;
};

module.exports = {
  getAnalyticsByUserId,
  updateAnalyticsByUserId
};